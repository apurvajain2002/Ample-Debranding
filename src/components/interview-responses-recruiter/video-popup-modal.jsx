import React from "react";
import EvuemeModal from "../modals/evueme-modal";
import { audio, icon } from "../assets/assets";
import useAudioRecorder from "../../customHooks/use-audio-recorder";
import { useEffect } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useState, useRef } from "react";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";

const VideoPopupModal = React.memo(({ videoUrl,videoPopupClose,videoTranscriptPopupToggle }) => {
  const videoRef = useRef(null);
  const [playBackSpeed, setplayBackSpeed] = useState(1);

  const handlePlaybackSpeed = (speed) => {
    setplayBackSpeed(speed);
    videoRef.current.playbackRate = speed;
  };

  return (
    <div className="custom-tooltip-content video-popup-wrapper-class">
        <div style={{height:"10%"}}>
          <button
            className="modal-close waves-effect waves-red btn-flat close-ixon"
            onClick={videoPopupClose}
          />
        </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "90%",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          style={{ width: "100%" }}
          controls
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
        />
        <div 
        className="videoPopupButtonWrapper"
        >
        
        <ul class="video-speed">
          <li>
            <a
              onClick={() => {
                handlePlaybackSpeed(0.5);
              }}
              className={playBackSpeed === 0.5 ? "active" : ""}
            >
              0.5X
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                handlePlaybackSpeed(0.75);
              }}
              className={playBackSpeed === 0.75 ? "active" : ""}
            >
              0.75{" "}
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                handlePlaybackSpeed(1);
              }}
              className={playBackSpeed === 1 ? "active" : ""}
            >
              1x
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                handlePlaybackSpeed(1.5);
              }}
              className={playBackSpeed === 1.5 ? "active" : ""}
            >
              1.5X
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                handlePlaybackSpeed(2);
              }}
              className={playBackSpeed === 2 ? "active" : ""}
            >
              2X
            </a>
          </li>
        </ul>
        <EvuemeImageTag
                className={'transcriptButton'}
            imgSrc={icon.commentblogIconsvg}
            altText={"Transcript"}
            onClick={videoTranscriptPopupToggle}
          />
        </div>
        
      </div>
    </div>
  );
});

export default VideoPopupModal;
