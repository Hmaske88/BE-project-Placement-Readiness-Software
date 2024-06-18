import React from 'react'
//import styles
import style from "./a.module.scss";

const SecondaryButton = (props) => {

    return (
      <div className={style.secondaryButton}>
        {props.title}
      </div>
    );
  };
  
  export default SecondaryButton;