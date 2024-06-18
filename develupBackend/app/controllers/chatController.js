const Room = require('../models/room');

const chatController = {
    joinRoom: async (io, socket, roomName) => {
        socket.join(roomName);
        // Fetch chat history for the room and send it to the client
        try {
            const room = await Room.findOne({ _id: roomName });

            if (room) {
                console.log('Sending chat history:', room.messages);
                io.to(roomName).emit('messageHistory', room.messages);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    },

    handleMessage: async (io, message, roomName) => {
        // Find the room and add the new message to its messages array
        try {
            const room = await Room.findOne({ _id: roomName });
            if (room) {
                const newMessage = {
                    userName: message.userName,
                    userId: message.userId,
                    message: message.message,
                    timestamp: message.timestamp,
                };

                // If the 'messages' array doesn't exist, create it
                if (!room.messages) {
                    room.messages = [];
                }

                room.messages.push(newMessage);
                await room.save();

                // Emit the new message to all clients in the same room
                io.to(roomName).emit('chatMessage', newMessage);
            }
        } catch (error) {
            console.error('Error saving message:', error);
        }
    },

    handleDisconnect: () => {
        console.log('Client disconnected');
    },
};

module.exports = chatController;
