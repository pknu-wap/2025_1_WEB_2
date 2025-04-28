import React, { useEffect, useState } from "react";
import axios from "axios"; // axios 임포트
import InputForm from "../components/Join/InputForm";
import emailIcon from "../assets/이메일 인풋 이미지.png";
import passwordIcon from "../assets/비밀번호 인풋 이미지.png";
import nicknameIcon from "../assets/nicknameIcon.png";
import Logo from "../assets/logo.png";
import signupIcon from "../assets/회원가입 버튼 이미지.png";
import styles from "../assets/Join/Join.module.css";
import { useNavigate } from "react-router-dom";

const JoinPage = () => {
  useEffect(() => {
    const header = document.querySelector("header");
    if (header) header.style.display = "none";
    return () => {
      if (header) header.style.display = "";
    };
  }, []);
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameError(value.length > 10 ? "닉네임은 10자 이내여야 합니다." : "");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      emailRegex.test(value) ? "" : "올바른 이메일 형식이 아닙니다."
    );
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordCheck) {
      setPasswordMatchError(
        value === passwordCheck ? "" : "비밀번호가 일치하지 않습니다."
      );
    }
  };

  const handlePasswordCheckChange = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);
    if (value) {
      setPasswordMatchError(
        password === value ? "" : "비밀번호가 일치하지 않습니다."
      );
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSubmit = async () => {
    if (nicknameError || emailError || passwordMatchError) {
      alert("입력한 정보를 확인해주세요.");
      return;
    }

    const userData = {
      name: nickname,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/account/create`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다.");
        setNickname("");
        setEmail("");
        setPassword("");
        setPasswordCheck("");
        setShowPassword(false);
        window.location.href = "/loginpage";
      } else {
        alert("회원가입에 실패했습니다.");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.login_container}>
      <img
        src={Logo}
        alt="로고"
        className="login-logo"
        onClick={() => navigate("/")}
      />
      <div className={styles.login_form}>
        <InputForm
          icon={nicknameIcon}
          type="text"
          placeholder="닉네임을 입력해주세요"
          value={nickname}
          onChange={handleNicknameChange}
          error={nicknameError}
        />
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
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={handlePasswordChange}
          togglePassword={() => setShowPassword(!showPassword)}
          showPassword={showPassword}
        />
        <InputForm
          icon={passwordIcon}
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 확인해주세요"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
          error={passwordMatchError}
        />
        <button className={styles.login_button} onClick={handleSubmit}>
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
