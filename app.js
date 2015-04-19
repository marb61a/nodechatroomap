var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy; // Must be included to use facebook authentication

app.set('views', path.join(__dirname, 'views'));

// Uses hogan templating engine
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

// Set access to static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

var env = process.env.NODE_ENV ||'development';
if(env === 'development'){
  // Development Environment specific settings
  app.use(session({secret:config.sessionSecret}));
}else{
  // Production Environment settings
  app.use(session({
    secret: config.sessionSecret,
    store: new ConnectMongo({
      mongoose_connection : mongoose.connections[0],
      stringify:true
    })
  }))
}

var userSchema = mongoose.Schema({
  username:String,
  password:String,
  fullname:String
})


require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app);


// Nitrous.io listens on 0.0.0.0 instead of 127.0.0.0
app.listen(3000, '0.0.0.0', function(){
  console.log('working on port 3000');
});