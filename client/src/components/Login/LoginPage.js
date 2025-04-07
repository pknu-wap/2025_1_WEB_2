import React, { useEffect } from "react";
import logo from "../../assets/logo.png";
import "./LoginPage.css"; // CSS 파일 연결


const LoginPage = () => {
  useEffect(() => {
    // Header 숨기기
    const header = document.querySelector("header");
    if (header) header.style.display = "none";

    // 페이지 떠날 땐 다시 보이게
    return () => {
      if (header) header.style.display = "";
    };
  }, []);

  return (
    <div className="login-container">
        <img src={logo} alt="로고" className="login-logo" />
    </div>
  );
};

export default LoginPage;
