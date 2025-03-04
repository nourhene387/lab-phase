const Message=require('../models/message_models')
const User=require('../models/user_model')
const {getReceiverSocketId }=require('../db/socket')
 const io =require('../db/socket')
// post massage by sender id
exports.sendMessage = async (req, res) => {
    try {
      const { text,image } = req.body;
      const { user_id: receiverId } = req.params;
      const senderId = req.user._id;
     
 
      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image
       
      });
  
      await newMessage.save();
  
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
// get all massages by sender id
exports.getMsgs=async(req,res)=>{
    try{
         const {id: userTochatId}=req.params;
         const myId=req.user._id;
         const messages=await Message.find({
             $or:[
                 {senderId:myId,receiverId:userTochatId},
                 {senderId:userTochatId,receiverId:myId}
             ],
         })
        return res.status(200).json(messages)
         

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"Server Error",err})
    }
}
// update message by id
exports.updateMsgs=async (req,res)=>{
  try{
    const { id } = req.user;
    console.log("userauth:", id);
    const {msg_id}=req.params;
    const newtext=req.body.text
    const msg=await Message.findById(msg_id);
    if(!msg){
      return res.status(404).json({message:"Message not found"})
    } 
     console.log(msg.senderId)
     if (msg.senderId.toString() === id) {
   // msg.text=newtext
   msg.text=newtext;
    console.log(msg.text)
    await msg.save()
    return res.status(200).json({message:'Message updated',msg})
    }
    return res.status(400).json({message:'you can not update the message',msg})
  }catch(err){
 console.log(err)
        return res.status(500).json({message:"Server Error",err})
  }
}
// delete message by id
exports.DeleteMessage = async (req, res) => {
  try {
    const { msg_id } = req.params;

    // Find and delete the message by ID
    const msg = await Message.findByIdAndDelete(msg_id);

    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.status(200).json({ message: 'Message deleted', msg });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error", err });
  }
};

