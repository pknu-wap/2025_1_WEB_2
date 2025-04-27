import { useEffect, useState } from "react";
import styles from "../assets/Header.module.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // 토큰이 있으면 true
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // 토큰 삭제
    setIsLoggedIn(false); // 상태 업데이트
    alert("로그아웃 되었습니다.");
    navigate("/loginpage"); // 메인페이지 이동
  };

  const navLogin = () => {
    navigate("/loginpage");
  };

  const navCreate = () => {
    navigate("/create");
  };

  const navMyPage = () => {
    navigate("/mypage");
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav_bar}>
        <img
          className={styles.logo}
          src={logo}
          onClick={() => navigate("/")}
          alt="로고"
        />
        <div className={styles.nav_btns}>
          {/* isLoggedIn 상태에 따라 버튼 다르게 보여주기 */}
          {isLoggedIn ? (
            <button className={styles.btn} onClick={handleLogout}>
              로그아웃
            </button>
          ) : (
            <button className={styles.btn} onClick={navLogin}>
              로그인
            </button>
          )}
          <button className={styles.btn} onClick={navCreate}>
            느린 편지 쓰기
          </button>
          <button className={styles.btn} onClick={navMyPage}>
            나의 편지 보관함
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
