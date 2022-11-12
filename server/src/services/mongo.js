const mongoose = require('mongoose')
//Database connection
const MONGO_URL=process.env.MONGO_URL
//if got the error set the DNS Setting in the yourConnection performing the transaction (wifi connection)
//see the bookmark

//how to check our connection is working 
//this callback called once when the connection is open Event Emitter
mongoose.connection.once('open',()=>{
    console.log('MongoDb Connection Ready')
})
// When connection is not establised
//every time when the connection is not establised
mongoose.connection.on('error',(err)=>{
console.log(err)
})

const connectionParams = {
    useNewUrlParser:true, //this defined how the mongoose parses the connection string in(MONGO_URL)
//useFindAndModify:false, //disable the outdate way of updating the data in mongo
//useCreateIndex: true, // which we use this createIndex function rather than old function AssureIndex
useUnifiedTopology:true //mongoose will use the updated way of talking to cluster of database

}

async function mongoConnect(){
    await mongoose.connect(MONGO_URL, connectionParams)
}


async function mongoDisconnect(){
    await mongoose.disconnect()
}
module.exports = {mongoConnect,mongoDisconnect}











//we need connect the mongo before we start listening to the server so that we get all the data before we making any request









//load the data before listen to the request because after listing loading data 

// //Database connection
// const MONGO_URL="mongodb+srv://Sarty:SdxbshIxqb7EjU2q@nasacluster.ni3tmye.mongodb.net/test"
// //if got the error set the DNS Setting in the yourConnection performing the transaction (wifi connection)
// //see the bookmark

// //how to check our connection is working 
// //this callback called once when the connection is open Event Emitter
// mongoose.connection.once('open',()=>{
//     console.log('MongoDb Connection Ready')
// })
// // When connection is not establised
// //every time when the connection is not establised
// mongoose.connection.on('error',(err)=>{
// console.log(err)
// })

// const connectionParams = {
//     useNewUrlParser:true, //this defined how the mongoose parses the connection string in(MONGO_URL)
// //useFindAndModify:false, //disable the outdate way of updating the data in mongo
// //useCreateIndex: true, // which we use this createIndex function rather than old function AssureIndex
// useUnifiedTopology:true //mongoose will use the updated way of talking to cluster of database

// }