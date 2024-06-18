const mongoose = require('mongoose');
const messageSchema = require('./messageModel');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    mentor: {
        type: String,
        required: true,
    },
    mentorId:{
        type:String,
        require:true,
    },
    messages: [new mongoose.Schema({
        userName: String,
        userId: String,
        message: String,
        timestamp: Number,
        room: String,
    })],
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
