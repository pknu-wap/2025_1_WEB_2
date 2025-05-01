import styles from "../../assets/LetterView/LetterView.module.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LetterView = () => {
  const { id } = useParams();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.get(`${process.env.PUBLIC_URL}/mockLetters.json`);
        const found = response.data.letters.find((item) => item.id === id);

        if (found) setLetter(found);
        else setError("해당 ID의 편지를 찾을 수 없습니다.");
      } catch {
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  const getDateDiffInfo = (send, receive) => {
    const toDate = (ts) => new Date(ts.toString().length === 13 ? ts : ts * 1000);
    const sendDate = toDate(send);
    const receiveDate = toDate(receive);

    const year = sendDate.getFullYear();
    const month = sendDate.getMonth() + 1;
    const day = sendDate.getDate();
    const formattedSend = `${year}년 ${String(month).padStart(2, "0")}월 ${String(day).padStart(2, "0")}일`;

    let years = receiveDate.getFullYear() - sendDate.getFullYear();
    let months = receiveDate.getMonth() - sendDate.getMonth();
    let days = receiveDate.getDate() - sendDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(receiveDate.getFullYear(), receiveDate.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diff = `${years}년 ${months}개월 ${days}일`;
    return { formattedSend, diff };
  };

  const dateInfo = useMemo(() => {
    if (!letter) return null;
    return getDateDiffInfo(letter.time_send, letter.time_receive);
  }, [letter]);

  if (loading) return <div className={styles.viewPage}>로딩 중...</div>;
  if (error) return <div className={styles.viewPage}>{error}</div>;

  return (
    <div className={styles.viewPage}>
      <div className={styles.letterContainer}>
        <div className={styles.header}>
          {dateInfo.formattedSend}로부터 {dateInfo.diff} 만에 도착한 편지입니다!
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
