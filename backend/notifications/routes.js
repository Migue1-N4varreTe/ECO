import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Notification created" });
});

router.get("/user/:userId", async (req, res) => {
  res.json({ items: [], userId: req.params.userId });
});

router.post("/:id/read", async (req, res) => {
  res.json({ message: "Notification marked as read" });
});

export default router;
