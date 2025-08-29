import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ items: [], message: "Purchase orders list" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Purchase order created" });
});

router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, status: "draft" });
});

router.put("/:id", async (req, res) => {
  res.json({ message: "Purchase order updated" });
});

router.post("/:id/approve", async (req, res) => {
  res.json({ message: "Purchase order approved" });
});

router.post("/:id/cancel", async (req, res) => {
  res.json({ message: "Purchase order canceled" });
});

export default router;
