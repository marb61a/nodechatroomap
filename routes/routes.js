module.exports = function(express, app){
  var router = express.Router();
  router.get('/', function(req, res, next){
    res.render('index', {title: 'Welcome to Node Chat App'})
  })
  
  router.get('/chatrooms', function(req, res, next){
    res.render('chatrooms', {title: 'Chat Rooms'})
  })
  
  app.use('/', router);
}