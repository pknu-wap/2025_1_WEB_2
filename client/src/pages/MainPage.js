import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/MainPage/MainPage.module.css";
import PostBox from "../assets/MainPage/postbox.png";

import ViewCountPage from "./ViewCountPage";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.main_page}>
      <div className={styles.main_container}>
        <div className={styles.content_box}>
          <div className={styles.text_box}>
            <div>
              <p className={styles.title}>지금 쓰는 편지,</p>
              <p className={styles.title}>미래에 도착합니다.</p>
            </div>

            <div className={styles.btn_box}>
              <button
                className={styles.btn}
                onClick={() => navigate("/create")}
              >
                편지 보내기
              </button>
              <button className={styles.btn} onClick={() => navigate("/view")}>
                편지 구경하기
              </button>
            </div>
          </div>
          <img
            className={styles.post_box}
            src={PostBox}
            alt={"우체통 이미지"}
          />
        </div>

        <ViewCountPage />
      </div>
    </div>
  );
};

export default MainPage;
