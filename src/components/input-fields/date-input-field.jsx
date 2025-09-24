import { useEffect } from "react";
import EvuemeInputTag from "../../components/evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../../components/evueme-html-tags/evueme-label-tag";
import M from "materialize-css";

const DateInputField = ({
  divTagCssClasses = "",
  inputTagCssClasses = "validate datepicker date-ico",
  inputTagIdAndName,
  placeholder = "Select Date: dd/mm/yy",
  value,
  onChange,
  disabled = false,
  required = false,
  labelText,
  labelCss,
  missing = false,
  ...props
}) => {
  return (
    <div className={`input-field ${divTagCssClasses}`}>
      <EvuemeInputTag
        className={inputTagCssClasses}
        type={"text"}
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
      <EvuemeLabelTag
        className={`active ${labelCss}`}
        htmlFor={inputTagIdAndName}
        labelText={labelText}
        required={required}
      />
    </div>
  );
};

export default DateInputField;
