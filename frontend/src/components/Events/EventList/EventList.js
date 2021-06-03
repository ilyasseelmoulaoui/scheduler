import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';


const eventList = props => {
          //"map" transforms the list of events of JS objects into JSX elements so we can then output the list of JSX to display it
      const events = props.events.map(event => {
        return (
        <EventItem 
        key={event._id} 
        eventId={event._id} 
        title={event.title} 
        price={event.price}
        date={event.date}
        userId={props.authUserId} 
        creatorId = {event.creator._id}
        onDetail={props.onViewDetail}
        />
        );
      });

      return  <div className="blog-home2 py-5">
      <div className="container">
    
    < div className="row justify-content-center">
   
      <div className="col-md-8 text-center">
        <h3 className="my-3">Events</h3>
        <h6 className="subtitle font-weight-normal">You can find here all events available</h6>
      </div>
      <div className="row mt-4">
       {events} 
   
      </div>
      </div>
      </div>
      </div>
};

export default eventList;