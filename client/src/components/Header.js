import styles from "../assets/Header.module.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

// 나중에 onClick 메소드 적용해야함.

const Header = ({}) => {
  const navigate = useNavigate();

  const navLogin = () => {
    navigate("/loginpage");
  };

  const navCreate = () => {
    navigate("/create");
  };
  return (
    <header className={styles.header}>
      <nav className={styles.nav_bar}>
        <img className={styles.logo} src={logo} />
        <div className={styles.nav_btns}>
          <button className={styles.btn}>편지 구경하기</button>
          <button className={styles.btn} onClick={navCreate}>
            느린 편지 쓰기
          </button>
          <button className={styles.btn}>나의 편지 보관함</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
