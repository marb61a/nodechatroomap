module.exports = function(){
  
  var chatUser = new mongoose.Schema({
    profileID : String,
    fullname : String,
    profilePic : String
  })
  
  userModel = mongoose.model('chatUser', chatUser);
  
  // User ID is stored in the session
  passport.serializeUser(function(user, done){
    done(null, userID);
  })
  
  passport.deSerializeUser(function(id, done){
    userModel.findById(id, function(err, user){
      done(err, user);
    })
  })
  
  // Sets up for facebook login
  passport.use(new FacebookStrategy({
    clientID: config.fb.appID,
    clientSecret: config.fb.appSecret,
    callbackURL: config.fb.callbackURL,
    profileFields: ['id', 'displayName', 'photos']
  }, function(accessToken, refreshToken, profile, done){
    // Check for user existence in DB 
    // If user does not exist then they will be created and on both occasions
    // a profile will be returned
    userModel.findOne({'profileId' : profile.id}, function(err, result){
      if(result){
        done(null, result)
      }else{
        // Create new user
        var newChatUser = new usermodel({
          profileID : profile.id,
          fullname : profile.displayName,
          profilePic : profile.photos[0].value || ''
        });
        
        newChatUser.save(function(err){
          done(null, newChatUser);
        })
      }
    })
    
  }))
}