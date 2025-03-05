const Message = require('../models/message_models');
const User = require('../models/user_model');
const { getReceiverSocketId } = require('../db/socket');
const io = require('../db/socket');

// Post message by sender ID
exports.sendMessage = async (req, res) => {
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
    console.error("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
};

// Get all messages by sender ID
exports.getMsgs = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages: ", err.message);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Update message by ID
exports.updateMsgs = async (req, res) => {
  try {
    const { msg_id } = req.params;
    const newText = req.body.text;
    const userId = req.user._id;

    const msg = await Message.findById(msg_id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (msg.senderId.toString() === userId.toString()) {
      msg.text = newText;
      await msg.save();
      return res.status(200).json({ message: "Message updated", msg });
    }

    return res.status(400).json({ message: "You cannot update this message" });
  } catch (err) {
    console.error("Error in updating message: ", err.message);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Delete message by ID
exports.deleteMessage = async (req, res) => {
  try {
    const { msg_id } = req.params;

    const msg = await Message.findByIdAndDelete(msg_id);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted", msg });
  } catch (err) {
    console.error("Error in deleting message: ", err.message);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
