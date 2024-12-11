import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

export default function Start(){
    const navigate = useNavigate();
    const handleClickStart = () => {
      navigate("/quiz");
    };
    return (
      <>
        <button onClick={handleClickStart}>スタート</button>
      </>
    );
  }