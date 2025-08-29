import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ items: [], message: "Locations list" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Location created" });
});

router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, name: "Ubicación" });
});

router.put("/:id", async (req, res) => {
  res.json({ message: "Location updated" });
});

router.delete("/:id", async (req, res) => {
  res.json({ message: "Location deleted" });
});

export default router;
