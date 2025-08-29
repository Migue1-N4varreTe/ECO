import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ items: [], message: "Suppliers list" });
});

router.post("/", async (req, res) => {
  res.status(201).json({ message: "Supplier created" });
});

router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, name: "Proveedor" });
});

router.put("/:id", async (req, res) => {
  res.json({ message: "Supplier updated" });
});

router.delete("/:id", async (req, res) => {
  res.json({ message: "Supplier deleted" });
});

export default router;
