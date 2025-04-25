import styles from "../../assets/LetterView/LetterView.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const LetterView = () => {
  const { id } = useParams(); // URL의 id 추출
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/mockLetters.json`);
        const found = response.data.letters.find((item) => item.id === id);

        if (found) {
          setLetter(found);
        } else {
          setError("해당 ID의 편지를 찾을 수 없습니다.");
        }
      } catch (err) {
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  if (loading) return <div className={styles.viewPage}>로딩 중...</div>;
  if (error) return <div className={styles.viewPage}>{error}</div>;

  return (
    <div className={styles.viewPage}>
      <div className={styles.letterContainer}>
        <div className={styles.header}>
          YYYY년 MM월 DD일로부터 YY년 MM 개월 DD일만에 도착한 편지입니다!
        </div>
        <div className={styles.titleAndButtons}>
          <div className={styles.title}>{letter.title}</div>
          <div className={styles.buttonGroup}>
            <button className={styles.onlyMeButton}>🔒나만보기</button>
            <button className={styles.button}>수정</button>
            <button className={styles.button}>삭제</button>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.content}>{letter.content}</div>
      </div>
    </div>
  );
};

export default LetterView;
