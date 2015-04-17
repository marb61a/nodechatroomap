var express = require('express'),
    app = express(),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    config = require('./config/config.js'),
    ConnectMongo = require('connect-mongo')(session),
    mongoose = require('mongoose').connect(config.dbURL)

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
      //url:config.dbURL,
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


require('./routes/routes.js')(express, app);

app.listen(3000, '0.0.0.0', function(){
  console.log('working on port 3000');
});