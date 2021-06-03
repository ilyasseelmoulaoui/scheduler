//this file can be named user.js

const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const {dateToSting}=require('../../helpers/date');
const User = require('../../models/user');


 module.exports={
   
  
    //we access the input arg name
    createUser : async args => {
        try{
        //to make sure the email adress is unique
        //well end up in the then block if we have one existing user with the same email
        const existingUser= await User.findOne({email:args.userInput.email})
 
            if(existingUser){
                throw new mongoose.Error('User exists already')
            }
            const hashedPassword=await  bcrypt
            .hash(args.userInput.password,12)
  
        //if we don't use return graphql won't wait for the line to finish

     
            const user = new User({
                email:args.userInput.email,
                password: hashedPassword
            })
                const result=await user.save();//this saves it into the database
            return{...result._doc,password:null,_id:result.id}
      
        }catch(err){
            throw err;
        };
        
        //to encrypt the password we will use bcryptjs
        
    },
    login: async({email,password})=>{
        //check if the email belongs to a user in the database
        const user= await User.findOne({email: email});
        //if a user does not exist with that email :
        if(!user){
            throw new mongoose.Error('This email / user  does not exist');

        }
        // if the user exists then :
            //to check if passwords match :
                 // this is a async function so we will need to wait for it 
        const isEqual = await bcrypt.compare(password,user.password)
        if(!isEqual){
                    //the user does exist but the password is wrong
            throw new mongoose.Error('The password you entered is wrong');
        }
        //we assign a token to the user in order to allow him to coonect to the app
            // we can add more data to the token to retrieve later if we want
                // the second argument is a string that hashes the token so it can stay secured 

        const token = jwt.sign({userId: user.id, email: user.email},'somesupersecretkey',
        {
            expiresIn:'1h'
        });
        return {
            userId: user.id, token :token,tokenExpiration :1

        }
    }
}
//rootmutation and root query are called resolvers
