import { useEffect, useRef, useState } from "react";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import PhoneInput from "react-phone-number-input";
import EvuemeModalTrigger from "../modals/evueme-modal-trigger";
import EvuemeModal from "../modals/evueme-modal";
import { isValidPhoneNumber } from "react-phone-number-input";
import LoginWithOTP from "../../screens/user-signup-signin/signin/enter-otp";
import WarningToast from "../toasts/warning-toast";
import axiosInstance from "../../interceptors";
import SuccessToast from "../toasts/success-toast";
import ErrorToast from "../toasts/error-toast";
import M from "materialize-css";
import { getCountryCode, getPhoneNumber } from "../../utils/phoneNumberUtils";
import MobileNumberInputField2 from "./mobile-number-input-field2";
import { baseUrl } from "../../config/config";

const otpTimeOut = 1 * 60;

export const MobileNumberInputField = ({
  divTagCssClasses = "",
  inputTagCssClasses = "",
  type = "text",
  inputTagIdAndName = "",
  placeholder = "Enter your number",
  value = "",
  onChange = () => { },
  required = false,
  disabled = false,
  labelText,
  labelCss = "",
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  showVerification = false,
  onClickVerify = () => { },
  isVerified = false,
  setIsVerified = () => { },
  setMobileNumberEnabled = () => { },
  prevNav = "",
  showDropdownBelow = true,
  ...props
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpInitialTime, setOtpInitialTime] = useState(otpTimeOut);
  const [countryCode, setCountryCode] = useState("+91");
  const [showResendOTP, setShowResendOTP] = useState(false);
  const modalRef = useRef(null);

  const handleSendOTP = async (mobileNumber = value) => {
    try {
      // setLoading(true);
      const countryCode = getCountryCode(mobileNumber);
      const nationalNumber = getPhoneNumber(mobileNumber);

      let url, body;

      const isWhatsapp = labelText.toLowerCase().includes("whatsapp");
      if (isWhatsapp) {
        url = `${baseUrl}/common/otp/send-whatsapp-otp`;
        body = { number: nationalNumber };
      } else {
        url = `${baseUrl}/common/otp/generate-otp`;
        body = { phoneCode: `+${countryCode}`, mobileNo: nationalNumber };
      }

      const { data } = await axiosInstance.post(url, body);

      //   if (data.success || data.status || data.response?.status === "success") {
      //     SuccessToast(`OTP sent successfully through SMS on Mobile No. ${mobileNumber}!`);
      //     isWhatsapp ? setOtp(String(data.response.otp)) : setOtp(String(data.otp));
      //   }
      // }
      if (data.success || data.status || data.response?.status === "success") {
        // Success message based on whether it's SMS or WhatsApp
        const successMessage = isWhatsapp
          ? `OTP sent Successfully through WhatsApp on WhatsApp No. ${mobileNumber}!`
          : `OTP sent successfully through SMS on Mobile No. ${mobileNumber}!`;

        SuccessToast(successMessage);

        isWhatsapp
          ? setOtp(String(data.response.otp))
          : setOtp(String(data.otp));
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the OTP!");
    } finally {
      // setLoading(false);
    }
  };

  const oneVerifyOTPClick = () => {
    setShowResendOTP(true);
    if (!value || value === countryCode) {
      return WarningToast(`Please enter valid ${labelText}`);
    }
    if (!isValidPhoneNumber(value)) {
      return WarningToast("Please enter a valid mobile number");
    }
    handleSendOTP();
    setOtpSent(true);
    setOtpInitialTime(otpTimeOut);
  };

  const loginWithOTPCallback = (verified) => {
    setOtpSent(false);
    if (verified) {
      setIsVerified(verified);
    } else {
      WarningToast("Invalid OTP");
    }
  };

  const onModalOutsideClick = () => {
    setOtpSent(false);
  };

  useEffect(() => {
    if (!otpSent) {
      const dom = document.getElementById("loginwithOTP");
      const instance = dom ? M.Modal.getInstance(dom) : null;
      if (instance) {
        instance.close();
      }
    }
  }, [otpSent]);

  useEffect(() => {
    // Only initialize Materialize if the modal element exists
    const modalElement = document.getElementById("loginwithOTP");
    if (modalElement) {
      M.AutoInit();
    }
  }, []);

  return (
    <div className={`input-field ${divTagCssClasses}`}>
      <div style={{ position: "relative" }}>
        <MobileNumberInputField2
          className={`${inputTagCssClasses}test`}
          value={value}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          onChange={(m) => onChange(m)}
          setMobileNumberEnabled={setMobileNumberEnabled}
          showDropdownBelow={showDropdownBelow}
        />
        {/* <PhoneInput
          international
          className={`${inputTagCssClasses}test`}
          defaultCountry="IN"
          value={value}
          onChange={(e) => onChange(e)}
          onCountryChange={(country) => setSelectedCountry(country)}
          placeholder={placeholder}
        /> */}
      </div>
      {labelText && (
        <EvuemeLabelTag
          htmlFor={inputTagIdAndName}
          className={`active ${labelCss}`}
          labelText={labelText}
          required={required}
          labelIconSrc={labelIconSrc}
          labelIconAltText={labelIconAltText}
          labelIconCss={labelIconCss}
          style={{
            backgroundColor: "white",
            padding: "0 5px",
          }}
        />
      )}

      {showVerification && (
        <>
          <div className="verify">
            {!isVerified ? (
              <EvuemeModalTrigger
                modalId="loginwithOTP"
                onClick={() => {
                  onClickVerify();
                  oneVerifyOTPClick();
                }}
                allow={value && value !== countryCode ? true : false}
                ref={modalRef}
              >
                <span className="text">
                  Send OTP
                  {/* {showResendOTP ? "Send OTP" : "Verify through OTP"} */}
                </span>
              </EvuemeModalTrigger>
            ) : (
              <span className="status">{"Verified"}</span>
            )}
          </div>

          {otpSent && (
            <EvuemeModal
              modalId="loginwithOTP"
              onClose={onModalOutsideClick}
              openModal={otpSent}
              modalClasses={`${otpSent ? "display-block" : ""}`}
            >
              <LoginWithOTP
                mobileNumber={value}
                prevNav={prevNav}
                isModal={true}
                otpSent={otpSent}
                setOtpSent={setOtpSent}
                callBackFn={loginWithOTPCallback}
                actualOTP={otp}
                otpInitialTime={otpInitialTime}
              />
            </EvuemeModal>
          )}
        </>
      )}
    </div>
  );
};

export default MobileNumberInputField;
