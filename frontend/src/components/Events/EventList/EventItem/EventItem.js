import React from 'react';
import './EventItem.css';

const eventItem = props => (
    //to show events


<React.Fragment>
          

   
   
      <div className="col-md-4 on-hover" key={props.eventId}>
        <div className="card border-0 mb-4">
          <a href="#"><img className="card-img-top" src="https://cdn.pixabay.com/photo/2017/11/24/10/43/ticket-2974645_960_720.jpg" alt="wrappixel kit"/></a>
          <div className="date-pos bg-info-gradiant p-2 d-inline-block text-center rounded text-white position-absolute">{new Date(props.date).toLocaleDateString()}<span className="d-block"></span></div>
          <h5 className="font-weight-medium mt-3"><a href="#" className="text-decoration-none link"> {props.title}</a></h5>
          <p className="mt-3">{props.price} MAD</p>
          
          {props.userId === props.creatorId ? (
        <p>You're the owner of this event.</p>
      ) : (
      
        <a href="#" className="text-decoration-none linking text-themecolor mt-2" onClick={props.onDetail.bind(this, props.eventId)}> View Details</a>
      )}
        </div>
      </div>
 
    
  
    



    
    </React.Fragment>
);

export default eventItem;