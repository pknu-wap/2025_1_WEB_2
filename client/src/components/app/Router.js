import { React } from "react";
import { Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";
import LoginPage from "../../components/Login/LoginPage";
import MyPage from "../MyPage/MyPage";
import JoinPage from "../../pages/JoinPage";
import LetterView from "../LetterView/LetterView";
import TestPage from "../test";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="/create" element={<LetterCreatePage />} />
      <Route path="/mypage" element={<MyPage />} />
      {/* <Route path="/view" element={<LetterViewPage />} /> */}
      <Route path="/loginpage" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />

      {/* 아래는 임의의 Route */}
      <Route path="/create" element={<LetterCreatePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/view/:id" element={<LetterView />} />
      <Route path="/loginpage" element={<LoginPage />} />
    </Routes>
  );
};

export default Router;
