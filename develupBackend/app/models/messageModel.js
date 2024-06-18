const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    userId: String,
    message: String,
    timestamp: Number,
    room: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
