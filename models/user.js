const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const userSchema= new Schema({
    email:{
        type:String,
        required:true,
    
    },
    password:{
        type:String,
        required:true
    },
//[] means array
    createdEvents:[{
        type:Schema.Types.ObjectId,
        ref:'Event'
    }]
    //ref allows u to set a relation (tells mongoose that two models are related)
        //similar to foreign key 
    //ids of event that a user created
})
module.exports=mongoose.model('User',userSchema);