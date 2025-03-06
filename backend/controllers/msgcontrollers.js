import Message from '../models/message_models.js';
import User from '../models/user_model.js';
import { getReceiverSocketId } from '../db/socket';
import { io } from '../db/socket.js';

// Post message by sender id
const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
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

// Get all messages by sender id
 const getMsgs = async (req, res) => {
  try {
    const { id: userTochatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userTochatId },
        { senderId: userTochatId, receiverId: myId }
      ],
    });
    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error", err });
  }
};

// Update message by id
const updateMsgs = async (req, res) => {
  try {
    const { id } = req.user;
    console.log("userauth:", id);
    const { msg_id } = req.params;
    const newText = req.body.text;
    const msg = await Message.findById(msg_id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    console.log(msg.senderId);
    if (msg.senderId.toString() === id) {
      msg.text = newText;
      console.log(msg.text);
      await msg.save();
      return res.status(200).json({ message: 'Message updated', msg });
    }

    return res.status(400).json({ message: 'You cannot update the message', msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error", err });
  }
};

// Delete message by id
 const DeleteMessage = async (req, res) => {
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
const Controllers = {
  sendMessage,
  getMsgs,
  updateMsgs,
  DeleteMessage
};
 export default Controllers