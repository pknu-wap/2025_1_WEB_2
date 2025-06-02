import { React } from "react";
import { Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";
import LoginPage from "../../components/Login/LoginPage";
import MyPage from "../MyPage/MyPage";
import JoinPage from "../../pages/JoinPage";
import LetterView from "../LetterView/LetterView";
import MainPage from "../../pages/MainPage";
import MyPage2 from "../MyPage2/MyPage2";
import PublicLetters from "../PublicLetters/PublicLetters";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/create" element={<LetterCreatePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage2" element={<MyPage2 />} />
      {/* <Route path="/view" element={<LetterViewPage />} /> */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/join" element={<JoinPage />} />

      {/* 아래는 임의의 Route */}
      <Route path="/create" element={<LetterCreatePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mypage2" element={<MyPage2 />} />
      <Route path="/view/:id" element={<LetterView />} />
      <Route path="/view" element={<PublicLetters />} />
    </Routes>
  );
};

export default Router;
