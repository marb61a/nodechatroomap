var express = require('express'),
    app = express(),
    path = require('path')

app.set('views', path.join(__dirname, 'views'));

// Uses hogan templating engine
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

// Set access to static files
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/routes.js')(express, app);

app.listen(3000, '0.0.0.0', function(){
  console.log('working on port 3000');
});