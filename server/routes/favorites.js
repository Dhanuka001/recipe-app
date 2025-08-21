const express = require("express");
const Favorite = require("../models/Favorite");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const items = await Favorite.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
  res.json({ items });
});

router.post("/", auth, async (req, res) => {
  const { recipeId, title, thumb, category, area } = req.body || {};
  if (!recipeId || !title || !thumb) return res.status(400).json({ error: "Invalid body" });
  try {
    const doc = await Favorite.create({ userId: req.userId, recipeId, title, thumb, category, area });
    res.json({ item: doc });
  } catch {
    res.status(409).json({ error: "Already in favorites" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  await Favorite.deleteOne({ _id: req.params.id, userId: req.userId });
  res.json({ ok: true });
});

module.exports = router;
