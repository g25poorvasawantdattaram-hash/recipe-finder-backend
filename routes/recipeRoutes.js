const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  getRecipes,
} = require('../controllers/recipeController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, createRecipe);
router.delete('/:id', auth, deleteRecipe);
// In routes/recipeRoutes.js
router.put('/:id', auth, updateRecipe);

router.get('/', getRecipes);

module.exports = router;
