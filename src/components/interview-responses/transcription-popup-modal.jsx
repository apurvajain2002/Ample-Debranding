import React, { useState, useRef, forwardRef } from "react";
import EvuemeModal from "../modals/evueme-modal"; // If you have a generic modal component
import { icon } from "../assets/assets";

const TranscriptionPopupModal = forwardRef(
  ({ transcription, onClose }, ref) => {
    return (
      <div
        ref={ref}
        className="custom-tooltip-content transcription-popup-wrapper-class"
        style={{
          width: "23rem",
          //   height: "13rem",
          //   overflow: "auto",
          top: "50px",
          left: "-60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: "1rem",
            //   alignItems: "center",
            backgroundColor: "white",
          }}
        >
          <div
            className="transcription-header"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h4>Transcription</h4>
            {/* <button onClick={onClose} className="close-btn" style={{}}>
                    {/* <img src={icon.closeLineIcon} /> 
                    <img src={icon.closeLineIcon} alt="close"  style={{textAlign: "end"}}/> 
                     </button> */}
            <a
              href="#!"
              className="modal-close waves-effect waves-red btn-flat close-ixon"
              onClick={onClose}
            ></a>
          </div>

          <div
            className="transcription-body"
            style={{ height: "13rem", overflow: "auto" }}
          >
            <p style={{ textWrap: "wrap" }}>{transcription}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default TranscriptionPopupModal;
