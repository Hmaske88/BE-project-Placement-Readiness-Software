import React from "react";
//import styles
import style from "./a.module.scss";
//import assets
import arrows from "../../assets/Illustrations/three-arrows.svg";

const PrimaryButton = (props) => {

  const Arrows = () => {
    return (
        <img className={style.arrow} src={arrows} alt="Arrow"></img>
    );
  };
  return (
    <div className={style.primaryButton}>
      {props.title}
      {props.arrows ? <Arrows /> : null}
    </div>
  );
};

export default PrimaryButton;
