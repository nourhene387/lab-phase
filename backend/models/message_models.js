const mongoose= require('mongoose');

/********* */
// create message schema
const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    text:{
        type:String,
        
    },
    image:{
        type:String,
    },
   
    date:{
        type:Date,
        default:Date.now
    }

})
module .exports=mongoose.model('Messages',messageSchema)