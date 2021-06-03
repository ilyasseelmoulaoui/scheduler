const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const {dateToSting}=require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
  });


  const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
  });
  


// in async function you always return top most "promise " in this case Event.find
const events = async  eventIds=>{
    try{
    const events= await Event.find({
        _id:{$in:eventIds }
        //this query to get all events where the id of the events defined in an array m passing
    })
    
    
    return events.map(event=>{
        //we call the transform event instead of writing the return data everytime
            return transformEvent(event);
        });
    
    }catch(err){
        throw err;
    }
    //this is a mongo db special syntaxe 
};
const singleEvent = async eventId=>{
    try {
        
                //we call the transform event instead of writing the return data everytime

                const event = await eventLoader.load(eventId.toString());
                return event;
    } catch (err) {
        throw err;
    }
}
const user= async userId=>{
    try {
    const user= await userLoader.load(userId.toString());
    
        return{
            ...user._doc,_id:user.id,
            createdEvents: () =>eventLoader.loadMany(user._doc.createdEvents)};
    }catch(err){
        throw err;
    }
};
//this function standardize the returning of data
const transformEvent = event =>{
    return{...event._doc,_id:event.id
        //this will convert the date from numbers to a readable date
        ,date:dateToSting(event._doc.date)

        ,creator:user.bind(this,event.creator)};
};
const transformBooking = booking=>{
    return {
        ...booking._doc,
        _id: booking.id,
        user : user.bind(this,booking._doc.user),
        event: singleEvent.bind(this,booking._doc.event),
        createdAt: dateToSting(booking._doc.createdAt),
        updatedAt:dateToSting(booking._doc.updatedAt),
        
    };
};
exports.transformBooking=transformBooking;
exports.transformEvent=transformEvent;
//exports.user = user;
//exports.events = events; 
//exports.singleEvent=singleEvent;