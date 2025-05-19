import { useState } from "react";
import styles from "../../assets/PublicLetters/PublicLetters.module.css";

const lettersPerPage = 9;

const allLetters = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  title: "편지 제목", // 여기에 실제 제목이 들어가도 OK
  date: "YYYY년 MM월 DD일으로부터",
  arrival: "DD일만에 도착한 편지",
  author: "BY. @@",
}));

const PublicLetters = () => {
  const [currentPage, setCurrentPage] = useState(1);
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
          <div key={letter.id} className={styles.letterCard}>
            <h3 className={styles.title}>
              ✉️ <span className={styles.highlight}>{letter.title}</span>
            </h3>
            <p className={styles.date}>{letter.date}</p>
            <p className={styles.arrival}>{letter.arrival}</p>
            <p className={styles.author}>{letter.author}</p>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default PublicLetters;
