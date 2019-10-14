
//ws://127.0.0.1:80/socket.io/?EIO=4&transport=websocket
//ws://virtual-creativity.herokuapp.com:80/socket.io/?EIO=4&transport=websocket
//ws://guns-poses.herokuapp.com
//ws://guns-poses.herokuapp.com:80/socket.io/?EIO=4&transport=websocket

'use strict';
var express = require('express');
var uuid = require('uuid');
var mongoose = require('mongoose');
var app = express();
const bodyParser = require('body-parser');
var io = require('socket.io') (process.env.PORT || 7000);
//require('dotenv/config');

app.use(bodyParser.json());


app.use(express.urlencoded());

var pendingMatch = 0;
var players = [];
var listQ = [];
var matches = [];
var playerId;

var listMCQ = [];
var ready=[];


//-------------------------------- Mongoose functions -----------------------------------------------------------
var db= mongoose.connection;

//Connect Mongoose 
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });

var PlayerSchema = new mongoose.Schema({
    id: String,
    name: String,
    topScoer:Number,
    gun: Number 
  });

  var QuestioonSchema = new mongoose.Schema({
    text: String,
    type: Number,
    Ans: {}
    
  });


var Player = mongoose.model('player', PlayerSchema);
var Question = mongoose.model('Question', QuestioonSchema);

// var q= new Question();
// q.text="gamestartedtyping";
// q.type=0;
// q.save();


Question.find({"type":0},(r,res)=>{
    listQ=res;
})

Question.find({"type":1},(r,res)=>{
    listMCQ=res;
})


var PlayersID = new player();
PlayersID.id = i
PlayersID.save(function (err) {
  if (err) return handleError(err);
 
});

//------------------------------------------------------------------------------------------------








//-------------------------------- SOCKET.IO functions --------------------------------

io.on('connection',function(socket){

    console.log('client connected' +  socket); 

    socket.on('joinedGame' , function(data){
    
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
        if(matches[data.matchID]!=null){
            players[matches[data.matchID].playerA].conSocket.emit('stageFinishMsg', {'id' : data.id});
            players[matches[data.matchID].playerB].conSocket.emit('stageFinishMsg', {'id' : data.id});    
        }
     
    });

    // socket.on('ShootPlayer', function(data) {
    //     console.log('Shoot the enemy!');
    //     players[matches[data.matchID].playerA].conSocket.emit('stageFinishMsg', {'id' : data.id});
    //     players[matches[data.matchID].playerB].conSocket.emit('stageFinishMsg', {'id' : data.id});
     
    // });

    
    


}) 

function StartGame(lobbyID)
{
    players[matches[lobbyID].playerA].conSocket.emit('gameStarted', {'id' : null});
    players[matches[lobbyID].playerB].conSocket.emit('gameStarted', {'id' : null});
}

//-----------------------------------------------------------------------------------------




//-------------------------------- Express functions --------------------------------


app.get('/question/:id/:roundID', function (req, res) {
    
    console.log(req.params.id);
    var id = req.params.id;
    var playerRoundID = req.params.roundID;
    console.log("Question caller | round id : " + playerRoundID);
    console.log('Request ID : ', id);
    var match = matches[id];

    if (playerRoundID == 0) {
        if (match.TypingQId == -1) {
            match.TypingQId = parseInt(Math.random() * listQ.length);
        }
        res.write(JSON.stringify(listQ[match.TypingQId].text));
        console.log(listQ[match.TypingQId].text);
    }

    if (playerRoundID == 1) {
        if (match.MCQId == -1) {
            match.MCQId = parseInt(Math.random() * listMCQ.length);
        }
        res.write(JSON.stringify(listMCQ[match.MCQId].text  + '|' + listMCQ[match.MCQId].Ans));
        console.log(listMCQ[match.MCQId].text  + '|' + listMCQ[match.MCQId].Ans);
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
            matches[pendingMatch] = {round:0, TypingQId:-1, MCQId:-1, shot : false, shooterID : undefined, playerA : req.body.id, playerB : null};
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
      
app.post('/Player/', function (req,res) {
    var id=req.body.id;
    var player= Player.findOne({"id":id},(err,res)=>{
        if(req.body.name){
            res.name=req.body.name;

        }
        if(req.body.score){
            res.score=req.body.score;
        }
        res.save();
    });


    res.send();
});

//-------------------------------------------------------------------------------------------






app.listen(4000);

