import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ items: [], message: "Brands list" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Brand created" });
});

router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, name: "Marca" });
});

router.put("/:id", async (req, res) => {
  res.json({ message: "Brand updated" });
});

router.delete("/:id", async (req, res) => {
  res.json({ message: "Brand deleted" });
});

export default router;
