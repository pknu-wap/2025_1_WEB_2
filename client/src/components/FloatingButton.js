import React from "react";
import styles from "../assets/FloatingButton.module.css";

const FloatingButton = ({ handleOpen }) => {
  return <button className={styles.btn} onClick={handleOpen} />;
};

export default FloatingButton;
