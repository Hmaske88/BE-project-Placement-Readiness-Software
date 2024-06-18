import React, { useEffect, useRef, useState } from 'react';
import styles from './a.module.css'; // Update the import path with the correct module CSS file
import io from 'socket.io-client';
import { baseUrl } from '../../App';

const socket = io('http://localhost:4000'); // Initialize the socket outside the component

const ChatRoom = () => {
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [availableRooms, setAvailableRooms] = useState([]);

    const messageListRef = useRef(null);

    useEffect(() => {
        async function fetchRooms() {
            if (!localStorage.getItem('user')) {
                return;
            }
            const userData = JSON.parse(localStorage.getItem('user'));
            const userId = userData.id;
            setUserId(userId);
            setUserName(userData.name);
            try {
                const response = await fetch(`${baseUrl}/rooms`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: userId }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setAvailableRooms(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchRooms();
    }, []);

    useEffect(() => {
        if (roomName) {
            socket.emit('joinChatRoom', roomName._id);

            const handleIncomingMessage = (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
                if (messageListRef.current) {
                    messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
                }
            };

            const handleHistory = (history) => {
                setMessages(history);
                setLoading(false);
                if (messageListRef.current) {
                    messageListRef.current.scrollTo(0, messageListRef.current.scrollHeight);
                }
            };

            socket.on('chatMessage', handleIncomingMessage);
            socket.on('messageHistory', handleHistory);

            return () => {
                socket.off('chatMessage', handleIncomingMessage);
                socket.off('messageHistory', handleHistory);
                socket.emit('leaveChatRoom', roomName._id); // Emit leave room event
            };
        }
    }, [roomName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            const newMessage = {
                userName: userName,
                userId: userId,
                message: inputValue.trim(),
                timestamp: Date.now(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            socket.emit('chatMessage', newMessage, roomName);
            setInputValue('');
        }
    };

    const addDayBreaksToMessages = (messages) => {
        let modifiedMessages = [];
        let currentDate = null;

        for (const message of messages) {
            const messageDate = new Date(message.timestamp).toLocaleDateString();

            if (messageDate !== currentDate) {
                currentDate = messageDate;
                modifiedMessages.push({ type: 'dayBreak', date: messageDate });
            }

            modifiedMessages.push({ type: 'message', ...message });
        }

        return modifiedMessages;
    };

    return (
        <div className={styles.chatRoom}>
            <div className={styles.chatSidebar}>
                <h2>Chat Rooms:</h2>
                {!availableRooms ? (
                    <p>Loading rooms...</p>
                ) : (
                    availableRooms.length === 0 ? <p>No rooms found</p> :
                    availableRooms.map((room) => (
                        <div key={room?._id}>
                            <button
                                className={styles.roomButton}
                                onClick={() => setRoomName(room)}
                                style={{
                                    fontWeight: room === roomName ? 'bold' : 'normal',
                                    backgroundColor: room === roomName ? '#0065c4' : 'var(--primary-blue)',
                                }}
                            >
                                {room?.name || ''}
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className={styles.chatArea}>
                <h2>Chat Room: {roomName?.name || 'Select a room'}</h2>
                {loading ? (
                    <p>Loading messages...</p>
                ) : (
                    <div className={styles.messageList} ref={messageListRef}>
                        {addDayBreaksToMessages(messages).map((item, index) => (
                            <React.Fragment key={index}>
                                {item.type === 'dayBreak' && (
                                    <div className={styles.dayBreak}>
                                        <hr />
                                        <p>{item.date}</p>
                                        <hr />
                                    </div>
                                )}
                                {item.type === 'message' && (
                                    <div
                                        className={
                                            item.userId === userId
                                                ? `${styles.messageContainer} ${styles.userMessageContainer}`
                                                : styles.messageContainer
                                        }
                                    >
                                        <div
                                            className={`${styles.messageBubble} ${item.userId === userId ? styles.userMessageBubble : styles.otherMessageBubble}`}
                                        >
                                            <p className={styles.messageText}>{item.message}</p>
                                            <p className={styles.messageInfo}>{item.userName} - {new Date(item.timestamp).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                )}
                <form className={styles.chatForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={styles.chatFormInput}
                        placeholder="Type your message..."
                    />
                    <button type="submit" className={styles.chatFormButton}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatRoom;
