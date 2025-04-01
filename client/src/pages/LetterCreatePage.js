import React, { useState } from "react";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";
import LetterFloatingButton from "../components/LetterCreate/LetterFloatingButton";
import LetterInfoForm from "../components/LetterCreate/LetterInfoForm";

const LetterCreatePage = ({}) => {
  // 플로팅 버튼 토글 hook
  const [isOpen, setIsOpen] = useState(true);
  // 플로팅 버튼 토글 핸들러
  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    // 토글 버튼 눌러도 userIdTo 유지되는 것 확인함.
    console.log({ userIdTo });
    console.log({ privacy });
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

  // 공개 범위 설정
  const [privacy, setPrivacy] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isPriacy, setIsPrivacy] = useState(false);
  const handleClicked = (type) => {
    if (type === "public") {
      setIsPublic(true);
      setIsPrivacy(false);
      setPrivacy("전체공개");
    } else {
      setIsPublic(false);
      setIsPrivacy(true);
      setPrivacy("나만보기");
    }
  };

  // 제목 및 콘텐츠 설정
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className={styles.create_page}>
      <div className={styles.letter_form}>
        <div className={styles.letter_title_form}>
          <LetterInputForm
            placeholderName={"제목을 적어주세요"}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>

        {/* 입력창 자동 크기 조절부분 바꾸어주어야함 */}
        <div className={styles.letter_content_form}>
          <LetterInputForm
            placeholderName={"미래의 나에게 편지를 남겨보세요!"}
            customFontSize={16}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <button className={styles.send_btn}>편지를 전송합니다.</button>
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
        privacy={privacy}
        setPrivacy={setPrivacy}
        handleClicked={handleClicked}
        isPrivacy={isPriacy}
        isPublic={isPublic}
        handleClick={handleOpen}
      />

      {/* 플로팅 버튼 */}
      <LetterFloatingButton handleOpen={handleOpen} />
    </div>
  );
};

export default LetterCreatePage;
