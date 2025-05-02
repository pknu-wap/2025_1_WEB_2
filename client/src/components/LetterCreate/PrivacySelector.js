import styles from "../../assets/LetterCreate/PrivacySelector.module.css";
import React from "react";
/*
사용방법
<PrivacySelector buttonValue={"전체공개"} imgPath={Globe}></PrivacySelector>
<PrivacySelector buttonValue={"나만보기"} imgPath={Lock}></PrivacySelector>
*/
// 페이지에서 반복문 사용하여 구현할 예정.
const PrivacySelector = ({
  // 버튼 label
  buttonValue,
  // 버튼 속 icon
  imgPath,
  // 버튼 클릭 시  해당 option을 selected로 설정
  setPrivacy,
  handleClick,
  isClick,
}) => {
  return (
    <button
      className={styles.privacy_select_btn}
      value={buttonValue}
      onClick={(e) => {
        setPrivacy(e.target.value);
        handleClick();
      }}
      style={{
        backgroundColor: isClick ? "#EDEDED" : "transparent",
      }}
    >
      <img
        className={styles.privacy_select_btn_icon}
        src={imgPath}
        alt="공개범위 설정 아이콘"
      />
      {buttonValue}
    </button>
  );
};

export default PrivacySelector;
