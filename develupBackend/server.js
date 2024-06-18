const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const roomRoutes = require('./app/routes/roomRoutes.js');
const chatController = require('./app/controllers/chatController.js');
const database = require('./config/database.js');
const connectDB = require('./config/database.js');
const userRoutes = require('./app/routes/userRoutes.js');
const User = require('./app/models/user.js');
const Room = require('./app/models/room.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

connectDB()

// Use cors middleware
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true
    }
));
app.use(express.json());

// Use the userRoutes for /signup and /login routes
app.use('/api', userRoutes);
app.use('/api', roomRoutes);

app.get('/insert', async (req, res) => {
    const roomsData = [
        {
            name: 'React Coding Lounge',
            description: 'A place for React enthusiasts to discuss and code together.',
            mentor: 'John Doe',
            mentorId: '64d2816173db05126edb2bab',
            messages: [],
        },
        {
            name: 'JavaScript Ninja Dojo',
            description: 'Sharpen your JavaScript skills in this coding dojo.',
            mentor: 'Emily Brown',
            mentorId: '64d2816173db05126edb2bae',
            messages: [],
        },
        {
            name: 'Python Coding Camp',
            description: 'Explore the world of Python programming in this coding camp.',
            mentor: 'Olivia Wilson',
            mentorId: '64d2816173db05126edb2bb0',
            messages: [],
        },
        {
            name: 'Data Structures Playground',
            description: 'Dive into the world of data structures and algorithms in this playground.',
            mentor: 'Alexander Martinez',
            mentorId: '64d2816173db05126edb2bb3',
            messages: [],
        },
    ];


    Room.insertMany(roomsData)
        .then(() => {
            console.log('Users inserted successfully.');
        })
        .catch((error) => {
            console.error('Error inserting users:', error);
        });

})

// Default route
app.get('/', (req, res) => {
    res.send('Hello, welcome to the server!');
});


io.on('connection', (socket) => {

    socket.emit("me", socket.id)
    console.log('socket.id', socket.id);

    socket.on('joinChatRoom', (roomName) => {
        chatController.joinRoom(io, socket, roomName);
    });

    socket.on('disconnect', () => {
        chatController.handleDisconnect();
    });

    socket.on('chatMessage', (message, roomName) => {
        chatController.handleMessage(io, message, roomName);
    });

});

app.post('/joinroom', async (req, res) => {
    const { roomId, userId } = req.body;
    const user = await User.findById(userId);
    user.rooms.push(roomId);
    await user.save();
    res.json({ message: 'Room joined successfully' });
});

const port = 4000;
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
