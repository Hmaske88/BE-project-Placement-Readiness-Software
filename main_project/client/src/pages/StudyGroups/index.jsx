import React, { useEffect, useState } from 'react'
import { useNavigate, Link, json } from 'react-router-dom';
//import styles
import style from "./a.module.scss";
//import components
import Navbar from '../../components/Navbar/Navbar'
import GradientText from '../../components/GradientText/GradientText';
import SearchFields from '../../components/SearchFields/SearchFields';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import Footer from '../../components/Footer/Footer'
import Card from './components/Card';
//import assets
import studyGroupHeroBackground from "../../assets/Backgrounds/studygroup-grid-background.svg";
import axios from 'axios';
import communityIcon from "../../assets/icons/community-white.svg"

const StudyGroups = () => {
    const navigate = useNavigate();
    const [cardsData, setCardsData] = useState(null);
    const [communitiesData, setCommunitiesData] = useState([]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await axios.get('http://localhost:4000/api/allrooms/');
                const data = response.data;
                setCardsData([...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchGroups();

        async function fetchCommunities() {
            try {
                const response = await axios.get('http://localhost:4000/api/communities/');
                const data = response.data;
                setCommunitiesData([...data]);
            } catch (error) {
                console.error('Error fetching communities:', error);
            }
        }
        fetchCommunities();
    }, []);

    const HeroSection = () => {
        return (
            <div className={style.heroSection} style={{ backgroundImage: `url(${studyGroupHeroBackground})` }}>
                <h1>Find a correct <br /> place for <GradientText title="Yourself" color1='#407BFF' color2='#F32053' /></h1>
                <div onClick={() => navigate('/createRoom')} className={style.createRoomSection}>
                    <PrimaryButton title="Create your own community" />
                </div>
            </div>
        );
    };

    const handleNavigation = (roomName) => {
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData?.rooms, roomName);
        if (userData && userData?.rooms.includes(roomName)) {
            navigate('/chat');
        } else {
            navigate('/groupInfo/' + roomName);
        }
    };

    const SearchResults = () => {
        return (
            <>
                {cardsData && cardsData.map((data) => {
                    return (
                        <div key={data._id} className={style.card} onClick={() => handleNavigation(data._id)}>
                            <div className={style.details}>
                                <h1>{data.name}</h1>
                                <p>{data.description}</p>
                            </div>
                            <div className={style.info}>
                                <h1>{data.mentor}</h1>
                                <div>
                                    <img src={communityIcon} alt="icon"></img>
                                    <h2>{data.members.length || 0}</h2>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    const Communities = () => {
        return (
            <div className={style.communities}>
                <h1>Communities</h1>
                <div className={style.communityCards}>
                    {communitiesData && communitiesData.map((community) => (
                        <div onClick={()=>navigate('/createRoom',{state:community})} key={community._id} className={style.communityCard}>
                            <h2>{community.name}</h2>
                            <p>{community.summary}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="AppNavbarGap"></div>
            <HeroSection />
            {JSON.parse(localStorage.getItem('user')).isAdmin && <Communities />}
            <SearchResults />
        </div>
    );
};

export default StudyGroups;
