const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
   cuisine: String,
  type: String,
  cookTime: Number,
  instructions: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
