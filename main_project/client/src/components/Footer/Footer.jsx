import React from "react";
import { useNavigate, useParams } from "react-router-dom";
//import styles
import style from "./a.module.scss";
//import components
import SubHeading from "../../components/SubHeading/SubHeading.tsx";

const Footer = () => {
    const { params } = useParams();
    const navigate = useNavigate();
    const url = window.location.href
    return (
        <div className={style.footer} >
            <div className={style.footerDetail}>
                    {/* <div className={style.aboutDevelup}>
                        <h1 >Develup</h1>
                    </div> */}
                    <hr />
                <div className={style.footerMenu} >
                    <div className={style.completeMenu} >
                        <div className={style.menu}>
                            <h2> Menu</h2>
                            <div onClick={() => navigate('/home')}>Home</div>
                            <div onClick={() => navigate('/mentor')}>Mentor</div>
                            <div onClick={() => navigate('/project')}>Projects</div>
                            <div onClick={() => navigate('/studygroups')}>Study Group</div>
                        </div>
                        <div className={style.ContactUs}>
                            <h2> Contact us</h2>
                            <div onClick={() => navigate('/contact')}>Reach out to us</div>
                            <div>About us</div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <SubHeading title="&#169; All Copyright Reserved" leftLine={true} rightLine={true} align="center" />
            </div>
        </div>
    );
};

export default Footer;