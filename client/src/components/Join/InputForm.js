import React from "react";
import styles from "../../assets/Join/Join.module.css";

const InputForm = ({ icon, type, placeholder }) => {
  return (
    <div className={styles.input_wrapper}>
      <img src={icon} alt="입력 아이콘" className={styles.input_icon} />
      <input
        type={type}
        placeholder={placeholder}
        className={styles.login_input}
      />
    </div>
  );
};

export default InputForm;
