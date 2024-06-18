const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Room = require('../models/room');
const mongoose = require('mongoose');

const register = async (req, res) => {
    try {
        const { name, email, password,summary } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            summary
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password,isAdmin } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // if(user.isAdmin != isAdmin){
        //     return res.status(401).json({ message: 'Not an admin' });
        // }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Return user information without generating a JWT token
        console.log(user)
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isMentor: user.isMentor,
                rooms: user.rooms,
                summary: user.summary,
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: `Invalid userId,${userId}` });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(!user.score){
            user.score = 23;
            await user.save();
        }

        if(!user.history){
            user.history = [
                {date: "2024-04-15", score: 23},
                {date: "2024-04-16", score: 12.43},
                {date: "2024-04-17", score: 29.88},
                {date: "2024-04-18", score: 25.44},
                {date: "2024-04-19", score: 22.86},
            ]
        }

        return res.status(200).json({user});
    } catch (error) {
        console.error('Error getting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getMemberRooms = async (req, res) => {
    try {
        const userId = req.body.userId;

        // Check if the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: `Invalid userId,${userId}` });
        }

        // Find the user by ID first
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the rooms from the user's 'rooms' field
        const memberRooms = user.rooms;

        for (let i = 0; i < memberRooms.length; i++) {
            const room = await Room.findById(memberRooms[i]);
            memberRooms[i] = room;
        }

        return res.status(200).json(memberRooms);
    } catch (error) {
        console.error('Error getting member rooms:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const joinRoom = async (req, res) => {
    try {
        const { roomId, userId } = req.body;

        // Check if the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: `Invalid userId,${userId}` });
        }

        // Check if the roomId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            return res.status(400).json({ error: `Invalid roomId,${roomId}` });
        }

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the room by ID
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Add the room to the user's 'rooms' field
        const isRoomAlreadyJoined = user.rooms.includes(roomId);
        if (isRoomAlreadyJoined) {
            return res.status(400).json({ error: 'Room already joined' });
        }
        user.rooms.push(roomId);
        await user.save();

        return res.status(200).json({ message: 'Room joined successfully' });
    } catch (error) {
        console.error('Error joining room:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

const resetUser = async (req, res) => {
    try {
        const email = req.params.email;

        const user = await User.findOneAndRemove({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User removed successfully' });
    } catch (error) {
        console.error('Error removing user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { register, login, getMemberRooms, resetUser,getUser,joinRoom };
