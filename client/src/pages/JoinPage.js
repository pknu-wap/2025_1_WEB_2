import React, { useEffect } from "react";
import InputForm from "../components/Join/InputForm";
import emailIcon from "../assets/이메일 인풋 이미지.png";
import passwordIcon from "../assets/비밀번호 인풋 이미지.png";
import nicknameIcon from "../assets/nicknameIcon.png";
import Logo from "../assets/logo.png";
import loginIcon from "../assets/로그인 버튼 이미지.png";
import signupIcon from "../assets/회원가입 버튼 이미지.png";
import styles from "../assets/Join/Join.module.css";

const JoinPage = () => {
  // 헤더 없애는 코드
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);
  return (
    <div className={styles.login_container}>
      <img src={Logo} alt="로고" className="login-logo" />
      <div className={styles.login_form}>
        <InputForm
          icon={nicknameIcon}
          type="text"
          placeholder="닉네임을 입력해주세요"
        />
        <InputForm
          icon={emailIcon}
          type="email"
          placeholder="이메일을 입력해주세요"
        />
        <InputForm
          icon={passwordIcon}
          type="password"
          placeholder="비밀번호를 입력해주세요"
        />
        <InputForm
          icon={passwordIcon}
          type="password"
          placeholder="비밀번호를 확인해주세요"
        />
        <button className={styles.login_button}>
          <img
            src={signupIcon}
            alt="회원가입 아이콘"
            className={styles.button_icon}
          />
          회원가입
        </button>
      </div>
    </div>
  );
};

export default JoinPage;
