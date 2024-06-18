import React from 'react'
import { useNavigate } from 'react-router-dom'
//import styles
import style from "../a.module.scss";
//import assets
import communityIcon from "../../../assets/icons/community-white.svg"

const Card = ({ data, handleNavigation }) => {
    const groupName = data.name
    const groupBy = data.mentor || data.creator
    const about = data.summary
    const numberOfStudents = 90

    return (
        <div className={style.card} onClick={() => handleNavigation(data.groupName)}>
            <div className={style.details}>
                <h1>{groupName}</h1>
                <p>{about}</p>
            </div>
            <div className={style.info}>
                <h1>{groupBy}</h1>
                <div>
                    <img src={communityIcon} alt="icon"></img>
                    <h2>{numberOfStudents}</h2>
                </div>
            </div>
        </div>
    )
}

export default Card
