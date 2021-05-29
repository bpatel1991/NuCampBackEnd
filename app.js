var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
//above- invoking require function with argument session file store//
//require function returning another fxn as its return value, then immediately calling that return function with second parameter list of session//

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//require mongoose module here//
const mongoose = require('mongoose');
const { read } = require('fs');

//url for mongoDB server//
const url = 'mongodb://localhost:27017/nucampsite';

//set up connection, add url and ways to handle deprecation warnings seen before //
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

//handle promise returned by connect method here. If connection to server succeeds, this message is console.logged. If error, console log the error.//
connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); muted out b/c can't use express sessions with cookie parser b/c has its own code//

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false, //when a new session is created but no updates are made to it, then at the end of the request it won't get saved b/c it will just be an empty session w/o any useful info; no cookie sent to client//
  resave: false, //once the session has been created, updated, and saved, it will be continually resaved whenever a request is made for that session- keeps request marked as active so it doesn't get deleted//
  store: new FileStore() //create an object to store session information to the server's hard disk//
}));

//custom middleware function named auth, must havve request and response objects as parameters, and then optionally the next function as a parameter if we intend to use it//
function auth (req, res, next) {
  console.log(req.session);
  
  
  if (!req.sessoion.user) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      const err = new Error ('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    //decode user name and password- takes auth header and extracts user name and password from it, puts it in Auth array//
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0]; //user as index zero//
    const pass = auth[1]; //password as index one//
    if (user === 'admin' && pass === 'password') {
      req.session.user = 'admin';
      return next(); // authorized
    } else {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        return next(err);
    }
  } else {
    if (req.session.user === 'admin') {
      return next();
    } else {
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
  }
}

app.use(auth);
//end auth function//

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
