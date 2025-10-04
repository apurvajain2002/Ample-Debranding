import { useEffect, useRef, useState } from "react";
import CountdownTimer from "../../../features/countdown-timer";
import { useNavigate } from "react-router-dom";
import OtpInputField from "../../../components/input-fields/otp-input-field";
import Tooltip from "../../../components/miscellaneous/tooltip";
import ErrorToast from "../../../components/toasts/error-toast";
import axios from "axios";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import M from "materialize-css";
import {
  setUserState,
} from "../../../redux/slices/signin-slice";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import {
  getCountryCode,
  getPhoneNumber,
} from "../../../utils/phoneNumberUtils";
import { useLocation } from 'react-router-dom';
import axiosInstance from "../../../interceptors";
import SuccessToast from "../../../components/toasts/success-toast";
import { useGlobalContext } from "../../../context";
import { baseUrl } from "../../config/config";
import { APP_AUTH_URL, baseUrl } from "../../config/config";
const numberOfDigits = 6;
const initialTime = 1 * 60;

const LoginWithOTP = ({
  resendOtp = false,
  setResendSent = () => { },
  mobileNumber,
  prevNav = "/",
  callBackFn = () => { },
  isModal = false,
  otpSent = true,
  setOtpSent = () => { },
  actualOTP = "",
  otpInitialTime = initialTime,
}) => {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const otpBoxReference = useRef([]);
  const [otpTime, setOtpTime] = useState(otpInitialTime);
  const [loading, setLoading] = useState(false);
  const [allowContinue, setAllowContinue] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { hostname } = useGlobalContext();
  console.log('hostname enter otp page ::: ', hostname);
  const { ActualOTP } = location?.state ? location.state : "";
  actualOTP = ActualOTP ? ActualOTP : actualOTP

  // Handling OTP input
  const handleSetOtpChange = (value, index) => {
    let newArr = [...otp];
    newArr[index] = value;
    setOtp(() => newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  };

  // Handle backspace key
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      if (index > 0) {
        // If the input field is empty, move the focus to the previous input field
        if (!otp[index]) {
          otpBoxReference.current[index - 1].focus();
        }

        // Update the otp state to remove the character at the current index
        let newArr = [...otp];
        newArr[index] = "";
        setOtp(() => newArr);
      }
    }
  };

  const handleEnterOTP = async (e) => {
    e.preventDefault();
    // Define a regex pattern for a valid mobile number
    // const mobileNumberPattern = /^[0-9]{10}$/;

    // if (!mobileNumberPattern.test(mobileNumber)) {
    //   return WarningToast(
    //     "Invalid mobile number. Please enter a 10-digit number."
    //   );
    // }

    setOtpTime(otpInitialTime);
    setOtpSent(true);

    try {
      setLoading(true);
      const countryCode = getCountryCode(mobileNumber);
      const nationalNumber = getPhoneNumber(mobileNumber);

      const response = await axiosInstance.post(
        `${baseUrl}/common/otp/generate-otp`,
        { phoneCode: `+${countryCode}`, mobileNo: nationalNumber }
      );
      const data = response.data;
      if (
        data.success ||
        response.status === 200 ||
        response.statusText === "OK"
      ) {
        SuccessToast(data.message || "verification code sent successfully!");
         navigate("/signin/enter-otp", { state: { ActualOTP: data.otp } });
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the OTP!");
    } finally {
      setLoading(false);
    }
  };

  // Handle Submit OTP
  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    let stringOtp = otp.toString();
    stringOtp = stringOtp.split(",").join("");
    const countryCode = getCountryCode(mobileNumber);
    const nationalNumber = getPhoneNumber(mobileNumber);

    if (actualOTP !== stringOtp) {
      ErrorToast("Invalid verification code!");
      return;
    }
    if (isModal) {
      return callBackFn(actualOTP === stringOtp);
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("grant_type", "password");
      formData.append("client_id", "ev-client");
      formData.append("client_secret", "egov");
      formData.append("username", nationalNumber);
      formData.append("password", stringOtp);
      const response = await axios.post(
        // `https://${hostname}-auth.evueme.dev/oauth2/token`,
        `${APP_AUTH_URL}/oauth2/token`,
        // { phoneCode: countryCode, mobileNo: nationalNumber, otp: stringOtp }
        formData
      );
      const data = response.data;
      if (
        data.success ||
        response.status === 200 ||
        response.status === "OK" ||
        response.statusText === "OK"
      ) {
        // yet to be implemented
        const user = response.data.firstName;
        const firstTimeSignIn = response.data.firstTimeSignIn;
        const userType = response.data.userType;
        const tncStatus = response.data.tnCstatus;
        const userId = response.data.pk;
        const token = response.data.access_token;

        dispatch(setUserState({ 
          userName: user, 
          userType, 
          tncStatus, 
          userId, 
          token 
        }));
        
        Cookies.set("e_access_token", token, {
          expires: 1,
        });
        if (userType === "Others") {
          navigate("/user/")
          return
        }
        if (firstTimeSignIn) {
          navigate("/terms-of-use");
        } else {
          navigate("/admin/candidate-video-answers");
        }
      }
    } catch (error) {
      ErrorToast(error.message || "Invalid verification code!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!mobileNumber) {
      if (prevNav) navigate(prevNav);
      else navigate("/login");
    }
  }, [mobileNumber, navigate]);

  useEffect(() => {
    // Only initialize Materialize if we're not in a modal context
    if (!isModal) {
      M.AutoInit();
    }
    return () => {
      setOtp(new Array(numberOfDigits).fill(""));
    };
  }, [isModal]);

  useEffect(() => {
    setAllowContinue(otp.every((s) => s !== ""));
  }, [otp]);

  


  return (
    <>
      {loading && <EvuemeLoader />}
      <div
        className={`col xl6 l6 m6 s12 login-wrap ${isModal ? "isModal" : ""}`}
      >
        <div className="login-wrap-box">
          <h3>Verify your mobile number</h3>
          <p>We have just sent a 6 digit verification code to your phone number</p>
          <div
            className="loginform otp-form"
            onSubmit={handleSubmitOtp}
            style={isModal ? { height: "200px", padding: "32px" } : {}}
          >
            <div className="otp-field">
              {otp.map((otpVal, index) => (
                <OtpInputField
                  key={index}
                  index={index}
                  otpBoxReference={otpBoxReference}
                  value={otpVal}
                  onChange={(e) => handleSetOtpChange(e.target.value, index)}
                  ref={(reference) =>
                    (otpBoxReference.current[index] = reference)
                  }
                  onKeyDown={(e) => handleBackspace(e, index)}
                />
              ))}
            </div>
            <span className="otp-recived">
              <div style={{display: 'inline-block'}}>
            <i className="show-details infermation-ico-black"
                                  style={{ padding: '0', marginRight: '5px', marginBottom: '5px'}}>

                i
                <Tooltip divTagCssClasses={"infbox-click"}>
                  <p>
                  When the verification code timer reaches 0, click on 'Resend verification code' to receive a new verification code and verify your number.
                  </p>
                </Tooltip>
              </i>
              </div>
              {/* <p style={{marginRight: '5px'}}> */}
              Didn't receive verification code?
              {/* </p> */}
              <font style={{marginLeft: '10px'}}>
                {otpSent && (
                  <CountdownTimer
                   
                    otpTime={otpTime}
                    setOtpTime={setOtpTime}
                    prevNav={prevNav}
                    otpSent={otpSent}
                    setOtpSent={setOtpSent}
                    originalOtpTime={initialTime}
                    startTimer={otpSent}
                    // style={{marginLeft:'5px'}}
                  />

                )}
                {otpTime === 0 ? (
  <span 
    style={{ color: 'red', cursor: 'pointer' }} 
    onClick={handleEnterOTP}
  >
    Resend verification code
  </span>
) : null}
              </font>

            </span>
            <button
              className={`waves-effect waves-light btn btn-large fullwidth-btn graybtn modal-close ${allowContinue ? "" : "disabled"
                }`}
                onClick={handleSubmitOtp}
            >
             Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginWithOTP;
