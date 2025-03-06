// /src/backend/socket.js

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5000'], // Change this to the appropriate client URL
  },
});

// Map to store the socket IDs of online users
const userSocketMap = {};

// Function to get the socket ID of a specific user
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Handle new connections
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Retrieve the user ID from the query params
  const userId = socket.handshake.query.userId;

  if (userId) {
    // Store the socket ID in the map
    userSocketMap[userId] = socket.id;
  }

  // Broadcast the list of online users
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
    if (userId) {
      // Remove the user from the map
      delete userSocketMap[userId];
    }

    // Broadcast the updated list of online users
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});

// Export the necessary objects for use in other parts of the app
export { io, app, server };
