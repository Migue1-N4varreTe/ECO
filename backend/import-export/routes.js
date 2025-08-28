import express from "express";

const router = express.Router();

router.post("/import/csv", async (req, res) => {
  res.json({ message: "CSV import processed" });
});

router.get("/export/csv", async (req, res) => {
  res.json({ url: "/tmp/export.csv" });
});

router.post("/import/excel", async (req, res) => {
  res.json({ message: "Excel import processed" });
});

router.get("/export/excel", async (req, res) => {
  res.json({ url: "/tmp/export.xlsx" });
});

router.get("/export/pdf", async (req, res) => {
  res.json({ url: "/tmp/report.pdf" });
});

export default router;
