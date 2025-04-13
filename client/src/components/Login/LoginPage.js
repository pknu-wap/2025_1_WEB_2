import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import emailIcon from "../../assets/이메일 인풋 이미지.png";
import passwordIcon from "../../assets/비밀번호 인풋 이미지.png";
import loginIcon from "../../assets/로그인 버튼 이미지.png";
import signupIcon from "../../assets/회원가입 버튼 이미지.png";
import "./LoginPage.css";

const LoginPage = () => {
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  return (
    <div className="login-container">
      <img src={logo} alt="로고" className="login-logo" />

      <div className="login-form">
        <div className="input-wrapper">
          <img src={emailIcon} alt="이메일 아이콘" className="input-icon" />
          <input type="email" placeholder="이메일을 입력해주세요" className="login-input" />
        </div>

        <div className="input-wrapper">
          <img src={passwordIcon} alt="비밀번호 아이콘" className="input-icon" />
          <input type="password" placeholder="비밀번호를 입력해주세요" className="login-input" />
        </div>

        <div className="button-group">
          <button className="login-button">
            <img src={signupIcon} alt="회원가입 아이콘" className="button-icon" />
            회원가입
          </button>
          <button className="login-button">
            <img src={loginIcon} alt="로그인 아이콘" className="button-icon" />
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
