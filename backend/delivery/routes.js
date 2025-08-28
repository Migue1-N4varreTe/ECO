import express from "express";

const router = express.Router();

router.get("/routes", async (req, res) => {
  res.json({ items: [], message: "Delivery routes" });
});

router.post("/assign", async (req, res) => {
  res.json({ message: "Order assigned" });
});

router.get("/staff", async (req, res) => {
  res.json({ items: [], message: "Delivery staff" });
});

router.get("/tracking/:orderId", async (req, res) => {
  res.json({ orderId: req.params.orderId, status: "on_the_way" });
});

export default router;
