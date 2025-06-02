import styles from "../../assets/LetterView/LetterView.module.css";
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LetterView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const getTokenFromCookie = () => {
          const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
          return match ? match[2] : null;
        };
        const tokenFromCookie = getTokenFromCookie();

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/letter/get`,
          {
            params: { id },
            headers: {
              Authorization: `Bearer ${tokenFromCookie}`,
            },
          }
        );

        if (response.data && response.data.letter) {
          setLetter(response.data.letter);
        } else {
          setError("해당 ID의 편지를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error("API 요청 에러:", error);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const getTokenFromCookie = () => {
        const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
        return match ? match[2] : null;
      };
      const tokenFromCookie = getTokenFromCookie();

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/letter/delete`,
        { letterId: Number(id) },
        {
          headers: {
            Authorization: `Bearer ${tokenFromCookie}`,
          },
        }
      );

      if (response.data && !response.data.error) {
        alert("편지가 삭제되었습니다.");
        navigate("/");
      } else {
        alert("삭제 중 오류가 발생했습니다: " + response.data.error);
      }
    } catch (err) {
      console.error("삭제 요청 실패:", err);
      alert("삭제 요청에 실패했습니다.");
    }
  };

  const getDateDiffInfo = (send, receive) => {
    const toDate = (ts) =>
      new Date(ts.toString().length === 13 ? ts : ts * 1000);
    const sendDate = toDate(send);
    const receiveDate = toDate(receive);

    const year = sendDate.getFullYear();
    const month = sendDate.getMonth() + 1;
    const day = sendDate.getDate();
    const formattedSend = `${year}년 ${String(month).padStart(
      2,
      "0"
    )}월 ${String(day).padStart(2, "0")}일`;

    let years = receiveDate.getFullYear() - sendDate.getFullYear();
    let months = receiveDate.getMonth() - sendDate.getMonth();
    let days = receiveDate.getDate() - sendDate.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(
        receiveDate.getFullYear(),
        receiveDate.getMonth(),
        0
      );
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
            {letter.is_public ? (
              <button className={styles.publicButton}>🔓전체공개</button>
            ) : (
              <button className={styles.onlyMeButton}>🔒나만보기</button>
            )}
            <button className={styles.button} onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
        <div className={styles.separator}></div>
        <div className={styles.content}>{letter.content}</div>
      </div>
    </div>
  );
};

export default LetterView;
