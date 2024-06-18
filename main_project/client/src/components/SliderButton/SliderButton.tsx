import React from 'react'
//import styles
import style from './a.module.scss'
//import assets
import leftSliderButton from '../../assets/icons/leftSliderButton.svg'
import rightSliderButton from '../../assets/icons/rightSliderButton.svg'

const SliderButton = (props:any) => {
    // const sliderdirection = props.sliderdirection;

    const RightSliderButton = () => {
        return (
            <img src={rightSliderButton} alt="Right slider SVG"></img>
        );
    };

    const LeftSliderButton = () => {
        return (
            <img src={leftSliderButton} alt="Left slider SVG"></img>
        );
    };

  return (
    <div className={style.sliderButton}>
        {props.leftSliderButton ? <LeftSliderButton /> : null}
        {props.rightSliderButton ? <RightSliderButton /> : null}
    </div>
  )
}

export default SliderButton