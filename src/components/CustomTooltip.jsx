import { useState } from "react";

const CustomTooltip = ({ children, content, position = "top"}) => {
  const [visible, setVisible] = useState(false);

  const tooltipClasses = `custom-tooltip-content custom-tooltip-${position}`;

  return (
    <div
      className="custom-tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={tooltipClasses}>
          {content}
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
