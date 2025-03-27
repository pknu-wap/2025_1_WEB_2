import React from "react";
import styles from "../assets/FloatingButton.module.css";

const FloatingButton = (handleToggle) => {
  return <button className={styles.btn} onClick={handleToggle} />;
};

export default FloatingButton;
