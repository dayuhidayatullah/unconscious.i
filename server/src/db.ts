import "dotenv/config";
import pg from "pg";

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export const config = {
  port: Number(process.env.PORT ?? 3001),
  corsOrigin: (process.env.CORS_ORIGIN ?? "http://localhost:5173").split(",").map((s) => s.trim()),
  adminKey: process.env.ADMIN_API_KEY ?? "",
  freeShippingThreshold: Number(process.env.FREE_SHIPPING_THRESHOLD ?? 750000),
  shippingFee: Number(process.env.SHIPPING_FEE ?? 25000),
};
