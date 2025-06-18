const mongoose = require('mongoose');

// Creating schema
const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true},
    description: { type: String, required: false},
    ingredients: { type: String, required: true},
    instructions: { type: String, required: true},
});

// Register the model
// two arguments: database model name with capital letter, and schema to apply to the model
const Recipe = mongoose.model('Recipe', recipeSchema);

// Export the model
module.exports = Recipe;


