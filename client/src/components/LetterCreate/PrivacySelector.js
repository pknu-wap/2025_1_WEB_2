import styles from "../../assets/LetterCreate/PrivacySelector.module.css";
import React, { useStae } from "react";
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
  setSelected,
}) => {
  return (
    <button
      className={styles.privacy_select_btn}
      value={buttonValue}
      onClick={setSelected(buttonValue)}
    >
      <img className={styles.privacy_select_btn_icon} src={imgPath} />
      {buttonValue}
    </button>
  );
};

export default PrivacySelector;
