const mongoose = require('mongoose');
const Schema =mongoose.Schema;
const bookingSchema= new Schema({
    event:{
        type: Schema.Types.ObjectId,
        ref:'Event'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:'User'
    },

  
},
    {
        timestamps:true
        //the timestamp is used to find out when a booking happened or created.
    }
);
module.exports = mongoose.model('Booking',bookingSchema);
