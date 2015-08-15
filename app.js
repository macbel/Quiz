var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
//var partials = require('express-dynamic-partials');
var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
//app.use(cookieParser());
//app.use(session({ secret: 'keyboard cat', key: 'sid', cookie: { secure: true }}))
app.use(session());
//app.use(session({    secret: 'semilla',    resave: false,    saveUninitialized: true}));

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));



//helpers dinámicos
app.use(function(req, res, next){
  //guardar path en session.redir para después de login
  if (!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;

  }

  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

//Controlador de tiempo máximo de sesión
app.use (function (req, res, next) {
  var fecha = new Date();
  var timenow = fecha.getTime();
  if (req.session.user) {
    if (!req.session.time) {
      req.session.time = timenow;
      next();
    } else {
      if ((timenow - req.session.time) > 120000) { //tiempo máximo 2 minutos: 120.000 milisegundos
        delete req.session.user;
        delete req.session.time;
        next();
      } else {
        req.session.time = timenow;
        next();
      }
    }
  }else{
    next();
  }
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
