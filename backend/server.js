// Add this at the very first line of server.js
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Allows your frontend to talk to this server

// 1. Connect to MongoDB (Use MongoDB Atlas for your online version)
mongoose.connect(process.env.MONGO_URI);

// 2. Define what a "Message" looks like
const MessageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// 3. The "POST" Route: Receive a message from the frontend
app.post('/send', async (req, res) => {
    try {
        const newMessage = new Message({ content: req.body.text });
        await newMessage.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save message" });
    }
});

// 4. The "GET" Route: View all messages (for you)
app.get('/messages', async (req, res) => {
    const messages = await Message.find().sort({ timestamp: -1 });
    res.json(messages);
});

app.listen(5000, () => console.log("Server running on port 5000"));