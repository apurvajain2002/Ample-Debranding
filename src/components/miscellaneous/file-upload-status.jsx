import React from "react";
import { icon } from "../assets/assets";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const StatusFileBox = ({ status, count, iconText, onClick }) => {
  const iconSrc = status ? icon.checkMarkicon : icon.crossIcon;

  return (
    <div
      className="statusfilebox"
      onClick={onClick}
      style={{ cursor: status ? "auto" : "pointer" }}
    >
      <div
        className={`chek-mark ${status ? "" : "nocheck-mark"}`}
        style={{ background: !status ? "#f00" : "", border: "2px solid #fff" }}
      >
        <i>
          <EvuemeImageTag
            imgSrc={iconSrc}
            className={"whiteColorFilter"}
            alt=""
          />
        </i>
      </div>
      <p>{count}</p>
      <p>{iconText}</p>
    </div>
  );
};

const FileUploadStatus = ({ data }) => {
  return (
    <div className="fileuploadstatuswr">
      <div className="filestatus-bor"></div>
      <div className="row">
        {data.map((item, index) => (
          <StatusFileBox
            key={index}
            status={item.status}
            count={item.count}
            iconText={item.iconText}
            onClick={item.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default FileUploadStatus;
