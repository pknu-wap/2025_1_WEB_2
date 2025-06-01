import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/PublicLetters/PublicLetters.module.css";

const lettersPerPage = 9;

const PublicLetters = () => {
  const [allLetters, setAllLetters] = useState([]);
  const [userNames, setUserNames] = useState({}); // { userId: name }
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 날짜 포맷 함수
  const formatDate = (timestamp) => {
    const d = new Date();
    d.setTime(timestamp);
    return d.toLocaleDateString("ko-KR");
  };

  // 사용자 ID로 이름 불러오기
  const fetchUserName = async (userId) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/account/profile/${userId}`
      );
      return { userId, name: res.data.name || `ID ${userId}` };
    } catch {
      return { userId, name: `ID ${userId}` };
    }
  };

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/letter/get_all_public`
        );
        const letters = response.data.arr_letter;

        if (!Array.isArray(letters)) {
          throw new Error("편지 데이터 형식이 올바르지 않습니다.");
        }

        setAllLetters(letters);

        const uniqueUserIds = [...new Set(letters.map((l) => l.user_id_from))];
        const userNameResults = await Promise.all(
          uniqueUserIds.map((id) => fetchUserName(id))
        );

        const userNameMap = {};
        userNameResults.forEach(({ userId, name }) => {
          userNameMap[userId] = name;
        });

        setUserNames(userNameMap);
      } catch (err) {
        console.error("공개 편지를 불러오는 데 실패했습니다:", err);
        setError("공개 편지를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchLetters();
  }, []);

  const handleLetterClick = (letterId) => {
    navigate(`/view/${letterId}`);
  };

  if (!loading && allLetters.length === 0) {
    return <p>현재 공개된 편지가 없습니다.</p>;
  }

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  const totalPages = Math.ceil(allLetters.length / lettersPerPage);
  const indexOfLast = currentPage * lettersPerPage;
  const indexOfFirst = indexOfLast - lettersPerPage;
  const currentLetters = allLetters.slice(indexOfFirst, indexOfLast);

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.lettersContainer}>
        {currentLetters.map((letter) => (
          <div
            key={letter.id}
            className={styles.letterCard}
            onClick={() => handleLetterClick(letter.id)}
            style={{ cursor: "pointer" }}
          >
            <h3 className={styles.title}>
              ✉️ <span className={styles.highlight}>{letter.title}</span>
            </h3>
            <p className={styles.date}>발송일: {formatDate(letter.time_send)}</p>
            <p className={styles.arrival}>도착일: {formatDate(letter.time_receive)}</p>
            <p className={styles.author}>
              보낸 사람: {userNames[letter.user_id_from] || `ID ${letter.user_id_from}`}
            </p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageClick(i + 1)}
              className={`${styles.pageNumber} ${
                currentPage === i + 1 ? styles.active : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicLetters;


