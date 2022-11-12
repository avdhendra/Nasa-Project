const express=require('express')
const app=express()
const path=require('path')
const morgan=require('morgan') //see the log that come when you make any request
const cors=require('cors') //for allowing cross origin requests for different url

const api=require('../src/api_version/api')
const root=path.dirname(require.main.filename)


//security related middleware
app.use(cors({
    origin: 'http://localhost:3000' //with this origin we can make the cross origin request to localhost:3000
}))
app.use(morgan('combined'))
app.use(express.json()) ///It parses incoming requests with JSON payloads and is based on body-
//serve the client with node js

app.use(express.static(path.join(__dirname, '..','public ')))


app.use('/v1',api) // /v1/launches

app.get('/*',(req,res)=>{
    //get file in / index
    //res.sendFile('index.html',{root:path.join(__dirname,'../build')})
res.sendFile(path.join(__dirname,'..','public ','index.html'))
})

module.exports=app

//how to enable cross origin in api
//browser as a security feature block the cross origin request
//we can allow the cross origin request by setting the access-control-allow-origin:URL
//or allow all request for any site access-control-allow-origin:*
/**
 * Whitelisting  is the practice of explicity allowing access to a particular privilege or service it is the opposite of blacklisting
 * allow limiting site for cross origin requests
 */


/** we are working with the database which are in the cloud mongodb atlas*/