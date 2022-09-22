const express = require('express');
const router = express.Router();
const User = require('../models/User.model')

router.get('/auth', (req, res, next) => {
  res.render('auth.hbs')
});

// router.get('/signup', (req, res, next) => {
//   res.render('sign-up.hbs');
// });

// router.post('/signup', (req, res, next) => {
//   console.log(req.body);

//   const myUsername = req.body.username;
//   const myPassword = req.body.password;

//   User.create({
//     username: myUsername,
//     password: myPassword
//   })
//   .then(savedUser => {
//     console.log(savedUser);
//     res.send(savedUser);
//   })
//   .catch(err => {
//     console.log(err)
//     res.send(err);
//   })
// });

module.exports = router;
