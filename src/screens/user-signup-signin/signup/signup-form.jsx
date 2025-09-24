import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { validateNames } from "../../../utils/valdationRegex";
import { icon } from "../../../components/assets/assets";
import NormalInputField from "../../../components/input-fields/normal-input-field";
import PasswordInputField from "../../../components/input-fields/password-input-field";
import NormalButton from "../../../components/buttons/normal-button";
import WarningToast from "../../../components/toasts/warning-toast";
import MobileNumberInputField from "../../../components/input-fields/mobile-number-input-field";
import { checkPasswordStrength } from "../../../utils/valdationRegex";
import SuccessToast from "../../../components/toasts/success-toast";
import { saveCandidate } from "../../../redux/actions/sign-up-actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateEmailInput } from "../../../utils/valdationRegex";
import { getCountryCode, getPhoneNumber } from "../../../utils/phoneNumberUtils";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import ErrorToast from "../../../components/toasts/error-toast";

const SignupForm = () => {
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [whatsappNo, setWhatsappNo] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [whastappVerified, setWhastappVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiCalled, setApiCalled] = useState(false); // Track if API has been called
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleOnChangeNewUser = (e) => {
  //   setNewUser({
  //     ...newUser,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleOnChangeNewUser = (e) => {
    const { name, value } = e.target;

    const nameRegex = /^[A-Za-z\s]*$/;

    // Validate first name and last name inputs
    if ((name === 'firstName' || name === 'lastName') && !nameRegex.test(value)) {
      return; // Do not update state if invalid characters are present
    }

    setNewUser((prevUser) => {
      const updatedUser = {
        ...prevUser,
        [name]: value,
      };

      return updatedUser; // Return the updated state
    });
  };

  const handleOnClickVerifyContactNo =()=>{
          // Check if the required fields are filled to trigger the API call
    const { firstName, lastName, mobileNumber, whatsappNumber } = newUser;

    if (!apiCalled && firstName && lastName && (mobileNumber || whatsappNumber)) {
      handleSaveCandidate(newUser); // Pass updatedUser to the API call
    }
  }

  const handleConfirmPassword = () => {
    return newUser.password === newUser.confirmPassword;
  };

  const handleSaveCandidate = async (updatedUser) => {
    setIsLoading(true);
    const res = await dispatch(
      saveCandidate({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        mobileNumber1: getPhoneNumber(updatedUser.mobileNumber),
        whatsappNumber: getPhoneNumber(updatedUser.whatsappNumber),
        primaryEmailId: updatedUser.email,
        mobileNumber1CountryCode: getCountryCode(updatedUser.mobileNumber) ? ("+" + getCountryCode(updatedUser.mobileNumber)) : "",
        whatsappNumberCountryCode: getCountryCode(updatedUser.whatsappNumber) ? ("+" + getCountryCode(updatedUser.whatsappNumber)) : "",
        whatsappNumberVerified: whastappVerified,
        mobileNumber1Verified: mobileVerified,
      })
    );
    setIsLoading(false);
    setApiCalled(true); // Set the flag to true after the API call

    if (res.payload?.success || res.success) {
      SuccessToast(
        res.payload?.message || res.message || "User Created Successfully!"
      );
    }
    // else {
    //   ErrorToast(res.message || "Error creating User!");
    // }
  };

  useEffect(() => {
    const { firstName, lastName, email, mobileNumber, whatsappNumber } = newUser;
    if (!firstName || !lastName) {
      setFeedbackMessage("Please enter your First Name and Last Name.");
    } else if (!mobileNumber && !whatsappNumber) {
      setFeedbackMessage("Please enter either your Mobile Number or WhatsApp Number.");
    } else if (!email) {
      setFeedbackMessage("Please enter your Email Id.");
    } else {
      setFeedbackMessage("");
    }

    setAllowSubmit(
      firstName &&
      lastName &&
      email &&
      (mobileNumber.length >= 4 || whatsappNumber.length >= 4)
    );
  }, [newUser]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newUser.firstName || !newUser.lastName) {
      return WarningToast("Please enter your name.");
    }

    if (!newUser.email) {
      return WarningToast("Please enter email.");
    }

    if (!newUser.whatsappNumber && !newUser.mobileNumber) {
      return WarningToast("Please enter Mobile number of Whatsapp number !");
    }

    // if (!whastappVerified && !mobileVerified) {
    //   return WarningToast("Whatsapp or Mobile number not verified !");
    // }

    if (
      (newUser.password && !newUser.confirmPassword) ||
      (!newUser.password && newUser.confirmPassword)
    ) {
      return WarningToast("Please enter both passwords");
    }

    const passwordStrength = checkPasswordStrength(newUser.password);
    if (newUser.password && passwordStrength) {
      return WarningToast(passwordStrength);
    }

    if (newUser.password && !handleConfirmPassword()) {
      return WarningToast("Confirm password does not match.");
    }

    setIsLoading(true);
    // const mobileNumber1CountryCode = newUser.mobileNumber ? `+${getCountryCode(newUser.mobileNumber)}` : "";
    // const whatsappNumberCountryCode = newUser.whatsappNumber ? `+${getCountryCode(newUser.whatsappNumber)}` : "";

    const res = await dispatch(
      saveCandidate({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        password: newUser.password,
        mobileNumber1: getPhoneNumber(newUser.mobileNumber),
        whatsappNumber: getPhoneNumber(newUser.whatsappNumber),
        primaryEmailId: newUser.email,
        // mobileNumber1CountryCode: mobileNumber1CountryCode,
        mobileNumber1CountryCode: getCountryCode(newUser.mobileNumber) ? ("+" + getCountryCode(newUser.mobileNumber)) : "",
        mobileNumber2CountryCode: "",
        // whatsappNumberCountryCode: whatsappNumberCountryCode,
        whatsappNumberCountryCode: getCountryCode(newUser.whatsappNumber) ? ("+" + getCountryCode(newUser.whatsappNumber)) : "",
        whatsappNumberVerified: whastappVerified,
        mobileNumber1Verified: mobileVerified,
        mobileNumber2Verified: false,
      })
    );
    setIsLoading(false);
    if (res.payload?.success || res.success) {
      SuccessToast(
        res.payload?.message || res.message || "User Created Successfully!"
      );
      navigate("/login");
    } else {
      ErrorToast(res.message || "Error creating User!");
    }
  };

  useEffect(() => {
    setAllowSubmit(
      newUser.firstName &&
      newUser.lastName &&
      newUser.email &&
      (newUser.mobileNumber.length >= 4 || newUser.whatsappNumber.length >= 4)
    );
  }, [newUser]);


  return (
    <div className="col xl6 l6 m6 s12 login-wrap">
      {isLoading && <EvuemeLoader />}
      <div className="login-wrap-box">
        <h3 className="carretColor-transparent">Create Your Account</h3>
        <form onSubmit={handleSubmit} className="loginform">
          <NormalInputField
            divTagCssClasses="input-field"
            type="text"
            inputTagIdAndName="firstName"
            placeholder="First Name"
            value={newUser.firstName}
            // onBlur={validateNames}
            onChange={handleOnChangeNewUser}
            leftIconSrc={icon.whatsappIcon}
            labelText="First Name"
            required={true}
          />
          <NormalInputField
            divTagCssClasses="input-field"
            type="text"
            inputTagIdAndName="lastName"
            placeholder="Last Name"
            value={newUser.lastName}
            onChange={handleOnChangeNewUser}
            leftIconSrc={icon.whatsappIcon}
            labelText="Last Name"
            required={true}
          />
          <MobileNumberInputField
            divTagCssClasses="input-field"
            type="number"
            inputTagIdAndName="whatsappNumber"
            placeholder="Whatsapp No"
            value={newUser.whatsappNumber}
            onChange={(e)=>handleOnChangeNewUser({
              target: { name: "whatsappNumber", value: e },
            })}
            onClickVerify=
             { ()=>{
              // handleOnClickVerifyContactNo();
            }}
            
            required={true}
            leftIconSrc={icon.whatsappIcon}
            labelText="Whatsapp No"
            // required={true}
            isVerified={whastappVerified}
            setIsVerified={setWhastappVerified}
            showVerification={true}
            prevNav="/signup"
          />
          <MobileNumberInputField
            divTagCssClasses="input-field"
            type="number"
            inputTagIdAndName="mobileNumber"
            placeholder="Mobile No"
            value={newUser.mobileNumber}
            onChange={(e)=>handleOnChangeNewUser({
              target: { name: "mobileNumber", value: e },
            })}
            onClickVerify={
              ()=>{
                // handleOnClickVerifyContactNo();
              }
            } 
            
            required={true}
            leftIconSrc={icon.mobilePhoneIcon}
            labelText="Mobile No"
            isVerified={mobileVerified}
            setIsVerified={setMobileVerified}
            showVerification={true}
            prevNav="/signup"
          />
          <NormalInputField
            divTagCssClasses="input-field"
            inputTagCssClasses="validate"
            type="email"
            inputTagIdAndName="email"
            placeholder="Email Id"
            value={newUser.email}
            onBlur={(e) => validateEmailInput(e, WarningToast)}  // Pass WarningToast here
            onChange={handleOnChangeNewUser}
            leftIconSrc={icon.emailAddressIcon}
            labelText="Email Id"
            required={true}
          />
          <PasswordInputField
            inputTagIdAndName="password"
            value={newUser.password}
            onChange={handleOnChangeNewUser}
            placeholder="Password"
            leftIconSrc={icon.lockIcon}
            labelText="Password"
          />
          <PasswordInputField
            inputTagIdAndName="confirmPassword"
            placeholder="Confirm Password"
            value={newUser.confirmPassword}
            onChange={handleOnChangeNewUser}
            leftIconSrc={icon.lockIcon}
            labelText="Confirm Password"
          />
          <NormalButton
            buttonTagCssClasses={`btn-large fullwidth-btn ${!allowSubmit ? "disabled-btn" : ""}`}
            buttonText="Sign up"
            disabled={!allowSubmit}
            onClick={handleSubmit}
          />
          {feedbackMessage && (
            <div className="feedback-message">
              <p className="warning">{feedbackMessage}</p>
            </div>
          )}
          <div className="loginfooter">
            <p>
              Already a User? <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
