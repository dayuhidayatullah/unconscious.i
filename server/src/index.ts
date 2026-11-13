import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config, pool } from "./db.js";
import { publicRouter } from "./routes/public.js";
import { adminRouter } from "./routes/admin.js";

if (!config.adminKey || config.adminKey === "change-me") {
  console.warn("⚠  ADMIN_API_KEY belum diatur dengan aman — endpoint admin tidak boleh dipakai di produksi.");
}

const app = express();
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "50kb" }));

app.get("/api/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ ok: true });
});

// Batasi endpoint yang menulis data agar tidak mudah di-spam.
const writeLimiter = rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false });
app.post("/api/newsletter", writeLimiter);
app.post("/api/orders", writeLimiter);
app.post("/api/promo/validate", writeLimiter);

app.use("/api/admin", rateLimit({ windowMs: 60_000, limit: 120 }), adminRouter);
app.use("/api", publicRouter);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});

app.listen(config.port, () => console.log(`API berjalan di http://localhost:${config.port}`));
