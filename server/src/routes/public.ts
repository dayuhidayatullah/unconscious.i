import { Router } from "express";
import type { PoolClient } from "pg";
import { z } from "zod";
import { config, pool } from "../db.js";

export const publicRouter = Router();

const mapProduct = (r: any) => ({
  id: r.id,
  name: r.name,
  category: r.category,
  price: r.price,
  originalPrice: r.original_price ?? undefined,
  image: r.image,
  images: r.images?.length ? r.images : undefined,
  badge: r.badge ?? undefined,
  description: r.description,
  sizes: r.sizes,
  stock: r.stock,
});

// ---------- Produk ----------
publicRouter.get("/products", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE active ORDER BY id");
  res.json(rows.map(mapProduct));
});

publicRouter.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "ID tidak valid" });
  const { rows } = await pool.query("SELECT * FROM products WHERE id=$1 AND active", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Produk tidak ditemukan" });
  res.json(mapProduct(rows[0]));
});

// ---------- Newsletter ----------
publicRouter.post("/newsletter", async (req, res) => {
  const parsed = z.object({ email: z.string().trim().toLowerCase().email().max(254) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Email tidak valid" });
  await pool.query("INSERT INTO subscribers (email) VALUES ($1) ON CONFLICT DO NOTHING", [parsed.data.email]);
  res.status(201).json({ ok: true });
});

// ---------- Promo & harga ----------
type Db = Pick<PoolClient, "query">;

async function lookupPromo(db: Db, code: string | null | undefined, forUpdate = false) {
  if (!code) return null;
  const { rows } = await db.query(
    `SELECT * FROM promo_codes WHERE code=$1 AND active
       AND (expires_at IS NULL OR expires_at > now())
       AND (max_uses IS NULL OR used_count < max_uses) ${forUpdate ? "FOR UPDATE" : ""}`,
    [code.trim().toUpperCase()],
  );
  return rows[0] as { code: string; percent: number } | undefined ?? null;
}

function totals(subtotal: number, percent: number) {
  const discount = Math.round((subtotal * percent) / 100);
  const afterDiscount = subtotal - discount;
  const shipping = subtotal === 0 || afterDiscount >= config.freeShippingThreshold ? 0 : config.shippingFee;
  return { discount, shipping, total: afterDiscount + shipping };
}

publicRouter.post("/promo/validate", async (req, res) => {
  const parsed = z.object({ code: z.string().min(1).max(50) }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Kode tidak valid" });
  const promo = await lookupPromo(pool, parsed.data.code);
  if (!promo) return res.status(404).json({ error: "Kode promo tidak valid" });
  res.json({ code: promo.code, percent: promo.percent });
});

// ---------- Order ----------
const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{8,20}$/, "Nomor telepon tidak valid"),
  address: z.string().trim().min(10).max(500),
  note: z.string().trim().max(500).optional(),
  promoCode: z.string().trim().max(50).nullish(),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        size: z.string().min(1).max(20),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(50),
});

class OrderError extends Error {}

publicRouter.post("/orders", async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Data tidak valid" });
  }
  const o = parsed.data;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Harga & stok selalu dari DB, bukan dari client. Kunci baris produk (urut id) agar aman dari race.
    const ids = [...new Set(o.items.map((i) => i.productId))].sort((a, b) => a - b);
    const { rows: prods } = await client.query(
      "SELECT * FROM products WHERE id = ANY($1) AND active ORDER BY id FOR UPDATE",
      [ids],
    );
    const byId = new Map<number, any>(prods.map((p) => [p.id, p]));

    const demand = new Map<number, number>();
    let subtotal = 0;
    const lines = o.items.map((i) => {
      const p = byId.get(i.productId);
      if (!p) throw new OrderError("Produk tidak tersedia");
      if (!p.sizes.includes(i.size)) throw new OrderError(`Ukuran ${i.size} tidak tersedia untuk ${p.name}`);
      demand.set(p.id, (demand.get(p.id) ?? 0) + i.quantity);
      subtotal += p.price * i.quantity;
      return { productId: p.id as number, name: p.name as string, size: i.size, quantity: i.quantity, unitPrice: p.price as number };
    });
    for (const [pid, qty] of demand) {
      if (byId.get(pid).stock < qty) throw new OrderError(`Stok ${byId.get(pid).name} tidak cukup`);
    }

    const promo = await lookupPromo(client, o.promoCode, true);
    if (o.promoCode && !promo) throw new OrderError("Kode promo tidak valid");
    const t = totals(subtotal, promo?.percent ?? 0);

    const { rows: orderRows } = await client.query(
      `INSERT INTO orders (customer_name, phone, address, note, subtotal, discount, shipping, total, promo_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, created_at`,
      [o.customerName, o.phone, o.address, o.note ?? null, subtotal, t.discount, t.shipping, t.total, promo?.code ?? null],
    );
    const orderId = orderRows[0].id as number;

    for (const l of lines) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, name, size, quantity, unit_price) VALUES ($1,$2,$3,$4,$5,$6)",
        [orderId, l.productId, l.name, l.size, l.quantity, l.unitPrice],
      );
    }
    for (const [pid, qty] of demand) {
      await client.query("UPDATE products SET stock = stock - $2 WHERE id=$1", [pid, qty]);
    }
    if (promo) await client.query("UPDATE promo_codes SET used_count = used_count + 1 WHERE code=$1", [promo.code]);

    await client.query("COMMIT");
    res.status(201).json({
      id: orderId,
      subtotal,
      discount: t.discount,
      shipping: t.shipping,
      total: t.total,
      promoCode: promo?.code ?? null,
      items: lines,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    if (e instanceof OrderError) return res.status(422).json({ error: e.message });
    throw e;
  } finally {
    client.release();
  }
});
