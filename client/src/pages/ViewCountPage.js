import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 💡 CSS in JS로 바로 정의
const styles = {
  overlay: {
    position: "fixed",
    bottom: "90px",
    left: "20px",
    zIndex: 1000,
  },
  modal: {
    background: "white",
    borderRadius: "16px",
    padding: "20px",
    width: "320px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
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
    bottom: "20px",
    left: "20px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#f06292",
    color: "#fff",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "10px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  title: {
    fontWeight: "bold",
    fontSize: "16px",
    marginBottom: "5px",
  },
  date: {
    fontSize: "13px",
    color: "#555",
    marginBottom: "3px",
  },
  author: {
    fontSize: "13px",
    color: "#444",
    marginTop: "3px",
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

        // ✅ 반드시 상태에 넣어줘야 화면에 표시됨
        setTopLetters(letters);

        const userIds = [...new Set(letters.map((l) => l.user_id_from))];
        const nameMap = {};

        await Promise.all(
          userIds.map(async (id) => {
            try {
              const res = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/account/profile/${id}`
              );
              nameMap[id] = res.data.nickname || `ID ${id}`; // 🔄 닉네임도 반영
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

  const formatDate = (timestamp) =>
    new Date(timestamp).toLocaleDateString("ko-KR");

  const truncateContent = (text, maxLength = 15) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || "";

  const handleClick = (letterId) => {
    navigate(`/view/${letterId}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* 🔘 플로팅 버튼 */}
      <button style={styles.floatingBtn} onClick={toggleModal}>
        📨
      </button>

      {/* 📦 인기 편지 모달 */}
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button style={styles.closeBtn} onClick={toggleModal}>
              ✕
            </button>
            <h3 style={{ marginBottom: "15px" }}>🔥 인기 편지 Top 3</h3>
            {topLetters.map((letter) => (
              <div
                key={letter.id}
                style={styles.card}
                onClick={() => handleClick(letter.id)}
              >
                <div style={styles.title}>✉️ {letter.title}</div>
                <div style={styles.date}>
                  발송일: {formatDate(letter.time_send)}
                </div>
                <div style={styles.date}>
                  도착일: {formatDate(letter.time_receive)}
                </div>
                <div style={styles.author}>
                  내용: {truncateContent(letter.content)}
                </div>
                <div style={styles.author}>
                  보낸 사람:{" "}
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
