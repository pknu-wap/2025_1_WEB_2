import { React } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LetterCreatePage from "../../pages/LetterCreatePage";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 아래는 임의의 Route */}
        <Route path="/create" element={<LetterCreatePage />} />
        {/* <Route path="/mypage" element={<MyPage />} />
        <Route path="/view" element={<LetterViewPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
