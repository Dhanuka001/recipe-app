const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const ALLOWED = new Set(["Beef", "Chicken", "Dessert", "Pasta", "Vegetarian"]);

router.get("/categories", async (_req, res) => {
  const r = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
  const j = await r.json();
  const categories = (j.categories || []).map(c => ({
    id: c.idCategory,
    name: c.strCategory,
    thumb: c.strCategoryThumb
  }));
  res.json({ categories });
});

router.get("/", async (req, res) => {
  const category = req.query.category || "";
  if (!ALLOWED.has(category)) return res.status(400).json({ error: "Invalid category" });
  const r = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`);
  const j = await r.json();
  const meals = (j.meals || []).map(m => ({ id: m.idMeal, title: m.strMeal, thumb: m.strMealThumb }));
  res.json({ meals });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: "Missing id" });
  const r = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const j = await r.json();
  const m = j.meals?.[0];
  if (!m) return res.status(404).json({ error: "Not found" });

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const name = m[`strIngredient${i}`];
    const measure = m[`strMeasure${i}`];
    if (name && name.trim()) ingredients.push({ name, measure: measure || "" });
  }

  res.json({
    meal: {
      id: m.idMeal,
      title: m.strMeal,
      thumb: m.strMealThumb,
      category: m.strCategory,
      area: m.strArea,
      instructions: m.strInstructions,
      ingredients
    }
  });
});

module.exports = router;
