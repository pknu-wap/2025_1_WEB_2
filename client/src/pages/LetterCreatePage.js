import React from "react";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";

const LetterCreatePage = ({}) => {
  return (
    <div>
      <div className={styles.letter_title_form}>
        <LetterInputForm placeholderName={"제목을 적어주세요"} />
      </div>
      <div>
        <LetterInputForm
          placeholderName={"미래의 나에게 편지를 남겨보세요!"}
          customFontSize={16}
        />
      </div>
    </div>
  );
};

export default LetterCreatePage;
