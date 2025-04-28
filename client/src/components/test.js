import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const TestPage = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // 쿠키에서 token을 가져오기
    const tokenFromCookie = Cookies.get("token");

    setToken(tokenFromCookie); // 상태로 저장
    // const fetchProjectDetails = async () => {
    //   try {
    //     const response = await axios.get(
    //       `${process.env.REACT_APP_API_BASE_URL}/account/my`,
    //       {
    //         headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    //       }
    //     );

    //     const data = response.data;
    //     setMyData(data);
    //     console.log("API 응답 데이터:", data);
    //   } catch (error) {
    //     alert("내 정보를 가져오는데 실패했습니다. ");
    //     navigate("/");
    //   }
    // };

    // fetchProjectDetails();
  }, []);

  return (
    <div>
      {token ? <p>토큰이 존재합니다</p> : <p>토큰이 없습니다.</p>}
      {/* 
      <h1> 닉네임 : {myData.email}</h1> */}
    </div>
  );
};

export default TestPage;
