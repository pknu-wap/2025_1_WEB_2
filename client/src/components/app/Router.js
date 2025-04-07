import { React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";
import LoginPage from "../../components/Login/LoginPage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 아래는 임의의 Route */}
        <Route path="/create" element={<LetterCreatePage />} />
        {/* <Route path="/mypage" element={<MyPage />} />
        <Route path="/view" element={<LetterViewPage />} /> */}
        <Route path="/loginpage" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
