import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPage2.css";
import imageAboveText from "../../assets/MyPage/image.png";
import LockImage from "../../assets/MyPage/lock.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPage2() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [letters, setLetters] = useState([]);
  const navigate = useNavigate();

  const handleLetterClick = (letterId) => {
    navigate(`/view/${letterId}`);
  };

  const handleButtonClick = () => {
    navigate('/mypage');
  };

  useEffect(() => {
    const fetchLetters = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인 토큰이 없습니다. 다시 로그인해주세요.");
        return;
      }
      try {
        const response = await axios.get(`${API_BASE_URL}/letter/get_all_of_me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { arr_letter, error } = response.data;
        if (error) {
          alert("편지 목록을 불러오지 못했습니다: " + error);
          return;
        }

        const now = Date.now();
        const arrivingLetters = arr_letter.filter(letter => letter.time_receive > now);
        setLetters(arrivingLetters);
      } catch (e) {
        alert("편지 목록 요청 중 오류 발생: " + e.message);
      }
    };

    fetchLetters();
  }, []);

  return (
    <div className="MyPage2">
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
          <button
            className="letter-arrived"
            onClick={handleButtonClick}
          >
            도착한 편지
          </button>
          <button className="letter-arriving">도착 중인 편지</button>
        </div>

        <div className="arriving-box-container">
          {letters.length === 0 && <p>도착 중인 편지가 없습니다.</p>}
          {letters.map((letter, index) => (
            <div
              key={letter.id || index}
              className="arriving-box"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleLetterClick(letter.id)}
            >
              {hoveredIndex === index && (
                <div className="box-title">{letter.title}</div>
              )}
              <img
                src={LockImage}
                alt="자물쇠 이미지"
                className="lock-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage2;
