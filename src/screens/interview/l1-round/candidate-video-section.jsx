import { useEffect, useRef } from "react";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import interviewerView from "../../../resources/images/interview-rounds/images/interviewer-view.svg";
import splitViewSVG from "../../../resources/images/interview-rounds/images/split-view.svg";
import candidateViewSVG from "../../../resources/images/interview-rounds/images/candidate-view.svg";
import { VIEWS } from ".";
import aviListening from "../../../resources/videos/aviListening.mp4";

const CandidateVideoSection = ({
  view,
  setView,
  enxResult,
  videoSource,
  handleStopRecording,
  showRecordingBlink,
}) => {
  const candidateVideoRef = useRef(null);

  // if room connects successfully
  useEffect(() => {
    if (enxResult) {
      //play local view
      const videoElement = candidateVideoRef.current;
      if (!videoElement || !videoSource) return;
      videoElement.srcObject = videoSource;
    }
  }, [enxResult]);

  useEffect(() => {
    const tooltippedElems = document.querySelectorAll(".tooltipped");
    if (window.M) {
      window.M.Tooltip.init(tooltippedElems);
    }
  }, []);

  useEffect(() => {
    // Stop on unmount
    return () => {
      handleStopRecording();
    };
  }, []);

  return (
    <>
      <div className="candidatewr-video">
        <div
          className={
            view === VIEWS.SPLIT
              ? "camera-cand-split-view"
              : "camera-cand-full-view"
          }
        >
            <video
              ref={candidateVideoRef}
              autoPlay
              muted
              style={view !== VIEWS.CANDIDATE ? {
                width: "100%",
                objectFit: "cover",
                height: "100%",
                zIndex: "initial"
              } : {
                width: "100%",
                objectFit: "cover",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: -1
              }}
              playsInline
            />
          {view === VIEWS.CANDIDATE ? (
            <video
              autoPlay
              muted
              style={{
                width: "100%",
                objectFit: "cover",
                height: "100%",
              }}
              src={aviListening}
              playsInline
              loop
            />
          ) : null}
          <div
            className="intview-wr"
            style={{ position: "absolute", top: "15px" }}
          >
            <a
              className="tooltipped"
              data-position="left"
              data-tooltip="Interviewer view"
              onClick={() => {
                setView(VIEWS.INTER);
              }}
            >
              <EvuemeImageTag imgSrc={interviewerView} />
            </a>
            <a
              className="tooltipped"
              data-position="left"
              data-tooltip="Spilt View"
              onClick={() => setView(VIEWS.SPLIT)}
            >
              <EvuemeImageTag imgSrc={splitViewSVG} />
            </a>
            <a
              className="tooltipped"
              data-position="left"
              data-tooltip="Candidate view"
              onClick={() => {
                setView(VIEWS.CANDIDATE);
              }}
            >
              <EvuemeImageTag imgSrc={candidateViewSVG} />
            </a>
          </div>
        </div>
      </div>
      {showRecordingBlink && (
        <div className={"recImgDiv"}>
          <ul className="rec-image">
            <li>
              <div className="rec-round pulse"></div>
            </li>
            <li>REC</li>
          </ul>
          <br />
        </div>
      )}
    </>
  );
};

export default CandidateVideoSection;
