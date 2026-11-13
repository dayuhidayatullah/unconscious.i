import { timingSafeEqual } from "node:crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { config, pool } from "../db.js";

export const adminRouter = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const given = Buffer.from(String(req.header("x-admin-key") ?? ""));
  const expected = Buffer.from(config.adminKey);
  if (!config.adminKey || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
adminRouter.use(requireAdmin);

const productSchema = z.object({
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  price: z.number().int().min(0),
  originalPrice: z.number().int().min(0).nullish(),
  image: z.string().min(1),
  images: z.array(z.string()).default([]),
  badge: z.string().max(20).nullish(),
  description: z.string().default(""),
  sizes: z.array(z.string().min(1).max(20)).min(1),
  stock: z.number().int().min(0).default(100),
  active: z.boolean().default(true),
});

const idParam = (req: Request) => Number(req.params.id);

// ---------- Produk ----------
adminRouter.get("/products", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM products ORDER BY id");
  res.json(rows);
});

adminRouter.post("/products", async (req, res) => {
  const p = productSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message });
  const d = p.data;
  const { rows } = await pool.query(
    `INSERT INTO products (name, category, price, original_price, image, images, badge, description, sizes, stock, active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [d.name, d.category, d.price, d.originalPrice ?? null, d.image, d.images, d.badge ?? null, d.description, d.sizes, d.stock, d.active],
  );
  res.status(201).json(rows[0]);
});

adminRouter.put("/products/:id", async (req, res) => {
  const p = productSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message });
  const d = p.data;
  const { rows } = await pool.query(
    `UPDATE products SET name=$2, category=$3, price=$4, original_price=$5, image=$6, images=$7,
       badge=$8, description=$9, sizes=$10, stock=$11, active=$12 WHERE id=$1 RETURNING *`,
    [idParam(req), d.name, d.category, d.price, d.originalPrice ?? null, d.image, d.images, d.badge ?? null, d.description, d.sizes, d.stock, d.active],
  );
  if (!rows[0]) return res.status(404).json({ error: "Tidak ditemukan" });
  res.json(rows[0]);
});

// Soft delete agar riwayat order tetap utuh.
adminRouter.delete("/products/:id", async (req, res) => {
  const { rowCount } = await pool.query("UPDATE products SET active=false WHERE id=$1", [idParam(req)]);
  if (!rowCount) return res.status(404).json({ error: "Tidak ditemukan" });
  res.status(204).end();
});

// ---------- Promo ----------
const promoSchema = z.object({
  code: z.string().trim().toUpperCase().min(3).max(50),
  percent: z.number().int().min(1).max(100),
  active: z.boolean().default(true),
  expiresAt: z.string().datetime().nullish(),
  maxUses: z.number().int().positive().nullish(),
});

adminRouter.get("/promos", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM promo_codes ORDER BY code");
  res.json(rows);
});

adminRouter.put("/promos", async (req, res) => {
  const p = promoSchema.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0]?.message });
  const d = p.data;
  const { rows } = await pool.query(
    `INSERT INTO promo_codes (code, percent, active, expires_at, max_uses) VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (code) DO UPDATE SET percent=$2, active=$3, expires_at=$4, max_uses=$5 RETURNING *`,
    [d.code, d.percent, d.active, d.expiresAt ?? null, d.maxUses ?? null],
  );
  res.json(rows[0]);
});

adminRouter.delete("/promos/:code", async (req, res) => {
  await pool.query("DELETE FROM promo_codes WHERE code=$1", [String(req.params.code).toUpperCase()]);
  res.status(204).end();
});

// ---------- Order ----------
adminRouter.get("/orders", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : null;
  const { rows } = await pool.query(
    `SELECT o.*, COALESCE(json_agg(json_build_object('name', i.name, 'size', i.size, 'quantity', i.quantity, 'unitPrice', i.unit_price))
              FILTER (WHERE i.id IS NOT NULL), '[]') AS items
       FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
      WHERE ($1::text IS NULL OR o.status = $1)
      GROUP BY o.id ORDER BY o.created_at DESC LIMIT 200`,
    [status],
  );
  res.json(rows);
});

adminRouter.patch("/orders/:id", async (req, res) => {
  const p = z.object({ status: z.enum(["pending", "paid", "shipped", "completed", "cancelled"]) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: "Status tidak valid" });
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows: cur } = await client.query("SELECT status FROM orders WHERE id=$1 FOR UPDATE", [idParam(req)]);
    if (!cur[0]) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tidak ditemukan" });
    }
    // Batalkan order -> kembalikan stok (sekali saja).
    if (p.data.status === "cancelled" && cur[0].status !== "cancelled") {
      await client.query(
        `UPDATE products p SET stock = p.stock + i.quantity
           FROM order_items i WHERE i.order_id=$1 AND i.product_id = p.id`,
        [idParam(req)],
      );
    }
    const { rows } = await client.query("UPDATE orders SET status=$2 WHERE id=$1 RETURNING *", [idParam(req), p.data.status]);
    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
});

// ---------- Subscriber ----------
adminRouter.get("/subscribers", async (_req, res) => {
  const { rows } = await pool.query("SELECT * FROM subscribers ORDER BY created_at DESC");
  res.json(rows);
});
