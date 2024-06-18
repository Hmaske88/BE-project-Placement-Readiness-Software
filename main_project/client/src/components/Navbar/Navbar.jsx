// Navbar.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import develUpLogo from '../../assets/develup-logo.svg'
import style from "./a.module.scss";

const Navbar = () => {
  const [isTilt, setIsTilt] = useState(false);
  const navigate = useNavigate();

  const controlNavbar = () => {
    if (window.scrollY < 80) {
      setIsTilt(false)
    }
    else {
      setIsTilt(true)
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    }
  }, [])

  const handleLoginClick = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // User is logged in, navigate to the profile or dashboard page
      navigate('/profile');
    } else {
      // User is not logged in, navigate to the login page
      navigate('/login');
    }
  }

  return (
    <div className={isTilt ? style.shrink : style.main}>
      <div className={style.container}>
        <div className={style.logo} onClick={() => navigate('/')}>
          <img src={develUpLogo} className={style.logoImg} alt="logo" />
        </div>

        <div className={style.menu} id="menu">
          <div className={style.menuOptions}>
            <div className={style.options} onClick={() => navigate('/aptitude')}>
              Aptitude
            </div>
            <div className={style.options} onClick={() => navigate('/studygroups')}>
              Projects
            </div>
            <div className={style.options} onClick={() => navigate('/videocall')}>
              Video Call
            </div>
          </div>
        </div>
        <div className={style.loginOption} onClick={handleLoginClick}>
          <div className={style.options}>
            {localStorage.getItem('user') ? 'Profile' : 'Login/SignUp'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
