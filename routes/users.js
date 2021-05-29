const express = require('express');
const User = require('../models/user');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { 
  res.send('respond with a resource');
});

//allows new user to register on website//
router.post('/signup', (req, res, next) => {
  //check to make sure that user name is not already taken//
  User.findOne({username: req.body.username})
  .then(user => {
      if (user) {
          const err = new Error(`User ${req.body.username} already exists!`);
          err.status = 403;
          return next(err);
      } else {
          User.create({
              username: req.body.username,
              password: req.body.password})
          .then(user => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({status: 'Registration Successful!', user: user});
          })
          .catch(err => next(err));
      }
  })
  .catch(err => next(err));
});

//login//
router.post('/login', (req, res, next) => {
// check to see if user is already logged in, based on cookies, auth header//
  if(!req.session.user) {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
          const err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');
          err.status = 401;
          return next(err);
      }
    
      const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      const username = auth[0];
      const password = auth[1];
     //if we find a user name that matches the database and what is logged in...//
      User.findOne({username: username})
      .then(user => {
        //if user name entered does not exist in our database//
          if (!user) {
              const err = new Error(`User ${username} does not exist!`);
              err.status = 401;
              return next(err);
        //if user name entered DOES exist in our database, check UN/PW but is incorrect//
          } else if (user.password !== password) {
              const err = new Error('Your password is incorrect!');
              err.status = 401;
              return next(err);
        //if UN exists, and UN/PW is correct...//      
          } else if (user.username === username && user.password === password) {
              req.session.user = 'authenticated';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'text/plain');
              res.end('You are authenticated!')
          }
      })
      .catch(err => next(err));
  } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('You are already authenticated!');
  }
});

router.get('/logout', (req, res, next) => {
  //if session exists, destroy session and clear cookies//
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  //if session does not exist (they are trying to log out but they aren't even logged in..)...let know they are not logged in..//    
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }
});

module.exports = router;
