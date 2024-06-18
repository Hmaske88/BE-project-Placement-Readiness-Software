import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import style from './a.module.scss';
import BackButton from '../../components/BackButton/BackButton';
import TextBox from '../../components/TextBox/TextBox';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import emailIcon from '../../assets/icons/material-symbols_mail.svg';
import { baseUrl } from '../../App';

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        if (!email) {
            toast.error('Please enter your email', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
            return;
        }

        try {
            const response = await axios.delete(`${baseUrl}/reset/${email}`);
            console.log(response.data); // You can handle the success response here
            toast.success('You can register with a new password now !!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
            navigate('/register')
        } catch (error) {
            console.error('Error resetting user:', error.response.data); // Handle the error response here
            toast.error('Error resetting user. Check you email Or try again later', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
    };

    return (
        <div className={style.forgetPassword}>
            <div className={style.backbtn} onClick={() => navigate(-1)}>
                <BackButton />
            </div>
            <div className={style.forgetPasswordFields}>
                <h1>Forgot Password</h1>
                <div className={style.inputBox}>
                    <TextBox
                        type="email"
                        placeholder="Email"
                        icon={emailIcon}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        inputBox={true}
                    />
                </div>
            </div>
            <div className={style.sendLinkBtn} onClick={handleResetPassword}>
                <PrimaryButton title="Send Reset Link" />
            </div>
        </div>
    );
};

export default ForgetPassword;
