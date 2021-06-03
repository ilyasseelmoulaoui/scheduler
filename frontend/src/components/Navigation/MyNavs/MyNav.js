 
import React from 'react';
import {NavLink} from 'react-router-dom';
import './MyNav.css';
import AuthContext from '../../../context/auth-context';
//import AuthPage from '../../../pages/Auth';


const MyNav = props =>(


<AuthContext.Consumer>
  {(context)=>{
    return (
      <nav className="navbar navbar-expand-sm   navbar-light bg-light ">
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
      
          <div className="collapse navbar-collapse" id="navbarTogglerDemo03">
            <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
              <li className="nav-item">
              
                <NavLink to="/events" className="nav-link"> Events<span className="sr-only">(current)</span></NavLink>
              </li>
              {context.token&&(<li className="nav-item">
              <NavLink to="/bookings" className="nav-link"> bookings</NavLink>
              </li>)}
              {!context.token&&(<li className="nav-item dropdown dmenu">
              <NavLink to="/auth" className="nav-link"> Authenticate</NavLink>
              
            </li>)}
            {context.token&&(
           
            <li className="nav-item ">
              
              <button to="/auth" type="button" onClick={context.logout} id="logout" className="btn navbar-btn btn-light navbar-right">Logout</button>
            </li>)}
         
            
            </ul>
          
          </div>
        </nav>
    );
   }
  
  
  }
</AuthContext.Consumer>
)
      
      

export default MyNav;