import React from "react";
import EvuemeModal from "../modals/evueme-modal";
import { audio, icon } from "../assets/assets";
import useAudioRecorder from "../../customHooks/use-audio-recorder";
import { useEffect } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useState, useRef } from "react";

const TablePopupModal = React.memo(
  ({ queType, headData, rowData, onClose }) => {
    return (
      <div className="table-popup">
        <div className="table-popup-header">
          <div>{queType} Scores</div>
          <a
            href="#!"
            className="modal-close waves-effect waves-red btn-flat close-button-table-popup"
            onClick={(e) => onClose(e)}
          ></a>
        </div>
        <table>
          <tr>
            {headData?.map((data) => (
              <th>{data}</th>
            ))}
          </tr>
          <tr>
            {rowData?.map((data) => (
              <td>{data}</td>
            ))}
          </tr>
        </table>
      </div>
    );
  }
);

export default TablePopupModal;
