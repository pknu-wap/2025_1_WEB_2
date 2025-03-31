import styles from "../../assets/LetterView/LetterView.module.css";

const LetterView = () => {
  return (
    <div className={styles.letterContainer}>
      <div className={styles.header}>
        YYYY년 MM월 DD일로부터 YY년 MM 개월 DD일만에 도착한 편지입니다!
      </div>
      <div className={styles.titleAndButtons}>
        <div className={styles.title}>편지 제목</div>
        <div className={styles.buttonGroup}>
          <button className={styles.onlyMeButton}>🔒나만보기</button>
          <button className={styles.button}>수정</button>
          <button className={styles.button}>삭제</button>
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.content}>편지 내용입니다.</div>
    </div>
  );
};

export default LetterView;
