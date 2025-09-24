import { useState } from "react";
import EvuemeInputTag from "../../components/evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import { icon } from "../assets/assets";
import Tooltip from "../miscellaneous/tooltip";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const PasswordInputField = ({
  divTagCssClasses = "",
  inputTagCssClasses = "",
  inputTagIdAndName,
  placeholder = "*************",
  value,
  onChange,
  required = false,
  disabled = false,
  leftIconSrc = null,
  leftIconAltText = "",
  leftIconCss = "",
  rightIconSrc = null,
  rightIconAltText = "",
  rightIconCss = "",
  labelText,
  labelCss = "",
  labelIconSrc = null,
  labelIconAltText = "",
  labelIconCss = "",
  missing = false,
  ...props
}) => {
  const [passwordType, setPasswordType] = useState("password");

  // Show and hide password
  const togglePasswordType = () => {
    if (passwordType === "password") setPasswordType(() => "text");
    else setPasswordType(() => "password");
  };

  return (
    <div
      className={`input-field password-box pass-relative1 ${divTagCssClasses}`}
    >
      <EvuemeInputTag
        className={`validate password ${inputTagCssClasses}`}
        type={passwordType}
        id={inputTagIdAndName}
        name={inputTagIdAndName}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        missing={missing}
        {...props}
      />
      {icon.eyeIcon && (
        <i className="view-password" onClick={togglePasswordType}>
          <EvuemeImageTag
            imgSrc={icon.eyeIcon}
            alt="Show hide password toggle button."
          />
        </i>
      )}
      <EvuemeLabelTag
        htmlFor={inputTagIdAndName}
        labelText={labelText}
        className={`active ${labelCss}`}
        required={required}
        labelIconSrc={labelIconSrc}
        labelIconAltText={labelIconAltText}
        labelIconCss={labelIconCss}
      />
      {leftIconSrc && (
        <i className={"place-icon-left carretColor-transparent"}>
          <EvuemeImageTag
            src={leftIconSrc}
            alt={leftIconAltText}
            className={leftIconCss}
          />
        </i>
      )}
      <Tooltip>
        <h3>Password must</h3>
        <p>
          Have at least 8 characters Have at least 1 letter (a,b,c...) Include
          both uppercase and lowercase characters
        </p>
        <h3>Password must not</h3>
        <p>
          Contain 4 consecutive characters (e.g. “11111”, “12345” , or “qwert”)
        </p>
      </Tooltip>
    </div>
  );
};

export default PasswordInputField;
