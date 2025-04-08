// config/socket.js
const Message = require('../models/message'); // ✅ Import the Message model

const socket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', async (data) => {
      console.log('Message received:', data);

      // Save to MongoDB
      try {
        const newMessage = new Message({
          sender:  data.sender ||'Anonymous', // You can replace this later with real user info
          content: data.content,
          timestamp: new Date(),
        });

        await newMessage.save();
        console.log('Message saved to DB');

        // Broadcast to all clients
        io.emit('chat message', {
            sender: newMessage.sender,
            content: newMessage.content,
            timestamp: newMessage.timestamp,
        });
      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

module.exports = socket;
