
import './Auth.css';
import React,{Component} from 'react';
import { Error } from 'mongoose';
import AuthContext from '../context/auth-context';

class AuthPage extends Component{
    state ={
        isLogin:true
         
    }

    static contextType=AuthContext;

    switchModeHandler=()=>{
        this.setState(prevState=>{
            return {isLogin : !prevState.isLogin}
        })
    }
    constructor(props){
        { /*  <!-- This is used to link the frontend to the backend  -->*/}
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

    }
        submitHandler=event=>{
            event.preventDefault();
            const email =this.emailEl.current.value;
            const password = this.passwordEl.current.value;

            { /*  <!-- Check if the email or The password are blank-->*/}
            if (email.trim().length ===0 || password.trim().length ===0)
            {
                { /*  <!-- return in this case means break -->*/}
                return;
            }
            //if we wanna log in :
            let requestBody={
                query:`
                query CreateUser($email: String!,$password: String!){
                    login(email: $email,password: $password){
                        userId
                        token 
                        tokenExpiration
                    }
                }
                `,
                variables:{
                    email:email,
                    password:password
                }
            };
            //if were not gonna log in :
            
                // override the request body variable from log in to sign up
            if (!this.state.isLogin){
                requestBody = {
                    query: `
                      mutation CreateUser($email: String!, $password: String!) {
                        createUser(userInput: {email: $email, password: $password}) {
                          _id
                          email
                        }
                      }
                    `,
                    variables: {
                      email: email,
                      password: password
                    }
                  };
            }
           
            //console.log(email,password);
            fetch('http://localhost:8000/graphql',{
                method:'POST',
                body:JSON.stringify(requestBody),
                //to tell the server in which format we are gonna be sending the request
                
                headers:{
                    'Content-Type':'application/json'

                }
            }).then(res=>{
                if (res.status !== 200 && res.status!==201){
                    throw new Error('Failed!');
                }
                return res.json();
              
            }).then(resData=>{
                if(resData.data.login.token){
                    this.context.login(resData.data.login.token,
                        resData.data.login.userId,
                        resData.data.login.tokenExpiration)
                }
            })
            .catch(err=>{
                console.log(err)
            });
        };
    render(){
        
        return (
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    { /*  <!-- Tabs Titles -->*/}

                    {/*<!-- Icon -->*/}
                <div className="fadeIn first">
                    {/*<!-- -->*/}
                    <img src="" id="icon"  />
                    
                    <h1>{this.state.isLogin ? 'Log in' :'Sign up'}</h1>
                    </div>
                    {/*<!-- Login Form --> */ }
                    <form onSubmit={this.submitHandler}>
                        <input type="text" id="Email" className="fadeIn second" name="login" placeholder="Email" ref={this.emailEl}/>
                        <input type="password" id="password" className="fadeIn third" name="login" placeholder="password" ref={this.passwordEl}/>
                        <input type="submit" className="fadeIn fourth" value={this.state.isLogin ? 'Log in' :'Sign up'}/>  

                    </form>

                    {/*  <!-- Remind Password -->*/}
                    <div id="formFooter">
                        <a className="underlineHover" href="#" onClick={this.switchModeHandler}>Switch to {this.state.isLogin ? 'Sign up' :'Login'} </a>  
                    </div>
                </div>

            </div>
           
        
        );
    }
}
export default AuthPage;
//vid 14 12:38