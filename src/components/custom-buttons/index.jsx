import React from "react";

const CustomButton = ({
  label,
  icon,
  iconPosition = "left",
  buttonClass = "",
  iconClass = "",
  onClick,
}) => {
  return (
    <button
      className={`btn waves-effect waves-light btn-success btn-textleft ${buttonClass}`}
      onClick={onClick}
    >
      {icon && iconPosition === "left" && (
        <i className={iconClass}>
          <img src={icon} alt="icon" />
        </i>
      )}
      {label}
      {icon && iconPosition === "right" && (
        <i className={iconClass}>
          <img src={icon} alt="icon" />
        </i>
      )}
    </button>
  );
};

export default CustomButton;