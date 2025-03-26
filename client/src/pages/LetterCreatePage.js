import React from "react";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";

const LetterCreatePage = ({}) => {
  return (
    <div className={styles.create_page}>
      <div className={styles.letter_form}>
        <div className={styles.letter_title_form}>
          <LetterInputForm placeholderName={"제목을 적어주세요"} />
        </div>

        {/* 입력창 자동 크기 조절부분 바꾸어주어야함 */}
        <div className={styles.letter_content_form}>
          <LetterInputForm
            placeholderName={"미래의 나에게 편지를 남겨보세요!"}
            customFontSize={16}
          />
        </div>
      </div>
    </div>
  );
};

export default LetterCreatePage;
