import React, { useState } from "react";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";
import FloatingButton from "../components/FloatingButton";
import LetterInfoForm from "../components/LetterCreate/LetterInfoForm";

const LetterCreatePage = ({}) => {
  // 플로팅 버튼 토글 hook
  const [isOpen, setIsOpen] = useState(true);
  // 플로팅 버튼 토글 핸들러
  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

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

      <LetterInfoForm isOpen={isOpen} />

      {/* 플로팅 버튼 */}
      <FloatingButton handleOpen={handleOpen} />
    </div>
  );
};

export default LetterCreatePage;
