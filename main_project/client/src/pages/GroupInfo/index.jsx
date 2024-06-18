import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//import styles
import style from './a.module.scss'
//import components
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton/SecondaryButton'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
//import assets
import createdBy from '../../assets/icons/createdby.svg'
import communityIcon from "../../assets/icons/community-white.svg"
import calender from "../../assets/icons/calender.svg"
import linkedinIcon from "../../assets/icons/linkedinIcon.svg"
import twitterIcon from "../../assets/icons/twitterIcon.svg"


const GroupInfo = () => {

    const [room,setRoom] = useState({})

    const {id} = useParams()

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:4000/api/rooms/'+id)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        })
        .then((data) => {
            console.log('rooms',data)
            setRoom(data)
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Error fetching data:', error);
        });
    },[])

    const handleJoin = (groupId) => {
        if(!localStorage.getItem('user')){
            navigate('/login')
            return
        }
        const {id:userId} = JSON.parse(localStorage.getItem('user'));
        fetch('http://localhost:4000/api/joinroom',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({userId,roomId:groupId})
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json()
        })
        .then((data) => {
            console.log('rooms',data)
            // console.log(localStorage.getItem('user'))
            const user = JSON.parse(localStorage.getItem('user'))
            user.rooms.push(groupId)
            localStorage.setItem('user',JSON.stringify(user))
            navigate('/chat')
        })
        .catch((error) => {
            // Handle any errors here
            console.error('Error fetching data:', error);
        });

    }

    const formatDate = (date) => {
        const d = new Date(date)
        return d.toDateString().split(' ')[2]+' ' + d.toDateString().split(' ')[1] +' ' + d.toDateString().split(' ')[3]
    }

    const AboutGroup = () => {
        return (
            <div className={style.mentorinfo}>
                <div className={style.aboutinfo}>
                    <div onClick={() => navigate(-1)}>
                        <SecondaryButton title='Back to groups' />
                    </div>
                    <div className={style.aboutmentor}>
                        <img src={createdBy} alt="" />
                        <div>
                            <h3>{room.creatorName}</h3>
                            <p>Created by</p>
                        </div>
                    </div>
                    <div className={style.aboutmentor}>
                        <img src={communityIcon} alt="" />
                        <div>
                            <h3>{room.members?.length}</h3>
                            <p>Number of members</p>
                        </div>
                    </div>
                    <div className={style.aboutmentor}>
                        <img src={calender} alt="" />
                        <div>
                            <h3>{formatDate(room.createdAt?.split('T')[0])}</h3>
                            <p>Created on</p>
                        </div>
                    </div>
                </div>
                <div className={style.groupDesc}>
                    <div className={style.description}>
                        <h2>{room.name}</h2>
                        <p style={{fontSize:'22px'}}>{room.description}</p>
                        <div className={style.joinSection}>
                            <p >Join us now to become the part of our family</p>
                            <div onClick={()=>handleJoin(id)} className={style.joinSectionBtn}>
                                <PrimaryButton  title='Join Now!' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const AboutGroupInfo = () => {
        return (
            <div></div>
        )
    }

    return (
        <div>
            <AboutGroup />
            <AboutGroupInfo />
            <Navbar />
            <Footer />
        </div>
    )
}

export default GroupInfo