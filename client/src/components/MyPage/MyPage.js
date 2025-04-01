import React from 'react';
import './MyPage.css';
import buttonImage from '../../assets/MyPage/Arrow.png';
import imageAboveText from '../../assets/MyPage/image.png';

function MyPage() {
  return (
    <div className="MyPage">
      <div className="line"></div> 
      <div className="box">
        <div className="intro-content">
          <img src={imageAboveText} alt="소개 이미지" className="profile-image" />
          <p className="name-text">@@</p>
        </div>
        <p className="intro-text">한줄소개입니다.</p>
        <button className='profile-button'>프로필 편집</button>
        <div className="gray-box-container">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="gray-box"></div>
          ))}
        </div>
      </div>
      <button className='back-button'>
        <img src={buttonImage} alt="버튼 이미지" className="button-image" />
      </button>
    </div>
  );
}

export default MyPage;
