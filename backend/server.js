const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// for socket io
const http = require('http');
const { Server } = require('socket.io');

// Import db and socket connection 
const connectDB = require('./config/db');
const socketConfig = require('./config/socket');

// Import routes
const messageRoutes = require('./routes/messageRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:4200', // Angular frontend port
    methods: ['GET', 'POST']
}));
  
app.use(express.json());

// Connect to MongoDB
connectDB();

// Add API
app.use('/api/messages', messageRoutes);

// sockets
// Create HTTP server
const server = http.createServer(app);
// This is needed because Socket.IO runs on the lower-level HTTP server, not directly on the Express app.

// Create Socket.IO server
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:4200',
      methods: ['GET', 'POST']
    }
});

// socket function
socketConfig(io); 

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});