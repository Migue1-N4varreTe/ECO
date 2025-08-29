import express from "express";

const router = express.Router();

router.post("/inspection", async (req, res) => {
  res.json({ message: "Inspection recorded" });
});

router.get("/product/:productId", async (req, res) => {
  res.json({ productId: req.params.productId, issues: [] });
});

export default router;
