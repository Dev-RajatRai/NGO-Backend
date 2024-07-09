import mongoose from "mongoose";
const socialSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    designation:{
        type:String,
        required:true,
        trim:true
    },
    facebook:{
        type:String,
        required:true,
        trim:true
    },
    twitter:{
        type:String,
        required:true,
        
    },
    image: {
        type: String,
        required: true 
    }
})

const social =mongoose.model('socialmedia',socialSchema)

export default social;