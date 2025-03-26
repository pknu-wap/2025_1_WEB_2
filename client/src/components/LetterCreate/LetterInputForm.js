import React, { useState } from "react";
import styles from "../../assets/LetterCreate/LetterInputForm.module.css";

{
  /* <LetterInputForm placeholderName={"제목을 적어주세요"} />
    <LetterInputForm
      placeholderName={"미래의 나에게 편지를 남겨보세요!"}
      customFontSize={16}
    /> */
}
// content, setContent는 LetterCreatePage에서 선언하여서 변수로 전달.
const LetterInputForm = ({
  placeholderName,
  content,
  setContent,
  customFontSize,
}) => {
  return (
    <div>
      <textarea
        className={styles.letter_title_input_form}
        placeholder={placeholderName} // placeHoder 값을 변수로 전달.
        value={content} // useState hook 사용하여 관리하는 값.
        onChange={setContent}
        rows={1} // 최소 줄 수
        cols={32} // 최소 열 수
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
