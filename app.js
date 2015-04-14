var express = require('express'),
    app = express();

// next parameter ensures that other routes are looked
// for and should be used
app.route('/').get(function(req, res, next){
  res.send('<h1> Hello World </h1>');
})

app.listen(3000, '0.0.0.0', function(){
  console.log('working on port 3000');
});