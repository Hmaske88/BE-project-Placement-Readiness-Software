import React from "react";
//import styles
import style from "./a.module.scss";
//import assets
import leftLine from '../../assets/Illustrations/left-line.svg';
import rightLine from '../../assets/Illustrations/right-line.svg';

const SubHeading = (props: any) => {
  const title = props.title;
  const number = props.number;
  //render
  const RightLine = () => {
    return (
        <img src={rightLine} alt="Right Line SVG"></img>
    );
  };

  const LeftLine = () => {
    return (
        <img src={leftLine} alt="Left Line SVG"></img>
    );
  };

  return (
    <div className={style.subHeading} style={{justifyContent:props.align}}>
      {props.leftLine ? <LeftLine /> : null}
      <h1>{number}<span>{title}</span></h1>
      {props.rightLine ? <RightLine /> : null}
    </div>
  );
};

export default SubHeading;
