const Recipe = require('../models/Recipe');

exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({ ...req.body, user: req.user.id });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecipes = async (req, res) => {
  try {
    const { ingredient, cuisine, type } = req.query;
    const query = {};

    if (ingredient) query.ingredients = { $in: [ingredient] };
    if (cuisine) query.cuisine = cuisine;
    if (type) query.type = type;

    const recipes = await Recipe.find(query);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await recipe.remove();
    res.json({ msg: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// In controllers/recipeController.js
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe || recipe.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
