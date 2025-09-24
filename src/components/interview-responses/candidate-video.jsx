import { useEffect, useRef, useState } from "react";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import CandidateProfile from "./candidate-profile";
import { icon, image } from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import TranscriptionPopupModal from "./transcription-popup-modal";
import { setSelectedCandidateId } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import {
  fetchCandidateResponseList,
  fetchSelectedCandidateInfo,
} from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { useNavigate } from "react-router-dom";

const CandidateVideo = ({ setSelectedQuestionData }) => {
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const [showQuestion, setShowQuestion] = useState(true);
  const [showTranscription, setShowTranscription] = useState(false);
  const [showTranscriptionPopup, setShowTranscriptionPopup] = useState(false);
  const dispatch = useDispatch();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const video = document.getElementById("candidate-video-tag");
  const {
    candidateList,
    isViewByApplicant,
    selectedJobId,
    selectedRoundId,
    filteredCandidateResponseList,
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);
  const [playBackSpeed, setplayBackSpeed] = useState(1);
  const transcriptionModalRef = useRef(null); // ref to the modal
  const videoRef = useRef(null);
  const handleSelectApplicant = (id) => {
    dispatch(setSelectedCandidateId(id));
    dispatch(
      fetchCandidateResponseList({ selectedJobId, selectedRoundId, id })
    );
    dispatch(fetchSelectedCandidateInfo({ id }));
  };

  const handleClickFinish = () => {
    navigate("/admin/candidate-video-answer-summary",{
      state: { selectedQuestionData },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (transcriptionModalRef.current && !transcriptionModalRef.current.contains(event.target)) {
        setShowTranscriptionPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePlaybackSpeed = (speed) => {
    setplayBackSpeed(speed);
    videoRef.current.playbackRate = speed;
  };

  const handleShowTranscription = () => {
    if (filteredCandidateResponseList[selectedQuestion]?.['transcription'])
      setShowTranscriptionPopup(true);
    else
      setShowTranscriptionPopup(false);
  };

  const handleCloseTranscription = () => {
    setShowTranscriptionPopup(false);
  };
  

  useEffect(() => {
    const updatedCount = filteredCandidateResponseList?.length ?? 0;
    if (updatedCount > 0) setSelectedQuestion(0);
    else setSelectedQuestion(-1);
    setTotalQuestions(() => updatedCount);
  }, [filteredCandidateResponseList]);


  useEffect(() => {
    if (selectedQuestion >= 0) {
      const selectedData = filteredCandidateResponseList[selectedQuestion];
      // Update the parent component with the selected question data
      setSelectedQuestionData(selectedData);
    }
  }, [selectedQuestion, filteredCandidateResponseList, setSelectedQuestionData]);
  // const selectedQuestionData =
  //   filteredCandidateResponseList[selectedQuestion] || {};  
  const selectedQuestionData =
    filteredCandidateResponseList[selectedQuestion] || {};


  return (
    <div className="box-main-bg minheightbox">
      <div className="video-section">
        <div className="video-informationwr">
          <a
            href="#"
            className="tooltipped showhide-question"
            data-position="top"
            data-tooltip={`${showQuestion ? 'Hide' : 'Show'} Question`}
            onClick={(e) => {
              e.preventDefault();
              setShowQuestion((prev) => !prev)
            }}
          >
            <i>
              <EvuemeImageTag
                imgSrc={icon.questionHideView}
                altText={"Hide/Show questions"}
              />
            </i>
          </a>
          {/* <div
            className="showhide-question"
            onClick={() => setShowQuestion((prev) => !prev)}
          >
            <i>
              <EvuemeImageTag
                imgSrc={icon.questionHideView}
                altText={"Hide/Show questions"}
              />
            </i>
          </div> */}
          {showQuestion ? (
            <div className="video-question">
              <h4>
                Question:{" "}
                {filteredCandidateResponseList[selectedQuestion]?.["id"] ?? 0}
                {/* Question: {(selectedQuestion+1)??0} */}
                {/* <span>/{totalQuestions}</span> */}
              </h4>
              {/* <p className="bigp">{candidateResponseList[selectedQuestion]?.['createdOn'] ?? ''}</p> */}
              <p className="bigp">
                {filteredCandidateResponseList[selectedQuestion]?.["queText"] ??
                  ""}
              </p>
              {/* <p className="bigp">
								Describe your journey so far, from a personal and academic viewpoint. What do you consider as your biggest achievement so far?
							</p> */}
              {/* <p>
								<span>Probing Questions - 1: </span>
								Good, can you share with me, an example of a specific Java application, that you had developed, which faced a security breach?
							</p>
							<p>
								<span>Probing Questions - 2: </span>
								Hmm, can you tell me, which specific tools or techniques did you utilize during the investigation process?
							</p> */}
            </div>
          ) : null}
        </div>
        <video
          // src={candidateResponseList[selectedQuestion]?.amazonS3Link ?? ''}
          ref={videoRef}
          src={
            filteredCandidateResponseList[selectedQuestion]?.["response"] ?? ""
          }
          style={{ width: "100%" }}
          controls
          disablePictureInPicture
          controlsList="nodownload noplaybackrate"
        />
      </div>
      <div className="quest-bottom-wr">
        <div className="row">
          <aside className="col xl5 l7 m7 s12">
            <p className="inlineblock">Question No.</p>
            <ul className="paginationul">
              {filteredCandidateResponseList.map((qNum, index) => (
                <li
                  key={index}
                  className={index === selectedQuestion ? "active" : ""}
                  onClick={() => setSelectedQuestion(index)}
                  style={{ cursor: "pointer", width: "auto" }}
                >
                  <a>{qNum.id}</a>
                </li>
              ))}
            </ul>
            <div className="arrow-nexprv">
              <a
                className="prv-btn"
                onClick={() => {
                  setSelectedQuestion((prev) =>
                    1 < prev + 1 ? prev - 1 : prev
                  );
                }}
              >
                <EvuemeImageTag imgSrc={icon.previous} />
              </a>
              <a
                className="nxt-btn"
                onClick={() => {
                  setSelectedQuestion((prev) =>
                    totalQuestions > prev + 1 ? prev + 1 : prev
                  );
                }}
              >
                <EvuemeImageTag imgSrc={icon.next} />
              </a>
            </div>
          </aside>
          <aside className="col xl3 l5 m5 s12" style={{ display: "contents" }}>
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
          </aside>
          <aside
            className="col xl4 l5 m5 s12"
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "3px",
              justifyContent: "end",
            }}
          >
            <div style={{ position: "relative" }}>
              <button
                className="btn btn-porpel waves-effect waves-light right"
                style={{ lineHeight: 1 }}
                onClick={handleShowTranscription}

              >
                Show Transcription
              </button>
              {showTranscriptionPopup && (
                <TranscriptionPopupModal
                  transcription={filteredCandidateResponseList[selectedQuestion]?.['transcription'] ?? ''}
                  onClose={handleCloseTranscription}
                  ref={transcriptionModalRef}
                />
              )}
            </div>
            <button
              className="btn btn-porpel waves-effect waves-light right"
              onClick={handleClickFinish}
            >
              Finish
            </button>
          </aside>
        </div>

        {!isViewByApplicant && (
          <div className="row" style={{ paddingTop: "5px" }}>
            <aside
              class="col xl7 l7 m7 s7"
              style={{ display: "flex", flexDirection: "row", width: "80%" }}
            >
              <a href="#" class="cand-prv" style={{ height: "112px" }}>
                <img src={icon.prevIcon} alt="" />
              </a>
              <ul class="cand-ul list-candidate">
                {candidateList.slice(0, 5).map((candidate, index) => (
                  <li
                    key={candidate.id}
                    onClick={() => handleSelectApplicant(candidate.id)}
                    style={{
                      margin: "0px 5px 0px 5px",
                      width: "80px",
                    }}
                  >
                    <CandidateProfile
                      name={candidate.firstName + " " + candidate.lastName}
                      imgSrc={image.userProfileImage}
                      // name={candidate.name}
                      // imgSrc={candidate.img}
                      score={candidate.score}
                      status={candidate.status}
                    // name={"Rishi Singh"}
                    // imgSrc={''}
                    // score={120}
                    // status={"Offered"}
                    // score={23}
                    />
                  </li>
                ))}
              </ul>
              <a
                href="#"
                class="cand-prv cand-next"
                style={{ height: "112px" }}
              >
                <img src={icon.nextIcon} alt="" />
              </a>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateVideo;
