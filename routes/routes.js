module.exports = function(express, app){
  var router = express.Router();
  router.get('/', function(req, res, next){
    res.render('index', {title: 'Welcome to Node Chat App'})
  })
  
  router.get('/chatrooms', function(req, res, next){
    res.render('chatrooms', {title: 'Chat Rooms'})
  })
  
  router.get('/setcolor', function(req, res, next){
    req.session.favColor = "Red";
    res.send("Setting Favourite Colour ");
  })
  
  router.get('/getcolor', function(req, res, next){
    res.send("Favourite Colour is : " + (req.session.favColor===undefined?"Not Found":req.session.favColor))
  })
  
  
  app.use('/', router);
}