// /src/backend/models/message_models.js

import mongoose from 'mongoose';  // Use ES6 import syntax for mongoose

// Create message schema
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a 'User' model
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a 'User' model
    required: true
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Create and export the Message model using default export
export default mongoose.model('Message', messageSchema);
