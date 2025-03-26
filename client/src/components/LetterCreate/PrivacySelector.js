import styles from "../../assets/LetterCreate/PrivacySelector.module.css";
/*
사용방법
<PrivacySelector buttonValue={"전체공개"} imgPath={Globe}></PrivacySelector>
<PrivacySelector buttonValue={"나만보기"} imgPath={Lock}></PrivacySelector>
*/
const PrivacySelector = ({
  // 버튼 label
  buttonValue,
  // 버튼 속 icon
  imgPath,
}) => {
  return (
    <button className={styles.privacy_select_btn}>
      <img className={styles.privacy_select_btn_icon} src={imgPath} />
      {buttonValue}
    </button>
  );
};

export default PrivacySelector;
