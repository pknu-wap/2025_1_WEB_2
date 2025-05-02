import React from "react";
import Select from "react-select";
import styles from "../../assets/LetterCreate/YMDSelector.module.css";

const YearMonthDayPicker = ({
  currentYear,

  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
}) => {
  // const currentYear = new Date().getFullYear();
  // const [year, setYear] = useState({
  //   value: currentYear,
  //   label: `${currentYear}년`,
  // });
  // const [month, setMonth] = useState({ value: 1, label: "1월" });
  // const [day, setDay] = useState({ value: 1, label: "1일" });

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const generateOptions = (start, end, suffix) =>
    Array.from({ length: end - start + 1 }, (_, i) => ({
      value: start + i,
      label: `${start + i}${suffix}`,
    }));

  return (
    <div
      className={styles.ymd_selector}
      style={{ display: "flex", gap: "5px" }}
    >
      {/* 연도 선택 
          현재 년도 to 현재 년도 + 99
      */}
      <Select
        className={styles.year_selector}
        options={generateOptions(currentYear, currentYear + 99, "년")}
        value={year}
        onChange={setYear}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "30px",
            borderColor: "#EDEDED",
            backgroundColor: state.isFocused ? "#EDEDED" : "#FFFFFF",
            outline: "none",
            padding: "7px 20px",
            cursor: "pointer",
          }),
          indicatorSeparator: () => ({
            display: "none", // 구분선 제거
          }),
          menu: (base) => ({
            ...base,
            boxShadow: "none", // 드롭다운 그림자 제거
          }),
          option: (base) => ({
            ...base,
            backgroundColor: "#FFFFFF", // 옵션 배경 투명
            color: "inherit", // 기본 텍스트 색상 유지
            "&:hover": {
              backgroundColor: "#F0F0F0", // 호버 시 색상 변경 가능
            },
          }),
        }}
      />

      {/* 월 선택 */}
      <Select
        options={generateOptions(1, 12, "월")}
        value={month}
        onChange={setMonth}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "30px",
            borderColor: "#EDEDED",
            backgroundColor: state.isFocused ? "#EDEDED" : "#FFFFFF",
            outline: "none",
            padding: "7px 20px",
            cursor: "pointer",
          }),
          indicatorSeparator: () => ({
            display: "none", // 구분선 제거
          }),
          menu: (base) => ({
            ...base,
            boxShadow: "none", // 드롭다운 그림자 제거
          }),
          option: (base) => ({
            ...base,
            backgroundColor: "#FFFFFF", // 옵션 배경 투명
            color: "inherit", // 기본 텍스트 색상 유지
            "&:hover": {
              backgroundColor: "#F0F0F0", // 호버 시 색상 변경 가능
            },
          }),
        }}
      />

      {/* 일 선택 */}
      <Select
        options={generateOptions(
          1,
          getDaysInMonth(year.value, month.value),
          "일"
        )}
        value={day}
        onChange={setDay}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderRadius: "30px",
            borderColor: "#EDEDED",
            backgroundColor: state.isFocused ? "#EDEDED" : "#FFFFFF",
            outline: "none",
            boxShadow: state.isFocused ? "none" : baseStyles.boxShadow,
            padding: "7px 20px",
            cursor: "pointer",
          }),
          indicatorSeparator: () => ({
            display: "none", // 구분선 제거
          }),
          menu: (base) => ({
            ...base,
            boxShadow: "none", // 드롭다운 그림자 제거
          }),
          option: (base) => ({
            ...base,
            backgroundColor: "#FFFFFF", // 옵션 배경 투명
            color: "inherit", // 기본 텍스트 색상 유지
            "&:hover": {
              backgroundColor: "#F0F0F0", // 호버 시 색상 변경 가능
            },
          }),
        }}
      />
    </div>
  );
};

export default YearMonthDayPicker;
