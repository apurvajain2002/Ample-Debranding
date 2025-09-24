import React from "react";
import EvuemeModal from "../modals/evueme-modal";
import { audio, icon } from "../assets/assets";
import useAudioRecorder from "../../customHooks/use-audio-recorder";
import { useEffect } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useState, useRef } from "react";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import { useGlobalContext } from "../../context";

const AudioPopupModal = React.memo(({ audioFile,audioPopupClose,audioTranscriptPopupToggle, audioBlob }) => {
  const audioRef = useRef(null);
  const [playBackSpeed, setplayBackSpeed] = useState(1);

  const handlePlaybackSpeed = (speed) => {
    setplayBackSpeed(speed);
    audioRef.current.playbackRate = speed;
  };

  const { rootColor } = useGlobalContext();

  return (
    <div className="custom-tooltip-content audio-popup-wrapper-class">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <div style={{height:"10%"}}>
          <button
            className="modal-close waves-effect waves-red btn-flat close-ixon"
            onClick={audioPopupClose}
          />
        </div>
        
        <div
          style={{
            backgroundColor: "#ffffff",
            height: "90%",
          }}
        >
          <div style={{ height: "100%" }}>
            <div
              style={{
                backgroundColor: "#3a0531",
                height: "45%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "5px",
                }}
              ></div>
            </div>
            <div style={{ backgroundColor: "#f3f2ee", height: "55%" }}>
              <div
                style={{
                  height: "45%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#3a0531",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "100%", height: "100%" }}>
                  {audioFile && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <audio
                        ref={audioRef}
                        id="audioPlayer"
                        controls
                        src={audioFile}
                        style={{ width: "100%", height: "100%" }}
                      ></audio>
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  height: "55%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
                <aside
                  className="col xl3 l5 m5 s12"
                  style={{ display: "contents" }}
                >
                  <ul
                    class="video-speed"
                    style={{ border: `1px solid ${rootColor.primary}` }}
                  >
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
                </aside>
                <EvuemeImageTag
                className={'transcriptButton'}
            imgSrc={icon.commentblogIconsvg}
            altText={"Transcript"}
            onClick={audioTranscriptPopupToggle}
          />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AudioPopupModal;
