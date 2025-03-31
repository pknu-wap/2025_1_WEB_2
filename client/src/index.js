import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LetterInputForm from "./components/LetterCreate/LetterInputForm";
import PrivacySelector from "./components/LetterCreate/PrivacySelector";
import YearMonthDayPicker from "./components/LetterCreate/YearMonthDayPicker";
import Header from "./components/Header";

import LetterView from "./components/LetterView/LetterView";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Header />
    <LetterView />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
