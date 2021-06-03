
const { Error } = require('mongoose');
const Event=require('../../models/event');
//we have to import user,events,singleevents from merge.js file
const {transformEvent}=require('./merge');
const User = require('../../models/user');

module.exports={
    events: async ()=>{
        //if we use populate mongoose collects the data from the relation it knows from the ref key
            //now we can access the email of the user from the event 
            try{
        const events=await Event.find()

            return events.map(event=>{
                //we call the transform event instead of writing the return data everytime

                return transformEvent(event);
            
        })
    }  catch(err){
            throw err;
        };
       
        return events;
    },
   
    createEvent: async  (args,req)=>   {
       
        // here we will test if the token is valid before we can add new event
         if(!req.isAuth){
            throw new Error('Unauthenticated !');
         }
        const event= new Event({
           
            title :args.eventInput.title,
            description : args.eventInput.description,
            price:+args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator :req.userId
        });
        let createdEvent;
        try{
       // events.push(event);
        //this save method is provided by mongoose will write those into the database
        const result= await event
        .save()
    
            createdEvent= transformEvent(result);
            //we call the transform event instead of writing the return data everytime

            
            const user=await User.findById(req.userId)
            console.log(result);
          

            if(!user){
                throw new mongoose.Error('User doesnt exist')
            }
  
            user.createdEvents.push(event);
            await user.save();
    
            return createdEvent;
     
        }catch(err){
            console.log(err);
            throw err; 
        };
        return event;
    }
    
   
}