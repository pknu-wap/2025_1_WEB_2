import styles from "../assets/Header.module.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

// 나중에 onClick 메소드 적용해야함.

const Header = () => {
  const navigate = useNavigate();

  const navJoin = () => {
    navigate("/join");
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
          <button className={styles.btn} onClick={navJoin}>
            편지 구경하기
          </button>
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
