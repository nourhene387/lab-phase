// /src/backend/models/user_model.js

import mongoose from 'mongoose';

// User schema definition
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  // Make these fields not required for database storage, but still validate them on the server
  confirmEmail: {
    type: String
  },
  confirmPassword: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  sexe: {
    type: String,
    required: true
  },
  dateofbirth: {
    type: Date,
    required: true
  },
  profilePic: {
    type: String,
    default: ""
  },
  contact: [{
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: 'User'
  }],
  memberSince: {
    type: Date,
    default: Date.now // This sets the default value to the current date and time
  }
});

// Export the model using default export
export default mongoose.model('User', userSchema);
