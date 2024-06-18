import React from "react";
import style from "./a.module.scss";

const GradientText = (props) => {
  const color1 = props.color1;
  const color2 = props.color2;

  return (
    <span className={style.GradientText} style={{ background: `linear-gradient(to right, ${color1} ,${color2} )`, WebkitBackgroundClip: 'text' }}>
      {props.title}
    </span >
  );
};

export default GradientText;
