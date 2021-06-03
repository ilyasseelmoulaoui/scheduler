import './Events.css';
import React,{Component} from 'react';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
//import { Token } from 'graphql';
class EventsPage extends Component{
  state={
    creating:false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };
  isActive=true;

    //next lines are to access to AuthContext

    static contextType = AuthContext; 
     /*it allows us to interact with the context, 
     because in the context we can fetch the token.
      the token is a sign that we are authentificated 
      (we can't add events if we are not authentificated )*/

  constructor(props){
    { /*  <!-- This is used to link the frontend to the backend  -->*/}
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();

}
  //this fetches the events we already have in DB
  componentDidMount() {
    this.fetchEvents();
  }


  //this is event that toggles the modal 
  startCreateEventHandler=()=>{
    this.setState({creating:true});
  }
  //this method is for button confirm
  modalConfirmHandler=()=>{
    this.setState({creating:false});
    const title = this.titleElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;
    const price = +this.priceElRef.current.value;
    //check if the fields aren't empty
    if (title.trim().length===0
    ||price<=0||
    description.trim().length===0||
    date.trim().length===0){
      return;
    }
    const event = {title ,price,date,description};
    console.log(event);
      /*  the next lines are for sending the previous fetched 
  info to the grapghql backend */ 
      //this request body is to store the form info into the database
      const requestBody = {
        query: `
            mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
              createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
                _id
                title
                description
                date
                price
              }
            }
          `,
          variables: {
            title: title,
            desc: description,
            price: price,
            date: date
          }
      };
  

      const token = this.context.token;


      fetch('http://localhost:8000/graphql',{
      method:'POST',
      body:JSON.stringify(requestBody),
      //to tell the server in which format we are gonna be sending the request

      headers:{
          'Content-Type': 'application/json',
          //give the Auth info
          'Authorization': 'Bearer ' + token
      }
      }).then(res=>{
      if (res.status !== 200 && res.status!==201){
          throw new Error('Failed!');
      }
      return res.json();

      }).then(resData => {
      this.setState(prevState => {
      const updatedEvents = [...prevState.events];
      updatedEvents.push({
        _id: resData.data.createEvent._id,
        title: resData.data.createEvent.title,
        description: resData.data.createEvent.description,
        date: resData.data.createEvent.date,
        price: resData.data.createEvent.price,
        creator: {
          _id: this.context.userId
        }
      });
      return { events: updatedEvents };
      });
      })
      .catch(err=>{
      console.log(err)
      });};

    //this method is for button cancel 
      modalCancelHandler=()=>{
        this.setState({creating:false,selectedEvent: null});
      }
      
      
/*this method is to fetch the events list from the
 DB when we load this page and whenever
  we add a new event we want it to be added to our list*/
  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody={
      query :
      `query {
          events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
          }
      }
      `
  };

 // const token = this.context.token;


  fetch('http://localhost:8000/graphql',{
  method:'POST',
  body:JSON.stringify(requestBody),
  //to tell the server in which format we are gonna be sending the request

  headers:{
      'Content-Type': 'application/json'
  }
  }).then(res=>{
  if (res.status !== 200 && res.status!==201){
      throw new Error('Failed!');
  }
  return res.json();

  }).then(resData=>{
    const events = resData.data.events;
    if(this.isActive){
      this.setState({events: events, isLoading:false});
    }
 
  })
  .catch(err=>{
  console.log(err)
  if(this.isActive){
  this.setState({ isLoading: false });
  }
  });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return {selectedEvent: selectedEvent};
    });
  }


  bookEventHandler = () => {
    if(!this.context.token){
      this.setState({selectedEvent: null});
      return;
    }
    const requestBody = {
      query: `
          mutation BookEvent($id: ID!) {
            bookEvent(eventId: $id) {
              _id
             createdAt
             updatedAt
            }
          }
        `,
        variables: {
          id: this.state.selectedEvent._id
        }
    };


 


  fetch('http://localhost:8000/graphql',{
  method:'POST',
  body:JSON.stringify(requestBody),
  //to tell the server in which format we are gonna be sending the request

  headers:{
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.context.token
  }
  }).then(res=>{
  if (res.status !== 200 && res.status!==201){
      throw new Error('Failed!');
  }
  return res.json();

  }).then(resData=>{
  console.log(resData);
  this.setState({selectedEvent:null});

  })
  .catch(err=>{
  console.log(err)
  
  });

  };
  componentWillUnmount(){
    this.isActive=false;
  }
    render(){
        return (

        
         <React.Fragment>  
           {(this.state.creating || this.state.selectedEvent)  &&<Backdrop/>} 
             {this.state.creating &&
             ( <Modal title="Add Event" 
             canCancel
              canConfirm 
              onCancel={this.modalCancelHandler}
               onConfirm={this.modalConfirmHandler}
               confirmText="Confirm"
               >
                
 
                <div className="input-group mb-3">
                          

                  <span className="input-group-text" id="Title">Title</span>
                  <input type="text" className="form-control" placeholder="" aria-label="Title" aria-describedby="Title" ref={this.titleElRef} required="true"/>
                </div>
                
                <div class="input-group mb-3">
                  <span className="input-group-text">Date</span>
                  <div class="col-10">
                    <input class="form-control" type="datetime-local"  id="example-date-input" ref={this.dateElRef} required="true"/>
                  </div>
                </div>
                

                <div className="input-group mb-3">
                  <span className="input-group-text">MAD</span>
                  <input type="number
                  " className="form-control" aria-label="Amount" ref={this.priceElRef} required="true"/>
                  <span className="input-group-text">.00</span>
                </div>
                

                
                <div className="input-group">
                  <span className="input-group-text">Description</span>
                  <textarea className="form-control" aria-label="Description" ref={this.descriptionElRef} required="true"></textarea>
                </div>
                    
              </Modal>)}
              {/*this new modal is to book an event */}
              {this.state.selectedEvent && (
                <Modal 
                title= {this.state.selectedEvent.title}
                canCancel
                canConfirm
                onCancel={this.modalCancelHandler}
                onConfirm={this.bookEventHandler}
                confirmText={this.context.token?'Book':'Confirm'}
               >
                 <h1>{this.state.selectedEvent.title}</h1>
                <h2>
                  {this.state.selectedEvent.price} Dh - {new Date(this.state.selectedEvent.date).toLocaleDateString()}
                </h2>
                <p>
                  {this.state.selectedEvent.description}
                </p>


                 </Modal>
                 )}
                {/* next is to check if the token exist, if 
                it doesn't exist (we are not authentificated)
                 then the "create event" button won't appear*/} 
                    {this.context.token && (
                    <div className="events-control">
                      
                  <p>Share your own Events!</p>
                    </div>,
                                      
                  <div className="events-control" >
                          
                    <br/>
                  <button className="btn" onClick={this.startCreateEventHandler}>
                                  Create Event
                  </button>
                                
                  </div>
                  )}

                        {this.state.isLoading ? (
                        <Spinner/>    //display a spinner when loading is in progress
                        ) : (
                        <EventList 
                        events={this.state.events} 
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                        />
                        )}
                    
         </React.Fragment>
        
         
        )
 
    }
}
export default EventsPage;