import React from "react";
import styles from "../../assets/LetterCreate/LetterInfoForm.module.css";
import LetterInputForm from "./LetterInputForm";
import PrivacySelector from "./PrivacySelector";
import YearMonthDayPicker from "./YearMonthDayPicker";
import Globe from "../../assets/LetterCreate/worldwide.png";
import Lock from "../../assets/LetterCreate/unlock.png";

const LetterInfoForm = ({}) => {
  return (
    <div className={styles.letter_info_form}>
      <div className={styles.letter_info_input_form}>
        <LetterInputForm placeholderName={"누구에게 보내실 건가요?"} />
        <label>얼마나 느리게 보내드릴까요?</label>
        <YearMonthDayPicker />
        <label>공개범위를 설정해주세요</label>
        <PrivacySelector
          buttonValue={"전체공개"}
          imgPath={Globe}
        ></PrivacySelector>
        <PrivacySelector
          buttonValue={"나만보기"}
          imgPath={Lock}
        ></PrivacySelector>
        <label>
          편지가 도착하면 메일로 알림을 보내드릴게요. 알림받을 이메일을
          적어주세요
        </label>
        <LetterInputForm placeholderName={"example@com"} />
        <button type="checkbox" id="emailCheckbox" />
        <label for="emailCheckbox">
          회원 가입 시 사용한 이메일로 보내주세요.
        </label>
      </div>
    </div>
  );
};

export default LetterInfoForm;
