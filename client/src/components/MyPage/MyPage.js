import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import "./MyPage.css";
import imageAboveText from "../../assets/MyPage/image.png";
import lettersData from "./mockLetters.json";

function MyPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [letters] = useState(lettersData.letters || []);
  const navigate = useNavigate();

  const handleLetterClick = (letterId) => {
    navigate(`/view/${letterId}`);
  };

  // const handleFetchLetterData = async (letterId) => {
  //   try {
  //     // 편지 데이터를 서버로부터 가져오기 (예시 URL로 요청)
  //     const response = await axios.get(`/api/letters/${letterId}`);
  //     // 성공적으로 데이터를 받아온 경우
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error fetching letter data:", error);
  //   }
  // };

  return (
    <div className="MyPage">
      <div className="box">
        <div className="intro-content">
          <img
            src={imageAboveText}
            alt="프로필 이미지"
            className="profile-image"
          />
          <p className="name-text">@@</p>
        </div>
        <p className="intro-text">한줄소개입니다.</p>
        <button className="profile-button">프로필 편집</button>
        <div className="line">
          <button className="letter-arrived">도착한 편지</button>
          <button className="letter-arriving">도착 중인 편지</button>
        </div>

        <div className="arrived-box-container">
          {letters.map((letter, index) => (
            <div className="arrived-box"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleLetterClick(letter.id)}
            >
              {hoveredIndex === index && (
                <div className="box-title">{letter.title}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
