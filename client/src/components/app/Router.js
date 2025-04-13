import { React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";
import LetterView from "../LetterView/LetterView";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 아래는 임의의 Route */}
        <Route path="/create" element={<LetterCreatePage />} />
        {/* <Route path="/mypage" element={<MyPage />} /> */}
        <Route path="/view/:id" element={<LetterView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
