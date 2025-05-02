import { useNavigate } from "react-router-dom";
import styles from "../assets/Header.module.css";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext"; // 전역 상태 구독

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // ✅ 전역 상태 사용

  const handleLogout = () => {
    logout(); // 전역 상태를 통한 로그아웃
    alert("로그아웃 되었습니다.");
    navigate("/login");
  };

  const navLogin = () => navigate("/login");
  const navCreate = () => navigate("/create");
  const navMyPage = () => navigate("/mypage");

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
