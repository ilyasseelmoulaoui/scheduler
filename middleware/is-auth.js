//the middleware is uset to run a bunch of tests in the background

//we added a library called json web token to help us with token management 
const jwt = require('jsonwebtoken');
//this will test if the token is valid or not
module.exports=(req,res,next) =>{
const authHeader = req.get('Authorization');
//we will look for the auth field
    //if we can't find it , it means that the token is not valid
    if (!authHeader){
        // you can call isAuth however you like as long as you don't override an other variable

        req.isAuth = false;
        return next();

    }
    const token =authHeader.split(' ')[1]; 
    //this will return the value:
        // Authorization : bearer/user
        //  value 44sbhdhebuhef
        //using the split it will only return bearer and value 
    

    //if we don't have a token :
    if(!token || token ===''){
        req.isAuth=false;
        return next();
    }
    let decodedToken ;
    try{
    //only tokens with this key will be taken
    decodedToken =  jwt.verify(token,'somesupersecretkey');
    }
    catch(err){
        req.isAuth =false;
        return next();
    }
    // if the token doesn't have the key 
    if (!decodedToken){
        req.isAuth = false;
        return next();
    }
    req.isAuth = true;
    req.userId=decodedToken.userId;
    next();
};