import styles from "../assets/Header.module.css";
import logo from "../assets/logo.png";

const Header = ({}) => {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} />
      <nav className={styles.route_btn}>
        <button className={styles.btn}>편지 구경하기</button>
        <button className={styles.btn}>느린 편지 쓰기</button>
        <button className={styles.btn}>나의 편지 보관함</button>
      </nav>
    </header>
  );
};

export default Header;
