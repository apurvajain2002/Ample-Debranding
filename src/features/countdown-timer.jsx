import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WarningToast from "../components/toasts/warning-toast";

const CountdownTimer = ({
  otpTime,
  setOtpTime,
  setOtpSent = () => {},
  prevNav = "/",
  originalOtpTime=2*60,
  startTimer=false,
  ...props
}) => {

  const navigate = useNavigate();
  let timer = useRef();
  useEffect(() => {
    if(!startTimer)return;
    timer.current = setInterval(() => {
      setOtpTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer.current);
      setOtpTime(originalOtpTime);
    };
  }, [setOtpTime]);

  useEffect(() => {
    if (otpTime === 0) {
      WarningToast("Time up!");
      clearInterval(timer.current);
      setOtpSent(false);
      // navigate(prevNav);
    }
  }, [otpTime, navigate, prevNav]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return <div{...props}>{formatTime(otpTime)}</div>;
};

export default CountdownTimer;
