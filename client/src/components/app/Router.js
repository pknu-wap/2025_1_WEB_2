import { React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";
import LoginPage from "../../components/Login/LoginPage";
import MyPage from "../MyPage/MyPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/create" element={<LetterCreatePage />} />
      <Route path="/mypage" element={<MyPage />} />
      {/* <Route path="/view" element={<LetterViewPage />} /> */}
      <Route path="/loginpage" element={<LoginPage />} />
    </Routes>
  );
};

export default Router;
