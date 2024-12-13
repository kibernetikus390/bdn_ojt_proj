import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Start from "./pages/Start.jsx";
import Quiz from "./pages/Quiz.jsx";
import qs from "./q.js";

const App = () => {
  const [pageState, setpageState] = useState("start");

  return (
    <Router>
      {/* <nav>
        <p>login</p>
        <p>register</p>
      </nav> */}
      <Routes>
        <Route path="/" element={<Start/>}/>
        <Route path="/quiz" element={<Quiz/>}/>
      </Routes>
    </Router>
  );
};

export default App;
