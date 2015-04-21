var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL),
    passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy, // Must be included to use facebook authentication
    rooms = []
    
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

app.use(passport.initialize());
app.use(passport.session());

require('./auth/passportAuth.js')(passport, FacebookStrategy, config, mongoose);

require('./routes/routes.js')(express, app, passport, config);


// Nitrous.io listens on 0.0.0.0 instead of 127.0.0.0
// app.listen(3000, '0.0.0.0', function(){
//  console.log('working on port 3000');
// });

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./socket/socket.js')(io, rooms);

server.listen(app.get('port', function(){
  console.log('Chat on port: ' + app.get('port'))
}))