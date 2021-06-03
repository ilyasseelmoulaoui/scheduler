//storage u can set up in your react app
    // you can access from within your react tree 
    import React from 'react';
export default React.createContext({
    token :null,
    userId:null,
    login:(token,userId,tokenExpiration)=>{},
    logout:()=>{}
});