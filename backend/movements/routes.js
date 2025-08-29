import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Movement created" });
});

router.get("/history", async (req, res) => {
  res.json({ items: [], message: "Movement history" });
});

router.get("/product/:productId", async (req, res) => {
  res.json({ items: [], productId: req.params.productId });
});

router.delete("/:id", async (req, res) => {
  res.json({ message: "Movement canceled" });
});

export default router;
