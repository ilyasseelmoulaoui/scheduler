const express = require('express');
//const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
//to add schema we need to import 
//the naming is called object distructring (the name contains input vars)
const mongoose = require('mongoose');
// those are the things we moved to other files
// to use them we should import them
//like user , events , buildschema ....
const graphQlSchema=require('./graphql/schema/index');
const graphQlResolvers=require('./graphql/resolvers/index');
// we will import the auth middleware
const isAuth = require('./middleware/is-auth');

const app =express();
app.use(express.json());


app.use((req,res,next)=>{
     res.setHeader('Access-Control-Allow-Origin','*');
     res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS');
     res.setHeader('Access-Control-Allow-Headers','Content-Type,Authorization');
     if (req.method==='OPTIONS'){
         return res.sendStatus(200);
     }
     next();
    });
    app.use(isAuth);
app.use('/graphql',graphqlHTTP({

    //needs info 
        // where to find schema query+mutation
        // we use _id because mongoDB uses it
        //go to schema/index.js and resolvers/index.js
        //we imported the files back into app.js 
        schema:graphQlSchema,
        rootValue:graphQlResolvers,
        graphiql: true
}));
/*app.get('/',(req,res,next)=>{
    res.send('hello world! ');

})*/
 mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.8nkbb.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(()=>{
     app.listen(8000);
 }).catch(err=>{
     console.log(err);
 });
 
