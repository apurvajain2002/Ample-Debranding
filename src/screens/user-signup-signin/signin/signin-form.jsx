import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import SigninWithEmailPasswordOTP from "./signin-with-email-password-otp";
import EnterOTP from "./enter-otp";

const Siginform = () => {
  const [mobileNumber, setMobileNumber] = useState("");

  return (
    <Routes>
      <Route path="/" element={<SigninWithEmailPasswordOTP mobileNumber={mobileNumber} setMobileNumber={setMobileNumber}/>} />
      <Route path="/enter-otp" element={<EnterOTP mobileNumber={mobileNumber}/>} />
    </Routes>
  );
};

export default Siginform;
