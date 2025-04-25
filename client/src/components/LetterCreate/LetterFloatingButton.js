import React from "react";
import styles from "../../assets/FloatingButton.module.css";
import LetterIcon from "../../assets/LetterCreate/love-letter.png";
const LetterFloatingButton = ({ handleOpen }) => {
  return (
    <button className={styles.btn} onClick={handleOpen}>
      <img src={LetterIcon} className={styles.floating_btn} alt="플로팅버튼" />
    </button>
  );
};

export default LetterFloatingButton;
