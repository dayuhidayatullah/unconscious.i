import { pool } from "./db.js";
import { products } from "../../src/data/products.js";

const { rows } = await pool.query("SELECT count(*)::int AS n FROM products");
if (rows[0].n === 0) {
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (name, category, price, original_price, image, images, badge, description, sizes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [p.name, p.category, p.price, p.originalPrice ?? null, p.image, p.images ?? [], p.badge ?? null, p.description, p.sizes],
    );
  }
  console.log(`${products.length} produk di-seed.`);
} else {
  console.log("Tabel products sudah berisi, seed produk dilewati.");
}

await pool.query(
  `INSERT INTO promo_codes (code, percent) VALUES ('NEWDROP10', 10), ('UNCONSCIOUS15', 15)
   ON CONFLICT (code) DO NOTHING`,
);
console.log("Kode promo di-seed.");
await pool.end();
