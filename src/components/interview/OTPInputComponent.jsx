import NormalButton from "../buttons/normal-button";
import NormalInputField from "../input-fields/normal-input-field";
import CountdownTimer from "../../features/countdown-timer";
const initialTime = 2 * 60;

const OTPInputComponent = ({
  otp = "",
  setOtp = () => {},
  time,
  setTime = () => {},
  setIsOtpSent = () => {},
  isOtpSent = false,
  handleResendOtp = () => {},
  handleVerifyOTP = () => {},
}) => {
  return (
    <>
      <div className="overlay-content">
        <div className="otp-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "10px",
              // width: "100%"
            }}
          >
            <div className="interview-otp-field">
              <NormalInputField
                divTagCssClasses="input-field-otp"
                inputTagIdAndName="otp-input"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value) && value.length <= 6) {
                    setOtp(value);
                  }
                }}
                type="number"
                placeholder={"Enter verification code"}
                // maxLength={6}
                style={{ background: "#fff", border: "none" }}
                autoComplete={"off"}
              />
              <CountdownTimer
                className="countdown-otp"
                otpTime={time}
                setOtpTime={setTime}
                setOtpSent={setIsOtpSent}
                originalOtpTime={initialTime}
                startTimer={isOtpSent}
                style={{ padding: "0 8px" }}
              />
            </div>
            <NormalButton
              buttonTagCssClasses={"btn-large otp-btn"}
              buttonText={"Resend verification code"}
              onClick={handleResendOtp}
            />
            <NormalButton
              buttonTagCssClasses={"btn-large otp-btn"}
              buttonText={"Verify verification code"}
              disabled={otp.length < 6}
              onClick={handleVerifyOTP}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPInputComponent;
