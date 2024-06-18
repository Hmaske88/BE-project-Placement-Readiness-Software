import React, { useEffect, useState } from 'react';
import style from './a.module.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to get the user from localStorage if the window object is defined
        if (typeof window !== 'undefined') {
            const userData = JSON.parse(localStorage.getItem('user'));
            if (userData) {
                setUser(userData);
            }
        }

        setLoading(false);
    }, []);

    const handleLogout = () => {
        // Remove the user from localStorage if the window object is defined
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
            window.location.reload(); // Reload the page to reset the state
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        // If user is still not available, show a message or redirect to login
        return (
            <div className={style.profileContainer}>
                <div className={style.profileHeader}>
                    <h2>User not found. Please log in again.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className={style.profileContainer}>
            <div className={style.profileHeader}>
                <h2>Welcome, {user.name}</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className={style.profileInfo}>
                <p>Email: {user.email}</p>
                <p>Role: {user.isMentor ? 'Mentor' : 'Mentee'}</p>
                <p>User Ability: {user.score}</p>
                {/* Add other user-related information here */}
            </div>
        </div>
    );
};

export default Profile;
