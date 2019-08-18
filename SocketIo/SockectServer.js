var io = require('socket.io') (process.env.PORT || 7000);
var mongoose = require('mongoose');
var shortId = require('shortid');

var matches=[];
var Match ={playerA: {},
    playerB:{},
    broadcast:function(message,data){
        this.playerA.emit(message,data);
        this.playerB.emit(message,data);
}};

console.log('Hello world');
var playerCount = 0;

io.on('connection',function(socket){
    var id;
    var playerID;
    console.log('client connected , brodcasting spawn , id:'+socket.data.id); 


    playerCount++;



/*
    app.get('/FindMatch/', function (req, res) {
    if (pendingMatch == 0) {
        pendingMatch = uuid();
        matches[pendingMatch] = {round:0,rand:-1, shot : false, shooterID : undefined, playerA : player[req.id], playerB};
        res.write(JSON.stringify({"lobbyId" : pendingMatch, "playerId" : 'A'}));
    }
    else {
        res.write(JSON.stringify({"lobbyId" : pendingMatch, "playerId" : 'B'}));
        matches[pendingMatch].playerB = players[req.id];
        pendingMatch = 0;
        }
        console.log('Pending match' + JSON.stringify(pendingMatch));
        res.send();

});
*/
    socket.on('disconnect', function()
    {
        if(playerID==0){
            matches[id].playerB.emit("win");
        }
        else{
            matches[id].playerA.emit("win");

        }
        console.log('ClientDisconnected');
    });
    socket.on("Ready",function(data){
        var matchID=data.id;
        id=matchID;
        if(matches[id]){
            matches[id].playerB=socket;
            playerID=1;
            matches[id].broadcast("all ready",null);
        }
        else{
            matches[id]=new Match();
            matches[id].playerA=socket;
            playerID=0;
        }
    });
}) 

 