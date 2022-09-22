const { Schema, model } = require('mongoose');

const exerciseSchema = new Schema(
    {
        muscleGroup: String,
        exercises: Array
    }
);

const Exercise = model("Exercise", exerciseSchema);

module.exports = Exercise;