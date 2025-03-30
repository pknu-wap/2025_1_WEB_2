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
    // 토글 버튼 눌러도 userIdTo 유지되는 것 확인함.
    console.log({ userIdTo });
  };

  // letter_to useState
  const [userIdTo, setUserIdTo] = useState("");
  const [emailNotifyOnReceive, setEmailNotifyOnReceive] = useState("");

  // 날짜 선택 hooks
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState({
    value: currentYear,
    label: `${currentYear}년`,
  });
  const [month, setMonth] = useState({ value: 1, label: "1월" });
  const [day, setDay] = useState({ value: 1, label: "1일" });

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

      <LetterInfoForm
        isOpen={isOpen}
        handleLetterTo={(e) => {
          setUserIdTo(e.target.value);
          console.log({ userIdTo });
        }}
        userIdTo={userIdTo}
        emailNotifyOnReceive={emailNotifyOnReceive}
        handleEmail={(e) => {
          setEmailNotifyOnReceive(e.target.value);
          console.log({ emailNotifyOnReceive });
        }}
        currentYear={currentYear}
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        day={day}
        setDay={setDay}
      />

      {/* 플로팅 버튼 */}
      <FloatingButton handleOpen={handleOpen} />
    </div>
  );
};

export default LetterCreatePage;
