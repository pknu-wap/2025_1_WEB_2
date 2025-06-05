import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";
import emailIcon from "../../assets/이메일 인풋 이미지.png";
import passwordIcon from "../../assets/비밀번호 인풋 이미지.png";
import loginIcon from "../../assets/로그인 버튼 이미지.png";
import signupIcon from "../../assets/회원가입 버튼 이미지.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import InputForm from "../../components/Join/InputForm"; // 추가
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false); // 👈 추가!

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // 엔터 로그인 핸들러
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("이메일을 입력해주세요.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(
        emailRegex.test(value) ? "" : "올바른 이메일 형식이 아닙니다."
      );
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("비밀번호를 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async () => {
    // 둘 다 없는 경우 먼저 체크
    if (!email && !password) {
      setEmailError("이메일을 입력해주세요.");
      setPasswordError("비밀번호를 입력해주세요.");
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    // 이메일만 없는 경우
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      alert("이메일을 입력해주세요.");
      return;
    }

    // 비밀번호만 없는 경우
    if (!password) {
      setPasswordError("비밀번호를 입력해주세요.");
      alert("비밀번호를 입력해주세요.");
      return;
    }

    // 이메일 형식이 잘못된 경우
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      alert("올바른 이메일 형식이 아닙니다.");
      return;
    }

    // 서버 요청
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/account/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const { token } = response.data;

      if (token) {
        login(token);
        alert("로그인 성공");
        window.location.href = "/view";
      } else {
        alert("로그인 실패 : 토큰이 없습니다.");
      }
    } catch (error) {
      console.log("로그인 에러", error);
      alert("로그인 실패");
    }
  };

  return (
    <div className="login-container" onKeyDown={handleKeyDown}>
      <img
        src={logo}
        alt="로고"
        className="login-logo"
        onClick={() => navigate("/")}
      />

      <div className="login-form">
        <InputForm
          icon={emailIcon}
          type="email"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={handleEmailChange}
          error={emailError}
        />
        <InputForm
          icon={passwordIcon}
          type={showPassword ? "text" : "password"} // 👈 비밀번호 보기 적용
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={handlePasswordChange}
          error={passwordError}
          togglePassword={() => setShowPassword(!showPassword)} // 👈 토글 함수 전달
          showPassword={showPassword} // 👈 현재 보기 여부 전달
        />
        <div className="button-group">
          <button className="login-button" onClick={() => navigate("/join")}>
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
