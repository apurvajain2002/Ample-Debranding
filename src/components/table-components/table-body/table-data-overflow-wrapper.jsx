import { useState } from "react";

const TableDataOverflowWrapper = ({ content = "", limit = 30 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const partialContent = String(content).substring(0, limit) + "...";

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return content?.length < limit ? (
    <td>{content}</td>
  ) : (
    <td className="overflow">
      {partialContent}
      <div
        className="moreoutder-wrap"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="more-actionbtn">
          more
          <span
            className="arrow-icon"
            style={{ display: isHovered ? "block" : "none" }}
          ></span>
        </span>
        <span
          className="more-content"
          style={{ display: isHovered ? "block" : "none" }}
        >
          {content}
        </span>
      </div>
    </td>
  );
};

export default TableDataOverflowWrapper;
