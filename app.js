
//ws://127.0.0.1:80/socket.io/?EIO=4&transport=websocket
//ws://virtual-creativity.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
//ws://guns-poses.herokuapp.com
//ws://guns-poses.herokuapp.com:80/socket.io/?EIO=4&transport=websocket

// var express = require('express');
// var app = express();
// var http = require('http').Server(app);
var io = require('socket.io')(process.env.PORT || 80); 
var mongoose = require('mongoose');

var uuid = require('uuid');
var shortId = require('shortid');
var players = [];

console.log('Hello world');




io.on('connection',function(socket){
    var thisClient = shortId.generate();
    players.push(thisClient);
    console.log('client connected , brodcasting spawn , id:', thisClient); 
    socket.broadcast.emit('spawn', {id: thisClient});
    
    
     players.forEach(function(PlayerId){

        if(PlayerId == thisClient)
        return;

        socket.emit('spawn', {id:PlayerId});
        console.log('sending spawn to new player', PlayerId);
     });

     


    socket.on('move', function(data){
        data.id = thisClient;
        console.log('client moved',JSON.stringify(data));
     
        socket.broadcast.emit('move', data);
        
    }); 

    socket.on('disconnect', function()
    {
        console.log('ClientDisconnected');
        players.splice(players.indexOf(thisClient),1);
        socket.broadcast.emit('disconnected', {id: thisClient});

    });

    // app.listen(process.env.PORT || 80,function(){
    //     console.log('listening on 80')
    // });
    // console.log("---------------Running Server----------------"); 
}) 

mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {
 
   if (err) throw err;
 
   console.log('Successfully connected');
 
});



 