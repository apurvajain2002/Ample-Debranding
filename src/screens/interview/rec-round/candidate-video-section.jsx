import { useEffect, useRef } from "react";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import interviewerView from "../../../resources/images/interview-rounds/images/interviewer-view.svg";
import splitViewSVG from "../../../resources/images/interview-rounds/images/split-view.svg";
import candidateViewSVG from "../../../resources/images/interview-rounds/images/candidate-view.svg";

const CandidateVideoSection = ({
  forceCamera,
  localCameraRef,
  splitView,
  setSplitView,
  enxResult,
  videoSource,
  showViewOptions = true,
  showRecordingBlink = true,
  handleStopRecording
}) => {
  const candidateVideoRef = useRef(null);

  const handleSplitView = async () => {
    setSplitView((prev) => !prev);
  };

  // if room connects successfully
  useEffect(() => {
    if (enxResult) {
      //play local view
      const videoElement = candidateVideoRef.current ?? localCameraRef.current;
      if (!videoElement || !videoSource || !enxResult) return;
      videoElement.srcObject = videoSource;
    }
  }, [enxResult]);

  useEffect(() => {
    const tooltippedElems = document.querySelectorAll(".tooltipped");
    if (window.M) {
      window.M.Tooltip.init(tooltippedElems);
    }

    return () => handleStopRecording()
  }, []);

  return (
    <>
      <div className="candidatewr-video">
        <div
          className={
            splitView ? "camera-cand-split-view" : "camera-cand-full-view"
          }
        >
          <video
            ref={forceCamera ? localCameraRef : candidateVideoRef}
            autoPlay
            muted
            style={{
              width: splitView ? "100%" : "100%",
              objectFit: "cover",
              height: "100%",
            }}
            playsInline
          />
          <div
            className="intview-wr"
            style={{ position: "absolute", top: "15px" }}
          >
            {showViewOptions && (
              <>
                <a
                  className="tooltipped"
                  data-position="left"
                  data-tooltip="Interviewer view"
                  onClick={() => {
                    setSplitView(false);
                  }}
                >
                  <EvuemeImageTag imgSrc={interviewerView} />
                </a>
                <a
                  className="tooltipped"
                  data-position="left"
                  data-tooltip="Spilt View"
                  onClick={handleSplitView}
                >
                  <EvuemeImageTag imgSrc={splitViewSVG} />
                </a>
                <a
                  className="tooltipped"
                  data-position="left"
                  data-tooltip="Candidate view"
                  onClick={() => {
                    setSplitView(false);
                  }}
                >
                  <EvuemeImageTag imgSrc={candidateViewSVG} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {showRecordingBlink && (localCameraRef.current?.srcObject || candidateVideoRef.current?.srcObject) && (
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
