const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRout');
const msgRoutes = require('./routes/msgRout');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http'); // Import the http module
const socketIo = require('socket.io'); // Import socket.io

const Port = process.env.Port;

const app = express();

// Create HTTP server and pass the Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",  // Adjust for your front-end URL
    methods: ["GET", "POST"],
  },
});

// Set up socket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle sending message
  socket.on('sendMessage', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit('newMessage', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Use middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
require('./db/connect')();

// Set up routes
app.use('/api/users', userRoutes);
app.use('/api/messages', msgRoutes);

// Start the server
server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
