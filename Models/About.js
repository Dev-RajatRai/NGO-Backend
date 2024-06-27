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
    visiondescription:{
        type:String,
        required:true,
        trim:true
    },
    missiondescription:{
        type:String,
        required:true,
        
    }
})

const about =mongoose.model('about',aboutSchema)

export default about;