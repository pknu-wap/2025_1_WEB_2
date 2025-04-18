import React, { useState, useRef, useEffect } from "react";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";
import LetterFloatingButton from "../components/LetterCreate/LetterFloatingButton";
import LetterInfoForm from "../components/LetterCreate/LetterInfoForm";

// type PARAM = {
// 	title        : string  // 편지 제목
// 	content      : string  // 편지 내용
// 	user_id_to   : string | undefined // 편지를 받는 사람
// 	time_send    : number  // 편지를 보낸 시간(현재)의 타임스탬프
// 	time_receive : number  // 편지를 받을 시간(미래)의 타임스탬프
// 	email_notify_on_receive : string  // 편지가 전송되었을 때, 알림을 받을 이메일
// 	is_public    : boolean // 편지 공개 여부; true면 공개
// }

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
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  const [year, setYear] = useState({
    value: currentYear,
    label: `${currentYear}년`,
  });
  //
  const [month, setMonth] = useState({
    value: currentMonth + 1,
    label: `${currentMonth + 1}월`,
  });
  const [day, setDay] = useState({
    value: currentDate,
    label: `${currentDate}일`,
  });

  // 받는 날짜의 UNIX TimeStamp
  const [timeReceive, setTimeRecetve] = useState(null);

  // 선택한 날짜를 유닉스 타임스탬프로 변경
  const getReceiveTimeStamp = () => {
    // 오후 12시 기준
    const unixTimeStamp = new Date(
      year.value,
      month.value - 1,
      day.value,
      12,
      0,
      0
    );

    setTimeRecetve(unixTimeStamp.getTime());
  };

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

  // 전송시간 설정
  const [timeSend, setTimeSend] = useState(null);

  // 전송 버튼 클릭시 핸들러
  const handleSubmit = () => {
    const now = Date.now(); // 현재시각 밀리초 단위(UNIX TimeStamp)
    setTimeSend(now); // 숫자형식임
    //console.log(timeSend);
    getReceiveTimeStamp();
    //console.log(timeReceive);
  };

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
          <div style={{ height: "90%" }}>
            <LetterInputForm
              placeholderName={"미래의 나에게 편지를 남겨보세요!"}
              customFontSize={16}
              onChange={(e) => {
                setContent(e.target.value);
                console.log({ content });
              }}
            />
          </div>
          <div className={styles.send_btn_box}>
            <button className={styles.send_btn} onClick={handleSubmit}>
              편지를 전송합니다.
            </button>
          </div>
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
