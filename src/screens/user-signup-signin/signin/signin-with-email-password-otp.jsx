import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NormalInputField from "../../../components/input-fields/normal-input-field";
import NormalButton from "../../../components/buttons/normal-button";
import axios from "axios";
import PasswordInputField from "../../../components/input-fields/password-input-field";
import CheckboxInputField from "../../../components/input-fields/checkbox-input-field";
import Tooltip from "../../../components/miscellaneous/tooltip";
import { icon, image } from "../../../components/assets/assets";
import EvuemeLabelTag from "../../../components/evueme-html-tags/evueme-label-tag";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import M from "materialize-css";
import Cookies from "js-cookie";
import {
  setAccessToken,
  setCurrentUser,
  setUserState
} from "../../../redux/slices/signin-slice";
import { useDispatch } from "react-redux";
import ErrorToast from "../../../components/toasts/error-toast";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import WarningToast from "../../../components/toasts/warning-toast";
import SuccessToast from "../../../components/toasts/success-toast";
import axiosInstance from "../../../interceptors";
import MobileNumberInputField from "../../../components/input-fields/mobile-number-input-field";
import {
  getCountryCode,
  getPhoneNumber,
} from "../../../utils/phoneNumberUtils";
import { useGlobalContext } from "../../../context";
import { APP_AUTH_URL, baseUrl } from "../../../config/config";

const INITIAL_ERROR_STATE = {
  emailId: false,
  password: false
}

