import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Receipt record created" });
});

router.post("/:id/partial", async (req, res) => {
  res.json({ message: "Partial receipt processed" });
});

router.post("/:id/apply", async (req, res) => {
  res.json({ message: "Stock updated from receipt" });
});

export default router;
