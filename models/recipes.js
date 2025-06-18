const mongoose = require('mongoose');

// Creating schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String, required: false},
    ingredients: { type: String, required: true},
    instructions: { type: String, required: true},
});

// Register the model
const Recipe = mongoose.model('Recipe', recipeSchema);

// Export the model
module.exports = Recipe;

