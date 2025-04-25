import React from "react";
import styles from "../../assets/Join/Join.module.css";

const InputForm = ({
  icon,
  type,
  placeholder,
  value,
  onChange,
  error,
  togglePassword,
  showPassword,
}) => {
  return (
    <div className={styles.input_wrapper}>
      <img src={icon} alt="아이콘" className={styles.input_icon} />
      <input
        type={type}
        placeholder={placeholder}
        className={styles.login_input}
        value={value}
        onChange={onChange}
      />
      {/* 비밀번호 보기 토글 버튼 */}
      {togglePassword && (
        <span className={styles.toggle_btn} onClick={togglePassword}>
          {showPassword ? "숨기기" : "보기"}
        </span>
      )}
      {/* 에러 메시지 */}
      {error && <p className={styles.error_text}>{error}</p>}
    </div>
  );
};

export default InputForm;
