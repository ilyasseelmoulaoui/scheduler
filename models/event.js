const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const eventSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{ 
        type:Number,
        required:true
    },
    //there's no float in js
    date:{
        type:Date,
        required:true
    },
    creator:{
        type :Schema.Types.ObjectId,
        ref:'User'
    }
});
module.exports=mongoose.model('Event',eventSchema);
//this Event is the one gonna be used in user.ref 