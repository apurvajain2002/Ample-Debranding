import { useState, useEffect } from "react";
import EvuemeInputTag from "../../components/evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import WarningToast from "../toasts/warning-toast";
import { icon } from "../assets/assets";
import { useGlobalContext } from "../../context";

export const NormalInputField = ({
  divTagCssClasses = "input-field",
  inputTagCssClasses = "",
  type = "text",
  inputTagIdAndName,
  placeholder,
  onResetFile,
  value,
  onChange,
  required = false,
  disabled = false,
  leftIconSrc = null,
  leftIconAltText = "",
  leftIconCss = "",
  onClickLeftIcon = () => { },
  rightIconSrc = null,
  rightIconAltText = "",
  rightIconCss = "",
  onClickRightIcon = () => { },
  labelText,
  labelCss = "",
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  showVerification = false,
  sendVerificationMail = () => { },
  fileAddress = "",
  missing = false,
  readOnly = false,
  ...props
}) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120);

  const { rootColor } = useGlobalContext();

  useEffect(() => {
    let timer;
    if (isTimerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      setTimeRemaining(120);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, timeRemaining]);

  const handleVerificationClick = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return WarningToast("Invalid email!");
    }
    if (isTimerActive) {
      return;
    }
    // sendVerificationMail();
    try {
      // const {data} = await axiosInstance("");
    } catch (error) {

    }
    setIsTimerActive(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={divTagCssClasses}>
      <EvuemeInputTag
        className={`validate ${inputTagCssClasses}`}
        type={type}
        id={inputTagIdAndName}
        name={inputTagIdAndName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        missing={missing}
        readOnly={readOnly}
        {...props}
      />
      {labelText && (
        <EvuemeLabelTag
          htmlFor={inputTagIdAndName}
          className={`active ${labelCss}`}
          labelText={labelText}
          required={required}
          labelIconSrc={labelIconSrc}
          labelIconAltText={labelIconAltText}
          labelIconCss={labelIconCss}
        />
      )}
      {leftIconSrc && (
        <i className="place-icon-left carretColor-transparent">
          <EvuemeImageTag
            imgSrc={leftIconSrc}
            altText={leftIconAltText}
            className={leftIconCss}
            onClick={onClickLeftIcon}
          />
        </i>
      )}
      {rightIconSrc && (
        <i className="place-icon-right carretColor-transparent">
          <EvuemeImageTag
            imgSrc={rightIconSrc}
            altText={rightIconAltText}
            className={rightIconCss}
            onClick={onClickRightIcon}
          />
        </i>
      )}
      {showVerification && type === "email" && (
        <div className="verify">
          <span
            onClick={handleVerificationClick}
            style={{
              cursor: isTimerActive ? "default" : "pointer",
              color: isTimerActive ? "#666" : rootColor.primary,
            }}
            className="text"
          >
            {isTimerActive ? `Resend after ${formatTime(timeRemaining)}` : "Verify Email"}
          </span>
        </div>
      )}
      {fileAddress && (
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", padding:".2rem 0 0 .2rem"}}>
        <a href={URL.createObjectURL(fileAddress)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px' }}>
          {fileAddress.name}
        </a>
        <i className=" carretColor-transparent">
        <EvuemeImageTag
          imgSrc={icon.deleteIcon}
          altText="Reset file"
          className="file-upload-delete-icon"
          onClick={onResetFile}
        />
      </i>
      </div>
      )}
    </div>
  );
};

export default NormalInputField;
