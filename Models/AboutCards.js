import mongoose from "mongoose";
const aboutSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },  
   
})

const aboutcard =mongoose.model('aboutcard',aboutSchema)

export default aboutcard;