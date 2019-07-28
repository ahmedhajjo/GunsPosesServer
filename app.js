

var io = require('socket.io') (process.env.PORT || 3000);
var uuid = require('uuid');
var shortId = require('shortid');


console.log('Hello world');
var playerCount = 0;
var thisClient = shortId.generate();


io.on('connection',function(socket){
    console.log('client connected , brodcasting spawn , id:', thisClient); 


    socket.broadcast.emit('spawn', {id: thisClient});
    playerCount++;

    for(i=0; i < playerCount; i++)
    {
        socket.emit('spawn');
        console.log('sending spawn to new player');
    }
    

    socket.on('move', function(data){
       data.id = thisClient;
        console.log('client moved',JSON.stringify(data));
     
        socket.broadcast.emit('move', data);
        
    }); 

    socket.on('disconnect', function()
    {
        console.log('ClientDisconnected');
        playerCount--;
    });
}) 

 