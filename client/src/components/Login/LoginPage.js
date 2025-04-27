import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import logo from "../../assets/logo.png";
import emailIcon from "../../assets/이메일 인풋 이미지.png";
import passwordIcon from "../../assets/비밀번호 인풋 이미지.png";
import loginIcon from "../../assets/로그인 버튼 이미지.png";
import signupIcon from "../../assets/회원가입 버튼 이미지.png";
import { useAuth } from "../../context/AuthContext"; // AuthContext import
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // 로그인 함수 가져오기

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/account/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token } = response.data;

      if (token) {
        login(token); // 로그인 성공 시 AuthContext의 login 함수 호출
        alert("로그인 성공");
        window.location.href = "/";
      } else {
        alert("로그인 실패 : 토큰이 없습니다.");
      }
    } catch (error) {
      console.log("로그인 에러", error);
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="로고" className="login-logo" />

      <div className="login-form">
        <div className="input-wrapper">
          <img src={emailIcon} alt="이메일 아이콘" className="input-icon" />
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <img
            src={passwordIcon}
            alt="비밀번호 아이콘"
            className="input-icon"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button className="login-button">
            <img
              src={signupIcon}
              alt="회원가입 아이콘"
              className="button-icon"
            />
            회원가입
          </button>
          <button className="login-button" onClick={handleLogin}>
            <img src={loginIcon} alt="로그인 아이콘" className="button-icon" />
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
