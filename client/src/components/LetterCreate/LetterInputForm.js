import React from "react";
import styles from "../../assets/LetterCreate/LetterInputForm.module.css";

{
  /* <LetterInputForm placeholderName={"제목을 적어주세요"} />
    <LetterInputForm
      placeholderName={"미래의 나에게 편지를 남겨보세요!"}
      customFontSize={16}
    /> */
}

const LetterInputForm = ({ placeholderName, content, customFontSize }) => {
  return (
    <div>
      <textarea
        className={styles.letter_title_input_form}
        placeholder={placeholderName}
        value={content}
        rows={1} // 최소 줄 수
        cols={32}
        spellCheck={false} // 스펠링 체크 끄기
        style={{
          overflow: "hidden",
          resize: "none",
          fontSize: customFontSize,
        }} // 스크롤 숨기고 크기 조정 비활성화
      />
    </div>
  );
};

export default LetterInputForm;
