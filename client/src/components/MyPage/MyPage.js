import React, { useState } from 'react';
import './MyPage.css';
import buttonImage from '../../assets/MyPage/Arrow.png';
import imageAboveText from '../../assets/MyPage/image.png';
import lettersData from './mockLetters.json'; // 같은 폴더에 mockLetters.json

function MyPage() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const letters = lettersData.letters || [];

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
              key={index}
              className={`gray-box ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
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
