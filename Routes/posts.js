const express = require('express');
const router = express.Router();
const posts = require('../Models/post');




router.get('/', function (req, res){

    res.send('testing');
    //players.param.playerId = 'Id:' + [players];
});



router.post('', function(req,res){

   // const post = new posts({})
    console.log(req.body);
});

module.exports = router;
