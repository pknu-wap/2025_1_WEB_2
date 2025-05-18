import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./MyPage2.css";
import imageAboveText from "../../assets/MyPage/image.png";
import LockImage from "../../assets/MyPage/lock.png";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function MyPage2() {
  const [letters, setLetters] = useState([]);
  const [userNickname, setUserNickname] = useState("FROM");
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
        setUserNickname(decoded.nickname || decoded.name || "FROM");
      }
    }
  }, []);

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
          alert("편지 목록을 불러오지 못했습니다: " + error);
          return;
        }
        const now = Date.now();

        const arrivingLetters = arr_letter.filter((letter) => letter.time_receive > now);
        setLetters(arrivingLetters);
      } catch (e) {
        alert("편지 목록 요청 중 오류 발생: " + e.message);
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

  const getDaysLeft = (timestamp) => {
    const now = new Date();
    const diffMs = timestamp - now.getTime();
    return diffMs > 0 ? Math.ceil(diffMs / (1000 * 60 * 60 * 24)) : 0;
  };

  const handleLetterClick = (letterId) => {
    navigate(`/letter/${letterId}`); 
  };

  return (
    <div className="MyPage2">
      <div className="box_2">
        <div className="intro-content_2">
          <img src={imageAboveText} alt="프로필 이미지" className="profile-image" />
          <p className="name-text_2">{userNickname}</p>
        </div>

        <div className="arriving-box-container_2">
          {letters.length === 0 && <p>도착 중인 편지가 없습니다.</p>}
          {letters.map((letter, index) => (
            <div
              key={letter.id || index}
              className="arrived-letter-box_2"
              onClick={() => handleLetterClick(letter.id)}
              style={{ cursor: "pointer" }}
            >
              <img src={LockImage} alt="lock" className="lock-image" />
              <div className="letter-info_2">
                <p className="letter-from_2">FROM: {letter.sender_nickname || "알 수 없음"}</p>
                <p className="letter-arrival-date_2">도착 예정일: {formatDate(letter.time_receive)}</p>
                <p className="letter-days-left_2">남은 일수: {getDaysLeft(letter.time_receive)}일</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyPage2;
