import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyPage.css';
import buttonImage from '../../assets/MyPage/Arrow.png';
import imageAboveText from '../../assets/MyPage/image.png';
import lettersData from './mockLetters.json';

function MyPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [letters, setLetters] = useState(lettersData.letters || []);
  const navigate = useNavigate();

  const handleLetterClick = (letterId) => {
    navigate(`/view/${letterId}`);
  };

  const handleFetchLetterData = async (letterId) => {
    try {
      const response = await axios.get(`/api/letters/${letterId}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching letter data:", error);
    }
  };

  return (
    <div className="MyPage">
      <div className="box">
        <div className="intro-content">
          <img src={imageAboveText} alt="소개 이미지" className="profile-image" />
          <p className="name-text">@@</p>
        </div>
        <p className="intro-text">한줄소개입니다.</p>
        <button className="profile-button">프로필 편집</button>
        <div className="line"></div>

        <div className="gray-box-container">
          {letters.map((letter, index) => (
            <div
              key={letter.id} 
              className={`gray-box ${hoveredIndex === index ? 'hovered' : ''}`}
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
