const Message = require('../models/message');

const getMessages = async (req, res) => {
    try {
        const message = await Message.find().sort({ timestamp: 1 });
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createMessage = async (req, res) => {
    const {sender, content} = req.body;

    if (!sender || !content) {
        return res.status(400).json({ message: 'Sender and content are required' });
    }

    try {
        const newMessage = new Message({
            sender,
            content,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getMessages,
    createMessage,
};