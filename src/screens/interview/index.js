import { Route, Routes, useLocation } from "react-router-dom";
import InterviewFooter from "../../components/interview/interview-footer";
import InterviewHeader from "../../components/interview/interview-header";
import InterviewComplete from "./complete";
import LanguageSelection from "./language-selection";
import InterviewReport from "../interview-report";
import { useEffect, useState } from "react";

const Interview = () => {
  const [overflowStyle, setOverflowStyle] = useState("none");
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.includes("/report")) {
      setOverflowStyle("scroll");
    } else {
      setOverflowStyle("");
    }
  }, [location.pathname]);
  return (
    <div>
      <InterviewHeader />
      <div className="vide-robo-wrapper container">
        <div className="robo-outwrapper" style={{ height: "100%",overflow:overflowStyle }}>
          <Routes>
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/complete" element={<InterviewComplete />} />
            <Route path="/report" element={<InterviewReport/>} />
          </Routes>
        </div>
      </div>
      <InterviewFooter style={{ margin: 0 }} />
    </div>
  );
};

export default Interview;
