const mongoose=require('mongoose')

const launchesSchema=new mongoose.Schema({
    flightNumber:{
        type:Number,required:true
    },
    launchDate:{
        type:Date,required:true,
    },
    mission:{
        type:String,required:true
    },
    rocket:{
        type:String,required:true
    },
    //
    // target:{
    //     type:mongoose.ObjectId, //this id allow us to look up the planets from that planets collection
    //     ref:'Planet'
    // }

customers:[String],

    target:{
        type:String,
      
    }
    ,upcoming:{
        type:Boolean,required:true
    },
    success:{
        type:Boolean,required:true,default:true //if we dont pass the any succes property then it must be true all the time
    }
})
//Connect launchesSchema with the "launches" Collection
module.exports=mongoose.model("Launch",launchesSchema)
//Launch is collection name