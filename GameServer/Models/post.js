const mongoose = require('mongoose');


const PostSchema = mongoose.Schema({
 
    PlayerId : {
        type: String,
        required: true
    },
   question: {
        type:String,
        Answer:{} ,
        required:true
         
    },
    Date:{
        type:Date,
        default:Date.now
    }
   

});


module.exports = mongoose.model('Posts', PostSchema);






// var qm=mongoose.model('questions', PostSchema);
// qm.findOne({typw:'`1`'},function(err,ata){
//     ata.wins++;
// }).
// var q1=new qm();

// q1.wins=1;
// q1.save();
// q1.wins++;
// q1.save();
