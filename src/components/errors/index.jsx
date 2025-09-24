import React from "react";

import DataSyncErrorImage from "../../resources/images/error-img/Data-Sync-Error.svg";
import fileUploadErrorImage from "../../resources/images/error-img/file-upload-error.svg";
import LoginFailureImage from "../../resources/images/error-img/login-faliur.svg";
import PageNotFoundImage from "../../resources/images/error-img/404-notfound.svg";
import PermissionDeniedImage from "../../resources/images/error-img/permission-denied.svg";
import SystemOutTimeImage from "../../resources/images/error-img/system-time-out.svg";
import UnexpectedErrorImage from "../../resources/images/error-img/Unexpected-Error.svg";

const popupMap = {
  datasync: {
    title: "DATA SYNC ERROR",
    text: `We're experiencing a hiccup in syncing your data, like a misaligned gear, 
            <br />
            Lets realign - for assistance, dial <a href="#">9341 555 666</a>`,
    buttonText: "Try Again",
    imgSrc: DataSyncErrorImage,
  },
  fileupload: {
    title: "FILE UPLOAD ERROR",
    text: `Your file seems to be playing hide and seek.Let's ensure its ready
            for the spotlight,
            <br />
            or get in touch at <a href="#">care@evueme.com.</a> for a helping
            hand.`,
    buttonText: "Try Again",
    imgSrc: fileUploadErrorImage,
  },
  loginfailure: {
    title: "LOGIN FAILURE",
    text: `Oops! Seems like we hit a small bump. Let's smoothly steer back on
            track.
            <br />
            Need a co-pilot? Reach out to us at <a href="#">care@evueme.com.</a>`,
    buttonText: "Try Again",
    imgSrc: LoginFailureImage,
  },
  pagenotfound: {
    title: "PAGE NOT FOUND",
    text: `This page seems to be have flown to the nest! Let's navigate you
            back safely,
            <br />
            or our eagle-eyed support at <a href="#">9341 555 666</a>`,
    buttonText: "Contact Us",
    imgSrc: PageNotFoundImage,
  },
  permissiondenied: {
    title: "PERMISSION DENIED",
    text: `It looks like you've veered off the path. If you need access, our team
            <br />
            at <a href="#">care@evueme.com</a> is ready to guide you back.`,
    buttonText: "Contact Us",
    imgSrc: PermissionDeniedImage,
  },
  systemtimeout: {
    title: "SYSTEM TIMEOUT",
    text: `Out servers are just catching a quick breathe. Refresh or if feels
            longer
            <br />
            than waiting for your hair to dry, call us at
            <a href="#">9341 555 666</a>`,
    buttonText: "Try Again",
    imgSrc: SystemOutTimeImage,
  },
  unexpectederror: {
    title: "UNEXPECTED ERROR",
    text: `This page seems to be have flown to the nest! Let's navigate you
            back safely,
            <br />
            or our eagle-eyed support at <a href="#">9341 555 666</a>`,
    buttonText: "Contact Us",
    imgSrc: UnexpectedErrorImage,
  },
};

const Popup = ({ type = "unexpectederror", style = {} }) => {
  const popupData = popupMap[type.toLowerCase()] || {};
  return (
    <div className="centered" style={style}>
      <aside className="col xl6 l6 m6 s12">
        <div className="errorme-wr">
          <div className="error-img">
            <img src={popupData.imgSrc} alt={popupData.title} />
          </div>
          <h3>{popupData.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: popupData.text }}></p>
          <button className="btn waves-effect waves-light btn-success btn-defult">
            {popupData.buttonText}
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Popup;
