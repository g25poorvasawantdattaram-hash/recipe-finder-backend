const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Recipe = require('../models/Recipe');

router.post('/', auth, createRecipe);
router.delete('/:id', auth, deleteRecipe);
// In routes/recipeRoutes.js
router.put('/:id', auth, updateRecipe);

router.get('/', async (req, res) => {
  const ingredient = req.query.ingredient;
  const recipes = await Recipe.find({ ingredients: { $in: [ingredient] } });
  res.json(recipes);
});

module.exports = router;
