var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');

//require mongoose module here//
const mongoose = require('mongoose');
const { read } = require('fs');

//url for mongoDB server//
const url = config.mongoUrl;

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

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); muted out b/c can't use express sessions with cookie parser b/c has its own code//

//app.use(session({
  //name: 'session-id',
  //secret: '12345-67890-09876-54321',
  //saveUninitialized: false, //when a new session is created but no updates are made to it, then at the end of the request it won't get saved b/c it will just be an empty session w/o any useful info; no cookie sent to client//
  //resave: false, //once the session has been created, updated, and saved, it will be continually resaved whenever a request is made for that session- keeps request marked as active so it doesn't get deleted//
  //store: new FileStore() //create an object to store session information to the server's hard disk//
//}));

app.use(passport.initialize()); ///middleware function from passport//
//app.use(passport.session()); ///middleware function from passport//

app.use('/', indexRouter);
app.use('/users', usersRouter);
//custom middleware function named auth, must havve request and response objects as parameters, and then optionally the next function as a parameter if we intend to use it//
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
      const err = new Error('You are not authenticated!');                    
      err.status = 401;
      return next(err);
  } else {
      return next();
  }
}

app.use(auth);
//end auth function//

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
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
