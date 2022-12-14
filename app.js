require('dotenv/config')
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User.model');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { isAuthenticated, isNotAuthenticated } = require('./middlewares/auth.middlewares.js');
const Recipe = require('./models/Recipe.models');
const fileUploader = require("./config/cloudinary.config");



// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

mongoose.connect(process.env.MONGODB_URI)
.then(x => console.log('successfully connected to ' + x.connections[0].name))
.catch(err => {
  console.log(err);
})

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', hbs);
app.set('trust proxy', 1);

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 240000 // 240 * 1000 ms === 4 min
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
  })}
  ))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth.routes');
const router = require('./routes/auth.routes');



app.get('/', (req, res, next) => {
  console.log(req.session)
  console.log('Home Page Route is Working!!!');
  res.render('home-page.hbs');
});

app.get('/signup', isNotAuthenticated, (req, res, next) => {
  res.render('sign-up.hbs');
});

app.post('/signup', (req, res, next) => {
  console.log(req.body);

  const myEmail = req.body.email;
  const myPassword = req.body.password;

  const myHashedPassword = bcryptjs.hashSync(myPassword)

  User.create({
    email: myEmail,
    password: myHashedPassword
  })
  .then(savedUser => {
    console.log(savedUser);
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err)
    res.send(err);
  })
});

app.get('/login', isNotAuthenticated, (req, res, next) => {
  console.log('Login Page Route is Working!!!');
  res.render('login.hbs');
});

app.post('/login', (req, res, next) => {
  console.log(req.body);

  const myEmail = req.body.email;
  const myPassword = req.body.password;

  User.findOne({
    email: myEmail
  })
  .then(foundUser => {
    console.log(foundUser);
    if(!foundUser){
      res.send('no matching user')
      return;
    }

    const isValidPassword = bcryptjs.compareSync(myPassword, foundUser.password)

    if(!isValidPassword) {
      res.send('incorrect password')
      return;
    }

    req.session.user = foundUser

    res.redirect('/account')

  })
  .catch(err => {
    res.send(err)
  })
});

app.get('/account', (req, res, next) => {
    res.render('account.hbs', {email: req.session.user.email});
});

app.get('/account/recipes', (req, res, next) => {
  res.render('recipes.hbs')
})

app.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

app.post('/account/recipes',fileUploader.single('recipe-image'), (req, res, next) => {
  const myImage = req.body.recipeImage;
  const myIngredients = req.body.recipeIngredients;
  const myRecipeName = req.body.recipeName;
  const myMacros = req.body.recipeMacros;

  Recipe.create({
    recipeImage: req.file.path,
    recipeIngredients: myIngredients,
    recipeName: myRecipeName,
    recipeMacros: myMacros
  })
  .then(newRecipe => {
    res.render('recipes.hbs')
  })
  .catch(err => {
    console.log(err)
  })
})

app.get('/account/recipes/publish', (req, res, next) => {
  Recipe.find() 
  .then(allRecipes => {
    console.log(allRecipes)
    res.render('publish.hbs', {allRecipes})
  })
  .catch(err => {
    console.log(err)
  })
})

app.get(`/account/:muscle`, async(req, res, next) => {
  const {muscle} = req.params;
  console.log(muscle)
  try{
    const muscleGroup = await axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {headers: {
        'X-API-Key': process.env.EXERCISE_API
    }})
    console.log(muscleGroup.data[0])
    res.render('muscle-details.hbs', {muscleGroup: muscleGroup.data})
  }
  catch(err){
    console.log(err)
  }
})



module.exports = app;
