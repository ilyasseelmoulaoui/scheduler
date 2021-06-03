const Booking = require('../../models/booking');
const { transformBooking  , transformEvent}=require ('./merge');
const Event = require('../../models/event');

 module.exports={
   
    bookings: async(args,req)=>{
          // here we will test if the token is valid before we can add new event
          if(!req.isAuth){
            throw new Error('Unauthenticated !');
         }
        try{
           const bookings = await Booking.find({user: req.userId});
           return bookings.map(booking=>{
               return transformBooking(booking);
           });
        }
         catch(err){
            throw err;
        }
    },

   
    //we access the input arg name
  
    bookEvent : async (args,req) =>{
          // here we will test if the token is valid before we can add new event
          if(!req.isAuth){
            throw new Error('Unauthenticated !');
         }
        const fetchedEvent = await Event.findOne({_id:args.eventId});
        const booking = new Booking({
           user: req.userId,
           event:fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result) ;
    },
    //this function deletes bookings
    cancelBooking: async (args,req) =>{
          // here we will test if the token is valid before we can add new event
          if(!req.isAuth){
            throw new Error('Unauthenticated !');
         }
        try {
            const booking =await Booking.findById(args.bookingId).populate('event');
            const event =transformEvent(booking.event);
            // the creator bind gives us the ability to drill into the events 
               
            await Booking.deleteOne({_id:args.bookingId});
                return event;

        }catch(err){
            throw err;
        }
    }
}
//vid 14