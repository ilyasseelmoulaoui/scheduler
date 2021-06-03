const {buildSchema}=require('graphql');
module.exports=buildSchema(
    `
    type Booking{
        _id:ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }
    type Event{
        _id: ID! 
        title: String!
        description: String!
        price: Float!
        date: String!
        creator:User!
      
    }
    type User{
        _id:ID!
        email:String!
        password:String
        createdEvents:[Event!]
    }
    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!

    }
    input UserInput{
        email:String!
        password:String!
    } 
   

    input EventInput{
        
        title: String!
        description: String!
        price: Float!
        date: String!
    }
    type RootQuery {
        events: [Event!]!
        ${/* root query is the one who returns the values*/''}
        bookings: [Booking!]!
        ${/* creating a query to let a user log in */''}
        login(email: String!,password: String!): AuthData!
    }
    type RootMutation{
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput):User
        ${/*root mutation is the one who inserts new data */''}
        bookEvent(eventId: ID!): Booking!
        ${/*in this case root mutation will delete data instead */''}

        cancelBooking(bookingId: ID!):Event!

    }
    schema {
        query: RootQuery 
        
        mutation: RootMutation
    }
    `
    //create an event we named it like we would name a function
    //createEvent(name: String):String  the first string is input and the second one is output
    // events: [String] list of string and ! means they can't be null

      //mutation mean s MAJ we use it when we wanna change data or delete it
    //rootquery and root mutation could be named differently 
    //these back  ticks allow you to write multiline string in js 
    )