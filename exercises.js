// const mongoose = require('mongoose');
// require("dotenv/config");
// const Exercise = require('./models/Exercise.models.js');


// const exercises = [
//     {muscleGroup: "chest",
//     exercises: ["barbell bench press", "dumbell bench press", "incline barbell bench press", "decline barbell bench press", "incline dumbell bench press", "decline dumbell bench press", "dips", "dumbell fly", "machine fly", "machine press", "machine incline press", "machine decline press"]     
// },
//     {muscleGroup: "legs",
//     exercises: ["back squat", "elevated goblet squat", "bulgarian split squat", "hip thrust", "sumo squat", "leg press", "leg extension", "lunges", "hack squat", "romanian deadlift", "calf rasies", "treadmill on incline"]
// },
//     {muscleGroup: "back",
//     exercises: ["deadlift", "bent-over-row", "pull-up", "lat pull-down", "seated row", "t-bar row", "dumbell row", "chest supported-row", "kettlebell swings", "good mornings", "medicine ball wood chop", "dumbell back fly"]
// },
//     {muscleGroup: "arms",
//     exercises: ["dumbell curls", "cable curl", "hammer curl", "incline curl", "ez bar curl", "spider curl", "skull crushers", "close-grip bench press", "cable push-down", "tricep machine dip", "dumbell overhead extension", "single-arm cable kick-back"]
// },
//     {muscleGroup: "cardio",
//     exercises: ["treadmill jog", "jump-rope", "jumping-jax", "stair climber", "burpees", "biking", "high knees", "butt kicks", "rowing machine", "elliptical machine", "sprints", "treadmill speed-walk"]
// }, 
//     {muscleGroup: "shoulders",
//     exercises: ["shoulder press", "military press", "upward row", "lateral raise", "frontal raise", "arnold press", "cable shoulder extension", "barbell shrugs", "reverse fly", "cable lateral raise", "dumbell shrugs", "cable face pull"]
// }  
// ]

// Exercise.create(exercises)
// .then(function(results){
//     console.log("Exercises Saved", results)
//     mongoose.connection.close()
// })
// .catch (function(error){
//     console.log("Something went wrong", error.message)
//     mongoose.connection.close()
// })

// const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/project-2-FS-WEB-APP";

// mongoose
//   .connect(MONGO_URI)
//   .then((x) => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo: ", err);
//   });