const SigninWithEmailPasswordOTP = ({ mobileNumber, setMobileNumber }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [actualOTP, setActualOtp] = useState("");
  // const [openEnterOTp, setOpenEnterOtp] = useState(false);
  const [error, setError] = useState(INITIAL_ERROR_STATE)
  const [mobileNumberEnabled, setMobileNumberEnabled] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hostname } = useGlobalContext();

  console.log('hostname sign in with email password otp page ::: ', hostname);

  //Handle Login with email password
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("xxxxxx---------->");
    
    try {
      setLoading(true);
      setError(INITIAL_ERROR_STATE);
      if (!email || !password) {
        let update = {};
        if (!email) update["emailId"] = true;
        if (!password) update["password"] = true;
        setError(prev => ({ ...prev, ...update }));
        return WarningToast("Please Enter required fields");
      }

      if (email && password) {
        const formData = new FormData();
        formData.append("grant_type", "password");
        formData.append("client_id", "ev-client");
        formData.append("client_secret", "egov");
        formData.append("username", email);
        formData.append("password", password);
        const response = await axios.post(
          `https://${hostname}-auth.evueme.dev/oauth2/token`,
          // `${APP_AUTH_URL}/oauth2/token`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const userName = response.data.firstName;
        const userType = response.data.userType;
        const tncStatus = response.data.tnCstatus;
        const userId = response.data.pk;
        const token = response.data.access_token;

        dispatch(setUserState({ userName, userType, tncStatus, userId, token }));
        Cookies.set("e_access_token", token, {
          expires: 1,
        });

        if (staySignedIn) {
          localStorage.setItem("e_access_token", token);
        }
        if (userType === "Others") {
          navigate("/user/");
          return;
        } else if (!tncStatus) {
          navigate("/admin/terms-of-use");
        } else {
          navigate("/admin/scores-by-interview-round");
        }
      } else if (!email) {
        WarningToast("Email field is empty!");
      } else if (!password) {
        WarningToast("Password field is empty!");
      }
    } catch (error) {
      ErrorToast("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  //Handle Login with OTP
  const handleEnterOTP = async (e) => {
    e.preventDefault();
    // Define a regex pattern for a valid mobile number
    // const mobileNumberPattern = /^[0-9]{10}$/;

    // if (!mobileNumberPattern.test(mobileNumber)) {
    //   return WarningToast(
    //     "Invalid mobile number. Please enter a 10-digit number."
    //   );
    // }

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
        navigate("enter-otp", { state: { ActualOTP: data.otp } });
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the verification code!");
    } finally {
      setLoading(false);
    }
  };

  // forgot password
  const forgotPasswordHandler = async () => {
    try {
      if (!email) {
        return WarningToast("Enter Email Id");
      }
      const response = await axiosInstance.post(
        `${baseUrl}/common/otp/request-password-reset`,
        {
          emailId: email,
        }
      );
      const data = response.data;
      if (
        data.success ||
        response.status === 200 ||
        response.statusText === "OK"
      ) {
        SuccessToast(data.message || "Reset password link sent !");
      }
      else {
        ErrorToast(data.message || "Error sending the password reset link!");
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the password reset link!");
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem("e_access_token") || Cookies.get("e_access_token");

    if (token) {
      dispatch(setAccessToken(token));
      navigate("/admin/candidate-video-answers");
    }

    document.title = "EvueMe Login";
    M.updateTextFields();
    localStorage.clear();
  }, []);

  return (
    <>
      {loading && <EvuemeLoader />}
      <div className="col s12 xl6 l6 m6 login-wrap">
        <div className="login-wrap-box">
          <h3 className="carretColor-transparent">
            Already have an account? Sign in
          </h3>
          <form onSubmit={handleLogin} className="loginform">
            <NormalInputField
              divTagCssClasses="input-field"
              inputTagCssClasses="validate"
              type="email"
              inputTagIdAndName={"emailId"}
              placeholder={"Enter Your Email Id"}
              value={email}
              onChange={(e) => setEmail(() => e.target.value)}
              leftIconSrc={icon.emailAddressIcon}
              leftIconAltText="enter-email"
              labelText={"Enter Your Email ID"}
              missing={error.emailId}
            />
            <PasswordInputField
              divTagCssClasses="input-field password-relative"
              inputTagCssClasses="password validate"
              inputTagIdAndName={"password"}
              placeholder={"Enter Your Password"}
              value={password}
              onChange={(e) => setPassword(() => e.target.value)}
              leftIconSrc={icon.lockIcon}
              labelText={"Enter Your Password"}
              missing={error.password}
            />
            <div className="fp-section">
              <a onClick={forgotPasswordHandler}>Forgot Password</a>
              <div className="help-box right">
                <span>
                  <EvuemeImageTag
                    imgSrc={icon.questionMarkIcon}
                    altText={"forgot-password"}
                  />
                  <Tooltip divTagCssClasses="information-box">
                    <figure>
                      <EvuemeImageTag
                        imgSrc={image.cartoonDrinkingJuiceImage}
                        altText={"information-box"}
                      />
                    </figure>
                    <p>
                      Please enter your registered email address. An email
                      notification with a password reset code will sent to you.
                    </p>
                    {/* <Link to="#">Click here for more info</Link> */}
                  </Tooltip>
                </span>
                Help
              </div>
            </div>
            <NormalButton
              buttonTagCssClasses={"btn-large fullwidth-btn"}
              buttonText={"Sign in"}
              onClick={handleLogin}
              type={"Submit"}
            />
            <div className="loginwith">
              <div className="border-separetor"></div>
              <span>Or login with mobile number and verification code</span>
            </div>
            <MobileNumberInputField
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e)}
              labelText={"Enter Your Number"}
              setMobileNumberEnabled={setMobileNumberEnabled}
            />
            <NormalButton
              buttonTagCssClasses={"btn-large fullwidth-btn"}
              buttonText={"Continue"}
              disabled={!mobileNumberEnabled}
              onClick={handleEnterOTP}
            />
            <div className="staysignin">
              <EvuemeLabelTag>
                <CheckboxInputField
                  inputTagIdAndName="staySignedIn"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(() => e.target.checked)}
                  labelText={"Stay Signed in"}
                />
                <span>
                  <Link to="#" className="show-details">
                    {" "}
                    Details
                    <div className="triangle-up" />
                    <Tooltip divTagCssClasses={"infbox-click"}>
                      <header>
                        <h3>Stay signed in Checkbox</h3>
                        {/* <span className="cross-del">
                          <EvuemeImageTag
                            imgSrc={icon.crossIcon}
                            altText={"Stay-signedin-checkbox"}
                          />
                        </span> */}
                      </header>
                      <p>
                        Choosing "Keep me signed in" reduces the number of times
                        you're asked to Sign-In on this device.
                      </p>
                      <p>
                        To keep your account secure, use this option only on
                        your personal devices.
                      </p>
                    </Tooltip>
                  </Link>
                </span>
              </EvuemeLabelTag>
            </div>
            <p>
              By signing up, you agree to{" "}
              <Link to="https://evueme.ai/terms_of_use">Terms of Service</Link>{" "}
              and
              <Link to="https://evueme.ai/privacy_policy"> Privacy Policy</Link>
              . You also agree to receive interview and marketing related
              information on WhatsApp and email from Evue Technologies Pvt. Ltd
              and their clients
            </p>
            <div className="login-box-footer">
              <div className="left">
                New User? <Link to="/signup">Sign up</Link>
                <i className="show-details infermation-ico-black">
                  i
                  <Tooltip divTagCssClasses={"infbox-click"}>
                    <header>
                      <h3>New Candidate</h3>
                      {/* <span className="cross-del">
                        <EvuemeImageTag
                          imgSrc={icon.crossIcon}
                          altText={"entity-signup-information-box"}
                        />
                      </span> */}
                    </header>
                    <p>
                      If you are a candidate or someone looking for a job, sign
                      up here
                    </p>
                  </Tooltip>
                </i>
              </div>
              <div className="right">
                New Entity? <Link to="/entity-signup/step-1">Sign up</Link>
                <i className="show-details infermation-ico-black">
                  i
                  <Tooltip divTagCssClasses={"infbox-click"}>
                    <header>
                      <h3>New Entity Sign up</h3>
                      {/* <span className="cross-del">
                         <EvuemeImageTag
                          imgSrc={icon.crossIcon}
                          altText={"entity-signup-information-box"}
                        />
                      </span> */}
                    </header>
                    <p>
                      If you are a private or government organization, a
                      startup, an educational institution or a staffing agency,
                      sign up here
                    </p>
                  </Tooltip>
                </i>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SigninWithEmailPasswordOTP;
