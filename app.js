
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



io.on('connection',function(socket){
    var thisClient = shortId.generate();

    var player = {
        id: thisClient,
        
            x :0,
            y:0,
            z:0

    };

    players[thisClient] = player;
    console.log('client connected , brodcasting spawn , id:', thisClient);
    socket.broadcast.emit('spawn', players[PlayerId]);
    socket.broadcast.emit('requestPos');



    for(var PlayerId in players){

        if(PlayerId == thisClient)
        continue;
        socket.emit('spawn', {id:PlayerId});
        console.log('sending spawn to new player', PlayerId);
     };

    socket.on('move', function(data){
        data.id = thisClient;
        console.log('client moved',JSON.stringify(data));
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
        socket.broadcast.emit('move', data);

    });

    socket.on('UpdatePosition', function(data){
            console.log('update Position :', data);
            data.id =thisClient;
            socket.broadcast.emit('UpdatePosition', data)
    });

    socket.on('disconnect', function()
    {
        console.log('ClientDisconnected');
        delete players[thisClient];
        socket.broadcast.emit('disconnected', {id: thisClient});

    });

   
 })

// mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {

//    if (err) throw err;

//    console.log('Successfully connected');

// });



