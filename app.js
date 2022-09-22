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



// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

mongoose.connect('mongodb://localhost/authExample')
.then(x => console.log('successfully connected to ' + x.connections[0].name))
.catch(err => {
  console.log(err);
})

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', hbs);

app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 120000 // 120 * 1000 ms === 2 min
    },
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/authExample'
    })
  })
);

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

app.post('/account/recipes', (req, res, next) => {
  const myImage = req.body.recipeImage;
  const myIngredients = req.body.recipeIngredients;
  const myRecipeName = req.body.recipeName;
  const myMacros = req.body.recipeMacros;

  Recipe.create({
    recipeImage: myImage,
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
  res.render('publish.hbs')
})

app.get(`/account/:muscle`, async(req, res, next) => {
  const {muscle} = req.params;
  console.log(muscle)
  try{
    const muscleGroup = await axios.get(`https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`, {headers: {
        'X-API-Key': 'Tc1ngI4NyMOAhjkRQvLj/Q==7ySQLIlsJAowuAwI'
    }})
    console.log(muscleGroup.data[0])
    res.render('muscle-details.hbs', {muscleGroup: muscleGroup.data})
  }
  catch(err){
    console.log(err)
  }
})



module.exports = app;
