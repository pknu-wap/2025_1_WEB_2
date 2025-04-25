import React, { useState } from "react";
import axios from "axios";
import LetterInputForm from "../components/LetterCreate/LetterInputForm";
import styles from "../assets/LetterCreate/LetterCreatePage.module.css";
import LetterFloatingButton from "../components/LetterCreate/LetterFloatingButton";
import LetterInfoForm from "../components/LetterCreate/LetterInfoForm";

// 전제조건
/**
 * JWT 토큰은 서버가 Set-Cookie 헤더로 내려줌
 * axios withCredentials 옵션으로 쿠키 포함
 *
 */

// type PARAM = {
// 	title        : string  // 편지 제목
// 	content      : string  // 편지 내용
// 	user_id_to   : string | undefined // 편지를 받는 사람
// 	time_send    : number  // 편지를 보낸 시간(현재)의 타임스탬프
// 	time_receive : number  // 편지를 받을 시간(미래)의 타임스탬프
// 	email_notify_on_receive : string  // 편지가 전송되었을 때, 알림을 받을 이메일
// 	is_public    : boolean // 편지 공개 여부; true면 공개
// }
const LetterCreatePage = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    console.log({ userIdTo });
    console.log({ privacy });
  };

  const [userIdTo, setUserIdTo] = useState("");
  const [emailNotifyOnReceive, setEmailNotifyOnReceive] = useState("");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  const [year, setYear] = useState({
    value: currentYear,
    label: `${currentYear}년`,
  });
  const [month, setMonth] = useState({
    value: currentMonth + 1,
    label: `${currentMonth + 1}월`,
  });
  const [day, setDay] = useState({
    value: currentDate,
    label: `${currentDate}일`,
  });

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

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    const now = Date.now();

    const futureReceiveTime = new Date(
      year.value,
      month.value - 1,
      day.value,
      12,
      0,
      0
    ).getTime();

    const param = {
      title: title,
      content: content,
      user_id_to: userIdTo,
      time_send: now,
      time_receive: futureReceiveTime,
      email_notify_on_receive: emailNotifyOnReceive,
      is_public: isPublic,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_PROXY}/letter/create`,
        param,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("전송 성공:", res.data);
      alert("편지가 전송되었습니다!");

      // 초기화
      setTitle("");
      setContent("");
      setUserIdTo("");
      setEmailNotifyOnReceive("");
    } catch (error) {
      console.error("전송 실패:", error.response?.data || error.message);
      alert("편지 전송에 실패했습니다.");
    }
  };

  return (
    <div className={styles.create_page}>
      <div className={styles.letter_form}>
        <div className={styles.letter_title_form}>
          <LetterInputForm
            placeholderName={"제목을 적어주세요"}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.letter_content_form}>
          <div style={{ height: "90%" }}>
            <LetterInputForm
              placeholderName={"미래의 나에게 편지를 남겨보세요!"}
              customFontSize={16}
              onChange={(e) => setContent(e.target.value)}
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
        handleLetterTo={(e) => setUserIdTo(e.target.value)}
        userIdTo={userIdTo}
        emailNotifyOnReceive={emailNotifyOnReceive}
        handleEmail={(e) => setEmailNotifyOnReceive(e.target.value)}
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

      <LetterFloatingButton handleOpen={handleOpen} />
    </div>
  );
};

export default LetterCreatePage;
