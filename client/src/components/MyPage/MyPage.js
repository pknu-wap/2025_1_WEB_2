import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./MyPage.css";
import imageAboveText from "../../assets/MyPage/image.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPage() {
  const [letters, setLetters] = useState([]);
  const [userNickname, setUserNickname] = useState("사용자");
  const [isHoveringArriving, setIsHoveringArriving] = useState(false);
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserNickname(decoded.nickname || decoded.name || "사용자");
      }
    }
  }, []);

  const handleLetterClick = (letterId) => {
    navigate(`/view/${letterId}`);
  };

  const handleButtonClick = () => {
    navigate("/mypage2");
  };

  useEffect(() => {
    const fetchLetters = async () => {
      const token = Cookies.get("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
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
          alert("편지 데이터를 불러오는 중 오류 발생: " + error);
          return;
        }

        const now = Date.now();
        const arrivedLetters = arr_letter.filter(letter => letter.time_receive <= now);

        setLetters(arrivedLetters);
      } catch (e) {
        alert("편지 목록 요청 실패: " + e.message);
      }
    };

    fetchLetters();
  }, [navigate]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}년 ${mm}월 ${dd}일`;
  };

  return (
    <div className="MyPage">
      <div className="box_1">
        <div className="intro-content_1">
          <img src={imageAboveText} alt="프로필 이미지" className="profile-image" />
          <p className="name-text_1">{userNickname}</p>
        </div>
        <p className="intro-text_1">한줄소개입니다.</p>
        <button className="profile-button_1">프로필 편집</button>
        <div className="line_1">
          <button className={`letter-arrived_1 ${isHoveringArriving ? "hovered-by-arriving" : ""}`}>
            도착한 편지
          </button>
          <button
            className="letter-arriving_1"
            onMouseEnter={() => setIsHoveringArriving(true)}
            onMouseLeave={() => setIsHoveringArriving(false)}
            onClick={handleButtonClick}
          >
            도착 중인 편지
          </button>
        </div>

        <div className="arrived-box-container_1">
          {letters.length === 0 && <p>도착한 편지가 없습니다.</p>}
          {letters.map((letter, index) => (
            <div
              key={letter.id || index}
              className="arrived-box_1"
              onClick={() => handleLetterClick(letter.id)}
            >
              <div className="letter-date_1">{formatDate(letter.time_receive)}</div>
              <div className="letter-title_1">{letter.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
