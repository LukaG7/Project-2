const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
    {
        recipeImage: String,
        recipeIngredients: String,
        recipeName: String,
        recipeMacros: String
    }
);

const Recipe = model("Recipe", recipeSchema);

module.exports = Recipe;