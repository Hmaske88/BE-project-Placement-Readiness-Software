import React from 'react'
import backButton from '../../assets/icons/backButton.svg'
import style from './a.module.css'

const BackButton = () => {
    return (
        <button className={style.backImgContainer}>
            <img className={style.backImg} src={backButton} alt="back-button get back to previous page" />
        </button>

    )
}

export default BackButton