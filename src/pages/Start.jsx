import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

export default function Start(){
    const navigate = useNavigate();
    const handleClickStart = () => {
      navigate("/quiz", {state:{num:10, quiz:undefined}});
    };
    return (
      <>
        <button onClick={handleClickStart}>スタート</button>
      </>
    );
  }