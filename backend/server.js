import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRout.js';
import msgRoutes from './routes/msgRout.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const Port = process.env.Port;
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] } });

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('sendMessage', (message) => io.emit('newMessage', message));
  socket.on('disconnect', () => console.log('A user disconnected'));
});

// Middleware & Routes
app.use(express.json());
app.use(cors(
  {origin: "http://localhost:3000",
    credentials: true,}
));
app.use(cookieParser());
import('./db/connect.js').then(connect => connect.default());

app.use('/api/users', userRoutes);
app.use('/api/messages', msgRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "../frontend/build", "index.html")));
}

server.listen(Port, () => console.log(`Server running on port ${Port}`));
