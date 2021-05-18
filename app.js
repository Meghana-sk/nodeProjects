require('dotenv').config();
console.log(process.env.PORT);
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sendRouter = require('./routes/send');
const conversionRouter  = require('./routes/conversion');

var myAPI = require('./routes/MyApi')

const passport = require('passport');
const Strategy = require( 'passport-google-oauth2' ).Strategy;

var app = express();

const BASE_PATH = '/api'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets',express.static(path.join(__dirname, 'uploads')));

app.use(BASE_PATH,myAPI)


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(BASE_PATH, sendRouter);
app.use(BASE_PATH, conversionRouter);

passport.use(new Strategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET_KEY,
  callbackURL:  process.env.GOOGLE_CALLBACK,
},
function(accessToken, refreshToken, profile, done) {
  // This callback is called when login is successfull with Google
  process.env.accessToken = accessToken;
  process.env.refreshToken = refreshToken; 
  process.env.profile = JSON.stringify(profile);
  done();
}
));

app.get('/google',
  passport.authenticate('google', { 
    scope:[ 'email', 'profile','https://www.googleapis.com/auth/gmail.send'],
    accessType: 'offline',
    prompt: 'consent', 
  }
));

app.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/'
}));

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
