import React from 'react';
import './BookingList.css';
const bookingList = props=>(

    <ul className="bookings__list">
        {props.bookings.map(booking=>{
            return (
            <li key={booking._id} className="bookings__list">
                <div className="bookings__item">
                {booking.event.title} - {'  '}
                 {new Date(booking.createdAt).toLocaleDateString()}
                 <button className="btn" onClick={props.onDelete.bind(this,booking._id)}>
                         cancel
                     </button>
                 </div>
                 
                   
                 
            </li>);
        })}
    </ul>

);
export default bookingList;