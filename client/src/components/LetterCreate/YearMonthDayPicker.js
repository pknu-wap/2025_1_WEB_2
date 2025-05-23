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
  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const generateOptions = (start, end, suffix) =>
    Array.from({ length: end - start + 1 }, (_, i) => ({
      value: start + i,
      label: `${start + i}${suffix}`,
    }));

  const generateMonthOptions = (year) => {
    const startMonth = year === todayY ? todayM : 1;
    return generateOptions(startMonth, 12, "월");
  };

  const generateDayOptions = (year, month) => {
    const totalDays = getDaysInMonth(year, month);

    return Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const isTodayOrFuture =
        year > todayY ||
        (year === todayY && month > todayM) ||
        (year === todayY && month === todayM && day > todayD);

      return {
        value: day,
        label: `${day}일`,
        isDisabled: !isTodayOrFuture,
      };
    });
  };

  return (
    <div
      className={styles.ymd_selector}
      style={{ display: "flex", gap: "5px" }}
    >
      {/* 연도 선택 */}
      <Select
        className={styles.year_selector}
        options={generateOptions(currentYear, currentYear + 99, "년")}
        value={year}
        onChange={setYear}
        styles={selectStyles}
      />

      {/* 월 선택 */}
      <Select
        options={generateMonthOptions(year.value)}
        value={month}
        onChange={setMonth}
        isOptionDisabled={(option) =>
          year.value === todayY && option.value < todayM
        }
        styles={selectStylesWithDisabled}
      />

      {/* 일 선택 */}
      <Select
        options={generateDayOptions(year.value, month.value)}
        value={day}
        onChange={setDay}
        isOptionDisabled={(option) => option.isDisabled}
        styles={selectStylesWithDisabled}
      />
    </div>
  );
};

// 기본 스타일
const selectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: "30px",
    borderColor: "#EDEDED",
    backgroundColor: state.isFocused ? "#EDEDED" : "#FFFFFF",
    outline: "none",
    padding: "7px 20px",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  menu: (base) => ({ ...base, boxShadow: "none" }),
  option: (base) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    color: "inherit",
    "&:hover": { backgroundColor: "#F0F0F0" },
  }),
};

// 비활성화 지원 스타일
const selectStylesWithDisabled = {
  ...selectStyles,
  option: (base, state) => ({
    ...base,
    backgroundColor: "#FFFFFF",
    color: state.isDisabled ? "#ccc" : "inherit",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    "&:hover": {
      backgroundColor: state.isDisabled ? "#FFFFFF" : "#F0F0F0",
    },
  }),
};

export default YearMonthDayPicker;
