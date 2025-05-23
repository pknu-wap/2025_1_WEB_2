import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");

    if (!tokenFromCookie) {
      alert("편지 작성은 로그인 후에 가능합니다.");
      navigate("/login");
      return; // 이거 중요!
    }

    setToken(tokenFromCookie);

    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/account/my`,
          {
            headers: { Authorization: `Bearer ${tokenFromCookie}` },
          }
        );
        setUserInfo(response.data);
        setUserIdTo(response.data.id);
      } catch (error) {
        alert("내 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchProjectDetails();
  }, [navigate]);

  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
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

  // 체크박스 상태 추가
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  // 체크박스 상태 변경 핸들러
  const handleCheckboxChange = () => {
    const nextChecked = !isEmailChecked;
    setIsEmailChecked(nextChecked);
    if (nextChecked) {
      setEmailNotifyOnReceive(userInfo?.email || "");
    } else {
      setEmailNotifyOnReceive("");
    }
  };

  // 포커싱 시 체크박스 해제 및 이메일 초기화
  const handleEmailFocus = () => {
    if (isEmailChecked) {
      setIsEmailChecked(false);
      setEmailNotifyOnReceive("");
    }
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e) => {
    setEmailNotifyOnReceive(e.target.value);
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

    const diff = futureReceiveTime - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const param = {
      title: title,
      content: content,
      user_id_from: userInfo.id,
      user_id_to: userIdTo,
      time_send: now,
      time_receive: futureReceiveTime,
      email_get_notify_receive: emailNotifyOnReceive,
      is_public: isPublic,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/letter/create`,
        param,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("전송 성공:", res.data);

      alert(
        `편지가 전송되었습니다!\n\n ${days}일 후에 편지를 보내드릴게요._@v`
      );

      // 모든 초기화
      setTitle("");
      setContent("");
      setUserIdTo("");
      setEmailNotifyOnReceive("");
      setIsEmailChecked(false);
      setPrivacy("");
      setIsPublic(false);
      setIsPrivacy(false);
      setYear({ value: currentYear, label: `${currentYear}년` });
      setMonth({ value: currentMonth + 1, label: `${currentMonth + 1}월` });
      setDay({ value: currentDate, label: `${currentDate}일` });
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.letter_content_form}>
          <div style={{ height: "90%" }}>
            <LetterInputForm
              placeholderName={"미래의 나에게 편지를 남겨보세요!"}
              customFontSize={20}
              value={content}
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

      <div className={styles.floating_container}>
        {isOpen && (
          <LetterInfoForm
            isOpen={isOpen}
            readOnly={true}
            userIdTo={userInfo?.name}
            isEmailChecked={isEmailChecked}
            handleCheckboxChange={handleCheckboxChange}
            emailNotifyOnReceive={emailNotifyOnReceive}
            handleEmail={handleEmailChange}
            onFocus={handleEmailFocus}
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
        )}
        <LetterFloatingButton handleOpen={handleOpen} />
      </div>
    </div>
  );
};

export default LetterCreatePage;
