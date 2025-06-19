const mongoose = require('mongoose');

// Creating schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    category: {type: String, required: true}, //categories like snacks, appetizers, salads, soups, main dishes, desserts, vegan, full-on junk food.
    description: { type: String, required: false},
    ingredients: { type: String, required: true},
    instructions: { type: String, required: true},
    isFavoriteRecipe: { type: Boolean, default: false}, //so can create favorite recipes page of favs go-to
    isDelicious: { type: Boolean, default: false},
});

// Register the model
// two arguments: database model name with capital letter, and schema to apply to the model
const Recipe = mongoose.model('Recipe', recipeSchema);

// Export the model
module.exports = Recipe;


