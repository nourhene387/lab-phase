// /src/backend/models/message_models.js

const mongoose = require('mongoose');

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

// Create and export the Message model
module.exports = mongoose.model('Message', messageSchema);
