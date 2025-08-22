const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: Number,
      unit: String
    }
  ],
  cuisine: { type: String },
  type: { 
    type: String, 
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan'], 
    required: true 
  },
  cookTime: { type: Number },
  instructions: { type: String, required: true },
  imageUrl: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
