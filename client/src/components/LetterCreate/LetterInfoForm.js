import React from "react";
import styles from "../../assets/LetterCreate/LetterInfoForm.module.css";
import LetterInputForm from "./LetterInputForm";
import PrivacySelector from "./PrivacySelector";
import YearMonthDayPicker from "./YearMonthDayPicker";
import Globe from "../../assets/LetterCreate/worldwide.png";
import Lock from "../../assets/LetterCreate/unlock.png";

const LetterInfoForm = ({
  isOpen,
  handleLetterTo,
  userIdTo,
  handleEmail,
  emailNotifyOnReceive,
  currentYear,
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
  setPrivacy,
  isPrivacy,
  isPublic,
  handleClicked,
  handleClick,
}) => {
  if (!isOpen) return null;
  return (
    <div className={styles.letter_info_form}>
      <div className={styles.letter_info_input_form}>
        <div className={styles.letter_to}>
          <LetterInputForm
            placeholderName={"누구에게 보내실 건가요?"}
            customFontSize={22}
            onChange={handleLetterTo}
            value={userIdTo}
          />
        </div>
        <div className={styles.letter_when}>
          <label style={{ marginLeft: "15px" }}>
            얼마나 느리게 보내드릴까요?
          </label>
          <YearMonthDayPicker
            currentYear={currentYear}
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            day={day}
            setDay={setDay}
          />
        </div>
        <div className={styles.letter_privacy_form}>
          <label style={{ marginLeft: "15px" }}>공개범위를 설정해주세요</label>
          <div className={styles.letter_privacy}>
            <PrivacySelector
              buttonValue={"전체공개"}
              imgPath={Globe}
              setPrivacy={setPrivacy}
              handleClick={() => handleClicked("public")}
              isClick={isPublic}
            ></PrivacySelector>
            <PrivacySelector
              buttonValue={"나만보기"}
              imgPath={Lock}
              setPrivacy={setPrivacy}
              handleClick={() => handleClicked("private")}
              isClick={isPrivacy}
            ></PrivacySelector>
          </div>
        </div>
        <div className={styles.letter_email}>
          <label style={{ marginLeft: "15px" }}>
            편지가 도착하면 메일로 알림을 보내드릴게요.
            <br />
          </label>
          <label style={{ marginLeft: "15px" }}>
            알림받을 이메일을 적어주세요.
          </label>
          <div className={styles.letter_email_input_form}>
            <LetterInputForm
              placeholderName={"your_email@example.com"}
              customFontSize={16}
              onChange={handleEmail}
              value={emailNotifyOnReceive}
            />
          </div>
          <div className={styles.letter_checkbox}>
            <input type="checkbox" id="emailCheckbox" />
            <label for="emailCheckbox">
              회원 가입 시 사용한 이메일로 보내주세요.
            </label>
          </div>
        </div>
        <button className={styles.save_btn} onClick={handleClick}>
          이렇게 보내주세요 💌
        </button>
      </div>
    </div>
  );
};

export default LetterInfoForm;
