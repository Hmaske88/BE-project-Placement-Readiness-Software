import React, { useEffect, useRef, useState } from 'react'
//import styles
import style from './a.module.css'

const TextBox = ({ placeholder, icon, type, value, onChange , inputBox, dropDown, options, textArea }) => {
    const dropDownOptions = options 
    const DropDown = () => {
        return (
            <select placeholder={placeholder} value={value} className={style.select} onChange={onChange}>
                <option value="" disabled selected >{placeholder}</option>
                {dropDownOptions.map((option, i) =>{
                    return (
                    <option id={i} value={option}>{option}</option>
                    )
                })}
            </select>
        )
    }

    const textAreaRef = useRef(null);
    const useAutosizeTextArea = ( textAreaRef, value) => {
        useEffect(() => {
            if (textAreaRef) {
            textAreaRef.style.height = "0px";
            const scrollHeight = textAreaRef.scrollHeight;
            textAreaRef.style.height = scrollHeight + "px";
            }
        }, [textAreaRef, value]);
    };

    useAutosizeTextArea(textAreaRef.current, value);


    return (
        <div className={style.textBox} >
            <img src={icon} alt={icon} className={style.icon} />
            {inputBox?<input type={type} placeholder={placeholder} className={style.input} value={value} onChange={onChange} /> :null}
            {dropDown? <DropDown />:null}
            {textArea? <textarea ref={textAreaRef} onChange={onChange} placeholder={placeholder} value={value} className={style.textArea}> </textarea>:null}
        </div>
    )
}

export default TextBox