
// ws://127.0.0.1:80/socket.io/?EIO=4&transport=websocket
//ws://virtual-creativity.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
//ws://guns-poses.herokuapp.com

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http); 

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

    http.listen(process.env.PORT || 80,function(){
        console.log('listening on 80')
    });
    console.log("---------------Running Server----------------"); 
}) 



 