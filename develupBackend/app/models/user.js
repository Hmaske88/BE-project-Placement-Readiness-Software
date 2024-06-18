const mongoose = require('mongoose')
const Room = require('./room');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isMentor: {
        type: Boolean,
        required: true,
        default: false,
    },
    rooms: {
        type: Array,
        required: false,
    },
    summary:{
        type: String,
        required: false,
    },
    score:{
        type: Number,
        required: false,
    },
    history:{
        type: Array,
        required: false,
    },
    summary:{
        type: String,
        required: false,
    },
    isAdmin:{
        type: Boolean,
        required: false,
        default: false,
    }
    
});



const User = mongoose.model('User', userSchema);

module.exports = User;
