import express from "express";

const router = express.Router();

router.get("/kpis", async (req, res) => {
  res.json({ metrics: [] });
});

router.get("/top-products", async (req, res) => {
  res.json({ items: [] });
});

router.get("/sales-trends", async (req, res) => {
  res.json({ series: [] });
});

export default router;
