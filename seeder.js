const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Recipe = require("./models/Recipe");

if (!process.env.MONGO_URI) {
  console.error("❌ Missing MONGO_URI in backend/.env");
  process.exit(1);
}

const recipes = [
  { title: "Pasta", ingredients: [{ name: "pasta" }, { name: "tomato" }, { name: "salt" }], instructions: "Boil pasta and mix with sauce.", type: "Vegetarian" },
  { title: "Vegetable Salad", ingredients: [{ name: "cucumber" }, { name: "tomato" }, { name: "lettuce" }, { name: "carrot" }], instructions: "Chop all vegetables and mix with dressing.", type: "Vegan" },
  { title: "Grilled Chicken", ingredients: [{ name: "chicken breast" }, { name: "olive oil" }, { name: "garlic" }, { name: "pepper" }], instructions: "Marinate chicken and grill for 20 minutes.", type: "Non-Vegetarian" },
  { title: "Paneer Butter Masala", ingredients: [{ name: "Paneer" }, { name: "butter" }, { name: "tomato puree" }, { name: "cream" }], instructions: "Cook Paneer in butter and tomato gravy with cream.", type: "Vegetarian" },
  { title: "Chicken Biryani", ingredients: [{ name: "chicken" }, { name: "rice" }, { name: "onion" }, { name: "spices" }], instructions: "Cook rice and chicken separately, then mix with spices.", type: "Non-Vegetarian" },
  { title: "Chocolate Cake", ingredients: [{ name: "flour" }, { name: "cocoa powder" }, { name: "sugar" }, { name: "eggs" }, { name: "butter" }], instructions: "Mix ingredients, bake at 180°C for 30 minutes.", type: "Vegetarian" }
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected…");
    await Recipe.deleteMany();
    await Recipe.insertMany(recipes);
    console.log("✅ Sample Recipes Imported!");
  } catch (err) {
    console.error("Seeder error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
})();
