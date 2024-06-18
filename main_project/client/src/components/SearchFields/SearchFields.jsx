import React from "react";
//import styles
import style from "./a.module.scss";
//import assets
import searchIcon from "../../assets/icons/search.svg"

const SearchFields = () => {
  return (
    <div className={style.searchField}>
        <img src={searchIcon} alt="icon"></img>
        <input placeholder="search any skill"></input>
    </div>
  );
};

export default SearchFields;
