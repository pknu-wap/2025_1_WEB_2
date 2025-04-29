import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const TestPage = () => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const tokenFromCookie = Cookies.get("token");

    if (tokenFromCookie) setToken(tokenFromCookie); // 상태로는 저장 (필요하면 UI에서 활용)

    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/account/my`,
          {
            headers: { Authorization: `Bearer ${tokenFromCookie}` },
          }
        );

        const data = response.data;
        setUserInfo(data);
      } catch (error) {
        alert("내 정보를 가져오는데 실패했습니다.");
      }
    };

    fetchProjectDetails();
  }, []);

  return (
    <div>
      {token ? <p>토큰이 존재합니다</p> : <p>토큰이 없습니다.</p>}
      {userInfo?.name}
    </div>
  );
};

export default TestPage;
