import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
//import styles
import style from './a.module.css';
import "react-toastify/ReactToastify.min.css";
//import components
import BackButton from '../../components/BackButton/BackButton';
import TextBox from '../../components/TextBox/TextBox';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import { baseUrl } from '../../App';
//import assets
import emailIcon from '../../assets/icons/material-symbols_mail.svg';
import passwordIcon from '../../assets/icons/mdi_password.svg';

const LogIn = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if the user is already logged in and redirect to profile page
        if (localStorage.getItem('user')) {
            navigate('/profile');
        }
    }, [navigate]);

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            console.log(email, password, isAdmin)
            let data = await axios.post(baseUrl + '/auth/login', {
                email,
                password,
                isAdmin
            });

            // Save the user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.data.user));

            toast.success('Signed In 🥳', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            navigate('/profile');
        } catch (error) {
            if (error.response && error.response.data) {
                toast.error(error.response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            } else {
                toast.error('Error logging in. Please try again later.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }

    return (
        <div className={style.main}>
            <h1 className={style.title}>Sign in to your account</h1>

            <div className={style.signinForm}>
                <TextBox type="email" placeholder="Email" icon={emailIcon} value={email} onChange={(e) => setEmail(e.target.value)} inputBox={true} />
                <TextBox type="password" placeholder="Password" icon={passwordIcon} value={password} onChange={(e) => setPassword(e.target.value)} inputBox={true} />
                <div className={style.checkboxContainer}>
                    <label>
                        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
                        Admin
                    </label>
                </div>
            </div>
            <div className={style.formFooter}>
                <div className={style.forgotPass} onClick={() => navigate('/reset')}><span>Forgot Password ?</span></div>
                <div className={style.signInBtn} onClick={handleSignIn}><PrimaryButton title="Sign In" /></div>
                <h2 className={style.registerTransfer} onClick={() => navigate('/register')}>Don’t have an account? <span className={style.register}>Register here</span></h2>
            </div>
        </div>
    );
}

export default LogIn;
