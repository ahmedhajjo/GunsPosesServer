let io = require('socket.io')(process.env.PORT || 80)
var shortID = require('shortid')
console.log('server started')

var boss;
var sockets = [];
var users = [];



io.on('connection', function(socket){
    console.log('connection made....');

    let newID = shortID.generate();

    sockets[newID] = socket;

    socket.emit("register", { id : newID})
    
    socket.on('asuser', function(data){
        console.log('registered new user....');
        users[data.id] = sockets[data.id];
    //    console.log('getting data...');
    //    socket.emit('recive', data)
    })

    socket.on('asboss', function(data){
        console.log('registered the boss....');
        boss = sockets[data.id];
    })  

    socket.on('sendquest', function(data){
        socket.broadcast.emit('getquest', data);
        // testing..
    //    socket.emit('getquest', data);
    })

    socket.on('checkansw', function(data){
        socket.broadcast.emit('matchansw');
        // testing..
    //    socket.emit('matchansw');
    })

    socket.on('endstream', function(data){
        socket.broadcast.emit('endshow');
        // testing..
      //  socket.emit('endshow');
    })

    socket.on('disconnect', function(data){
        console.log('connection broken...');
        delete sockets[data.id];
    })   
})
