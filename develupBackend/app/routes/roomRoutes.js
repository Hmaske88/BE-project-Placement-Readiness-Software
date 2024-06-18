const express = require('express');
const chatController = require('../controllers/chatController.js');
const Message = require('../models/messageModel.js');
const Room = require('../models/room.js');

const router = express.Router();

router.get('/allrooms', async (req, res) => {
    try {
        // Fetch all unique room names from the database
        const rooms = await Room.find({}, { messages: 0 });
        res.json(rooms);
    } catch (error) {
        console.error('Error fetching rooms:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
