module.exports = function(io, rooms){
  var chatrooms = io.of('/roomlist').on('connection', function(socket){
    console.log('Connection established on the server')
    
    socket.on('newroom', function(data){
      rooms.push(data);
      socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
      socket.emit('roomupdate', JSON.stringify(rooms));
    })
  })
  
  var messages = io.of('/messages').on('connection', function(socket){
    console.log('Connected to the chatroom');
    
    socket.on('joinroom', function(data){
      socket.username = data.user;
      socket.userPic = data.userPic;
      socket.join(data.room);
      updateUserList(data.room, true);
    })
    
    socket.on('newMessage', function(data){
      socket.broadcast.to(data.room_number).emit('roomupdate', JSON.stringify(rooms));
    })
    
    function updateUserList(room){
      var getUsers = io.of('/messages').client(rooms);
      var userlist = [];
      for(var i in getUsers){
        userlist.push({user:getusers[i].username, userPic:getusers[i].userPic});
      }
      socket.to(room).emit('updateUsersList', JSON.stringify(userlist));
    }
    
    socket.on('updateList', function(data){
      updateUserList(data.room);
    })
    
  })
  
}