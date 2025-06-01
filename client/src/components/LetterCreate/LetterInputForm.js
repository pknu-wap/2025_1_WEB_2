import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "../../assets/LetterCreate/LetterInputForm.module.css";

/* <LetterInputForm placeholderName={"제목을 적어주세요"} />
    <LetterInputForm
      placeholderName={"미래의 나에게 편지를 남겨보세요!"}
      customFontSize={16}
    /> */

// content, setContent는 LetterCreatePage에서 선언하여서 변수로 전달.
const LetterInputForm = forwardRef(
  ({ placeholderName, value, onChange, customFontSize }, ref) => {
    const textAreaRef = useRef(null); // textarea DOM 참조

    // textarea가 아닌 div를 클릭하더라도 입력할 수 있도록 하기 위함 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    useImperativeHandle(ref, () => ({
      focus: () => {
        textAreaRef.current?.focus();
      },
    }));

    // 텍스트가 변경될 때 높이를 조정
    const handleTextAreaChange = (e) => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // 높이 초기화
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // 내용 크기에 맞게 조정
      }
      onChange(e); // 원래 onChange 호출
    };
    // 초기 렌더링 시 높이를 내용에 맞게 설정
    useEffect(() => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = "auto"; // 초기화
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // 내용 크기에 맞게 높이 설정
      }
    }, [value]); // value가 변경될 때마다 실행

    return (
      <div style={{ cursor: "text" }}>
        <textarea
          ref={textAreaRef}
          className={styles.letter_title_input_form}
          placeholder={placeholderName} // placeHoder 값을 변수로 전달.
          value={value} // useState hook 사용하여 관리하는 값.
          onChange={handleTextAreaChange}
          rows={1} // 최소 줄 수
          cols={32} // 최소 열 수
          spellCheck={false} // 스펠링 체크 끄기
          // 조건부
          style={{
            overflow: "hidden",
            resize: "none",
            fontSize: customFontSize,
            // 제목 자동 줄바꿈 방지
            whiteSpace:
              placeholderName === "제목을 적어주세요" ? "nowrap" : "pre-wrap",
          }} // 스크롤 숨기고 크기 조정 비활성화
        />
      </div>
    );
  }
);

export default LetterInputForm;
