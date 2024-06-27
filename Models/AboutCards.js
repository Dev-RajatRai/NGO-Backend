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
    image: {
        type: String,
        required: true // Make it required if you want to ensure an image is uploaded
    }
})

const aboutcard =mongoose.model('aboutcard',aboutSchema)

export default aboutcard;