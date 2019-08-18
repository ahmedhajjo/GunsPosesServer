
//ws://127.0.0.1:80/socket.io/?EIO=4&transport=websocket
//ws://virtual-creativity.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
//ws://guns-poses.herokuapp.com
//ws://guns-poses.herokuapp.com:80/socket.io/?EIO=4&transport=websocket

'use strict';
var express = require('express');
var uuid = require('uuid');
var mangoose = require('mongoose');
var app = express();
const bodyParser = require('body-parser');
var io = require('socket.io') (process.env.PORT || 7000);
require('dotenv/config');

app.use(bodyParser.json());

//import routes
const postsRoute = require('./Routes/posts');
app.use('/players', postsRoute);
app.use(express.urlencoded());

var pendingMatch = 0;
var players = [];
var listQ = [];
var matches = [];
var playerId;




//-------------------------------- SOCKET.IO functions --------------------------------

io.on('connection',function(socket){

    console.log('client connected' +  socket); 

    socket.on('joinedGame' , function(){
        
 
        playerId =  uuid();
        players[playerId] = {conSocket : socket, matchId : null};
    
        socket.emit('returnID', {'id': playerId});


    });


  
    socket.on('disconnect', function()
    {
        if(players[playerId] != null)
        {
        pendingMatch = 0;
        var recMatchId = players[playerId].matchId;
        var lobby = matches[recMatchId];
        console.log("Getting A id from match : " + matches[recMatchId].playerA);
        console.log("id A : " + lobby.playerA);
        players[lobby.playerA].conSocket.emit('matchOver',{'id': lobby.playerB});
        delete players[lobby.playerA];
        
        if(lobby.playerB != null){

        console.log("id B : " + lobby.playerB);
        players[lobby.playerB].conSocket.emit('matchOver',{'id': lobby.playerA});
        delete players[lobby.playerB];
    }
        delete matches[recMatchId];
    }



  
    });


    socket.on('FinishedTask', function(data) {
        console.log('stage over');
        players[matches[data.matchID].playerA].conSocket.emit('stageFinishMsg', {'id' : data.id});
        players[matches[data.matchID].playerB].conSocket.emit('stageFinishMsg', {'id' : data.id});
     
    });


}) 

function StartGame(lobbyID)
{
    players[matches[lobbyID].playerA].conSocket.emit('gameStarted', {'id' : null});
    players[matches[lobbyID].playerB].conSocket.emit('gameStarted', {'id' : null});
}

//-----------------------------------------------------------------------------------------




listQ.push({
    type: 0,
    text: 'something to write'
});

listQ.push({
    type: 0,
    text: 'something something55'
});

listQ.push({

    type: 0,
    text: 'something something 231'
})

listQ.push({

    type: 0,
    text: '11+1'

})

listQ.push({
    type: 1,
    text: '1 + 1 = 1?'
   
});

listQ.push({
    type: 1,
    text: 'something something55'
});

listQ.push({

    type: 1,
    text: 'something something 231'
})

listQ.push({

    type: 1,
    text: '11+1'

})


var listMCQ = [];
var ready=[];
listMCQ.push();


app.get('/question/:id', function (req, res) {
    console.log(req.params.id);
    var id = req.params.id;
    console.log('Request ID : ', id);
    var match = matches[id];
    if (match.round == 0) {
        if (match.rand == -1) {
            
            match.rand = parseInt(Math.random() * listQ.length);
        }
        res.write(JSON.stringify(listQ[match.rand]));
        console.log(listQ[match.rand].text);
    }
    res.send();

});


app.get('/IsLobbyReady/:id', function (req, res) {
    
    var readyState = ready[req.params.id];
    console.log('lobby player count : ' + readyState);
    let lobbyState = 'inactive';
    
    if(readyState==2){
        lobbyState = 'active';
        res.send(lobbyState);
    }

    else {
        res.send(lobbyState);
    }
});

app.post('/Ready', function (req, res) {
console.log("player of id" + req.body.id + " says ready... ");
     if(ready[req.body.id] == 1){
        ready[req.body.id] = 2;
        res.write(JSON.stringify("You are the second player.."));
    }
    else{
        ready[req.body.id] = 1;
        res.write(JSON.stringify("You joined first.."));
    }
    res.send();
});

    
app.get('/IsLobbyAlive/:id', function (req, res) {
    
    var readyState = ready[req.params.id];
    console.log('lobby player count : ' + readyState);
    let lobbyState = 'inactive';
    
    if(readyState==2){
        lobbyState = 'active';
        res.send(lobbyState);
    }

    else {
        res.send(lobbyState);
    }
});

    
app.get('/IsLobbyAlive/:id', function (req, res) {
    
    var readyState = ready[req.params.id];
    console.log('lobby player count : ' + readyState);
    let lobbyState = 'inactive';
    
    if(readyState==2){
        lobbyState = 'active';
        res.send(lobbyState);
    }

    else {
        res.send(lobbyState);
    }
});

app.post('/Disconnect', function (req, res) {
    console.log("lobby of id" + req.body.id + " has left ");
         if(ready[req.body.id] == 2){
            ready[req.body.id] = -1;

            res.write(JSON.stringify("Lobby Closed"));
        }
        else{
            res.write(JSON.stringify("LobbyStillHere"));
        }
        res.send();
});
   
app.post('/CreateMatch/', function (req, res) {
        if (pendingMatch == 0) {
            pendingMatch = uuid();
            matches[pendingMatch] = {round:0,rand:-1, shot : false, shooterID : undefined, playerA : req.body.id, playerB : null};
            players[req.body.id].matchId = pendingMatch;
            console.log("Player A ID : " + req.body.id);
            res.write(JSON.stringify({"lobbyId" : pendingMatch, "playerId" : 'A'}));
        }
        else {
            res.write(JSON.stringify({"lobbyId" : pendingMatch, "playerId" : 'B'}));
            matches[pendingMatch].playerB = req.body.id;
            players[req.body.id].matchId = pendingMatch;
            console.log("Player B ID : " + req.body.id);
            StartGame(pendingMatch);
            pendingMatch = 0;
            }
            console.log('Pending match' + JSON.stringify(pendingMatch));
            res.send();
    
});
        
app.get('/StateUpdate', function (req, res) {});

app.get('/Shoot', function (req, res) {});



//Connect Mongoose 
mangoose.connect(process.env.DB_CONNECITON,
{ useNewUrlParser: true }, () => 
console.log('Connected to DataBase!')
);


app.listen(4000);

