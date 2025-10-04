import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { icon, image } from "../assets/assets";
// import { fetchSelectedCandidateRating } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import NormalButton from "../buttons/normal-button";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";
import styles from '../interview-responses/style.module.css'

const EachRow = ({ question, index, filteredCandidateResponseList }) => {
  const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
  const [isAIQuestionModalOpen, setAIQuestionModalOpen] = useState(false);

  const [playBackSpeed, setplayBackSpeed] = useState({});
  const videoRef = useRef({});

  const handlePlaybackSpeed = (index, speed) => {
    setplayBackSpeed((prev) => ({ ...prev, [index]: speed }));
    const videoElement = videoRef.current[index];
    if (videoElement) {
      videoElement.playbackRate = speed;
    }
  };

  const openAICommentModal = () => {
    setAICommentModalOpen(true);
  };

  const closeAICommentModal = () => {
    setAICommentModalOpen(false);
  };

  const openAIQuestionModal = () => {
    setAIQuestionModalOpen(true);
  };

  const closeAIQuestionModal = () => {
    setAIQuestionModalOpen(false);
  };

  useEffect(() => {
    if (isAICommentModalOpen) {
      const modalElem = document.querySelector(
        `#com_full_screen_comment_${index}`
      );
      if (modalElem) {
        M.Modal.init(modalElem);
        const modalInstance = M.Modal.getInstance(modalElem);
        modalInstance.open();
      }
    }
  }, [isAICommentModalOpen]);

  useEffect(() => {
    if (isAIQuestionModalOpen) {
      const modalElem = document.querySelector(
        `#com_full_screen_question_${index}`
      );
      if (modalElem) {
        M.Modal.init(modalElem);
        const modalInstance = M.Modal.getInstance(modalElem);
        modalInstance.open();
      }
    }
  }, [isAIQuestionModalOpen]);

  useEffect(() => {
    if (filteredCandidateResponseList?.length > 0) {
      const initialSpeeds = {};
      filteredCandidateResponseList.forEach((_, index) => {
        initialSpeeds[index] = 1;
      });
      setplayBackSpeed(initialSpeeds);
    }
  }, [filteredCandidateResponseList]);

  useEffect(() => {
    M.AutoInit();
  }, []);

  return (
    <tr>
      <td>{question.id}</td>
      <td>
        <div
          class="box-main-bg"
          style={{ paddingTop: 0, minHeight: "12.2rem", background: "none" }}
        >
          <aside
            className="input-field textarea-full"
            style={{ marginTop: "15px" }}
          >
            <a
              href={`#com_full_screen_question_${index}`}
              className="comment-fullscreen modal-trigger"
              onClick={openAIQuestionModal}
            >
              <i>
                <img
                  src={icon.commentFullscreenIcon}
                  alt="comment full screen"
                />
              </i>
            </a>
            <textarea
              placeholder={"Comments"}
              id="aicomments"
              value={question.queText}
              className="materialize-textarea aicomments-table two"
              readOnly
              style={{ border: "none" }}
            ></textarea>
          </aside>
          {isAIQuestionModalOpen && (
            <div
              id={`com_full_screen_question_${index}`}
              className="modal open"
            >
              <a
                href="#!"
                className="modal-close waves-effect waves-red btn-flat close-ixon-can-rating"
                onClick={closeAIQuestionModal}
              ></a>
              <div className="modal-content">
                <div
                  className="coment_content"
                  style={{ height: "400px", overflow: "auto" }}
                >
                  {question.queText}
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className="video-section">
          {(question.answerType === "video" || (!question.answerType && question.response && question.response.includes('.mp4'))) && (
            <video
              ref={(el) => (videoRef.current[index] = el)}
              src={question.response || ""}
              style={{ width: "100%" }}
              controls
              disablePictureInPicture
              controlsList="nodownload noplaybackrate"
            />
          )}
          {(question.answerType === "audio" || (!question.answerType && question.response && question.response.includes('.mp3'))) && (
            <div
              style={{
                width: "100%",
                height: "16rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                backgroundColor: "#f1f3f4",
              }}
            >
              <div
                style={{
                  height: "31rem",
                  width: "100%",
                  background: "#3a0531",
                }}
              ></div>
              <audio
                ref={(el) => (videoRef.current[index] = el)}
                id="audioPlayer"
                controls
                src={question.response}
                style={{ width: "100%", height: "100%" }}
                controlsList="nodownload noplaybackrate"
              ></audio>
            </div>
          )}
          <aside className="col xl3 l5 m5 s12">
            <ul className="video-speed">
              {[0.5, 0.75, 1, 1.5, 2].map((speed) => (
                <li key={speed}>
                  <a
                    onClick={() => handlePlaybackSpeed(index, speed)}
                    className={playBackSpeed[index] === speed ? "active" : ""}
                  >
                    {speed}x
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </td>
      <td>
        <div
          class="box-main-bg"
          style={{ paddingTop: 0, minHeight: "12.2rem", background: "none" }}
        >
          <aside
            className="input-field textarea-full"
            style={{ marginTop: "15px" }}
          >
            <a
              href={`#com_full_screen_comment_${index}`}
              className="comment-fullscreen modal-trigger"
              onClick={openAICommentModal}
            >
              <i>
                <img
                  src={icon.commentFullscreenIcon}
                  alt="comment full screen"
                />
              </i>
            </a>
            <textarea
              placeholder={"Comments"}
              id="aicomments"
              value={question?.aiComment ?? "-"}
              className={`materialize-textarea aicomments-table ${styles['scrollable-textarea']}`}
              readOnly
              style={{ border: "none" }}
              rows={3}
              ></textarea>
          </aside>
          {isAICommentModalOpen && (
            <div id={`com_full_screen_comment_${index}`} className="modal open">
              <a
                href="#!"
                className="modal-close waves-effect waves-red btn-flat close-ixon-can-rating"
                onClick={closeAICommentModal}
              ></a>
              <div className="modal-content">
                <div
                  className="coment_content"
                  style={{ height: "400px", overflow: "auto" }}
                >
                  {question?.aiComment ?? "-"}
                </div>
              </div>
            </div>
          )}
        </div>
      </td>
      <td className="lastColumn">
        <div
          className="scoregraph-wr scoregraph-2 scoregraph-summary-page"
          style={{ float: "none", margin: "auto" }}
        >
          <div className="multigraph">
            <span
              className="graph"
              style={{
                "--score": `${((question?.aiScore ?? 0) * 180) / 100}deg`,
              }}
            >
              {question?.aiScore ?? 0}
              {/* {question?.aiScore ? parseFloat(question.aiScore).toFixed(2) : 0} */}
            </span>
          </div>
          <p>{question?.competancy ?? "-"}</p>
        </div>
      </td>
    </tr>
  );
};

const CandidateQuestionDisplay = ({ displayBackButton = true }) => {
  const navigate = useNavigate();

  const { selectedCandidateId, filteredCandidateResponseList, candidateList } =
    useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);
  // const [selectedQuestion, setSelectedQuestion] = useState(-1);
  console.log("filteredCandidateResponseList",filteredCandidateResponseList);
  
  const dispatch = useDispatch();

  const handleBack = () => {
    navigate("/admin/candidate-video-answers");
  };

  // useEffect(() => {
  //   dispatch(fetchSelectedCandidateRating({ selectedCandidateId }));
  // }, [selectedCandidateId]);

  return (
    <div className="box-main-bg mt15">
      <div className="table-bodywr table-responsive">
        <table className="striped responsive-table topalign-table topalign-table-video-page">
          <thead>
            <tr>
              <th style={{ width: "6rem" }}>Ques. No.</th>
              <th>Question Description</th>
              <th>Video Clips</th>
              <th>AI comments</th>
              <th style={{ width: "7rem" }}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidateResponseList?.length > 0 ? (
              filteredCandidateResponseList.map((question, index) => (
                <EachRow
                  question={question}
                  index={index}
                  filteredCandidateResponseList={filteredCandidateResponseList}
                />
              ))
            ) : (
              <tr>
                <td colSpan="5">No questions available</td>
              </tr>
            )}
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                {displayBackButton && (
                  <NormalButton
                    buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit btn-back"
                    onClick={() => handleBack()}
                    buttonText={"Back"}
                  />
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateQuestionDisplay;
