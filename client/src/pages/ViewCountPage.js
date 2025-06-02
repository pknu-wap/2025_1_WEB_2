import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const commonFont = {
  fontFamily: "Pretendard-Regular",
};
const styles = {
  guideText: {
    position: "fixed",
    bottom: "110px",
    left: "40px",
    backgroundColor: "#ffffffcc", // 반투명 흰 배경
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 999,
    fontFamily: "Pretendard-Regular",
  },

  overlay: {
    position: "fixed",
    bottom: "110px",
    left: "40px",
    zIndex: 1000,
  },
  modal: {
    ...commonFont,
    background: "#E8FBFF",
    borderRadius: "16px",
    padding: "20px",
    width: "320px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    animation: "slideUp 0.3s ease-out",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    float: "right",
    cursor: "pointer",
  },
  floatingBtn: {
    position: "fixed",
    bottom: "40px",
    left: "40px",
    width: "60px",
    height: "60px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    color: "#fff",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    zIndex: 1000,
  },
  card: {
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    minHeight: "120px",
  },

  titleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "5px",
  },

  title: {
    fontWeight: "bold",
    fontSize: "24px",
  },

  date: {
    fontSize: "13px",
    color: "#555",
    marginLeft: "10px",
    whiteSpace: "nowrap",
  },

  content: {
    fontSize: "20px",
    color: "#333",
    wordBreak: "break-word",
    padding: "5px",
  },

  author: {
    bottom: "8px",
    right: "12px",
    fontSize: "12px",
    color: "#666",
    alignSelf: "flex-end", // 오른쪽 정렬
    fontStyle: "italic",
  },
};

const ViewCountPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [topLetters, setTopLetters] = useState([]);
  const [userNames, setUserNames] = useState({});

  const toggleModal = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTopLetters = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/letter/list_by_view_count`
        );
        const letters = res.data.arr_letter?.slice(0, 3) || [];

        setTopLetters(letters);

        const userIds = [...new Set(letters.map((l) => l.user_id_from))];
        const nameMap = {};

        await Promise.all(
          userIds.map(async (id) => {
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/account/profile/${id}`
              );
              nameMap[id] = res.data.name || `ID ${id}`;
            } catch {
              nameMap[id] = `ID ${id}`;
            }
          })
        );

        setUserNames(nameMap);
      } catch (err) {
        console.error("인기 편지 목록 불러오기 실패:", err);
      }
    };

    fetchTopLetters();
  }, [isOpen]);

  const truncateContent = (text, maxLength = 15) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || "";

  const handleClick = (letterId) => {
    navigate(`/view/${letterId}`);
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && (
        <div style={styles.guideText}>
          지금 가장 인기 있는 편지들을 구경해보세요!
        </div>
      )}
      <button style={styles.floatingBtn} onClick={toggleModal}>
        🔥
      </button>
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={toggleModal}>
              ✕
            </button>
            <h3 style={{ marginBottom: "15px" }}>🔥 인기 편지 Top 3</h3>
            {topLetters.map((letter, index) => (
              <div
                key={letter.id}
                style={styles.card}
                onClick={() => handleClick(letter.id)}
              >
                <div style={styles.titleRow}>
                  <div style={styles.title}>
                    {index === 0 && "🥇 "}
                    {index === 1 && "🥈 "}
                    {index === 2 && "🥉 "}
                    {letter.title}
                  </div>
                </div>

                <div style={styles.content}>
                  {truncateContent(letter.content)}
                </div>

                <div style={styles.author}>
                  BY.{" "}
                  {userNames[letter.user_id_from] ||
                    `ID ${letter.user_id_from}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ViewCountPage;
