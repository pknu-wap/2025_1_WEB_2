import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LetterInputForm from "./components/LetterCreate/LetterInputForm";
import PrivacySelector from "./components/LetterCreate/PrivacySelector";
import Globe from "./assets/LetterCreate/worldwide.png";
import Lock from "./assets/LetterCreate/unlock.png";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PrivacySelector buttonValue={"전체공개"} imgPath={Globe}></PrivacySelector>
    <PrivacySelector buttonValue={"나만보기"} imgPath={Lock}></PrivacySelector>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
