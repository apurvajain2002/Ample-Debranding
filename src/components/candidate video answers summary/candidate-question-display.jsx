import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCandidateId } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import {
  fetchCandidateResponseList,
  fetchSelectedCandidateInfo,
} from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { fetchSelectedCandidateRating } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import NormalButton from "../buttons/normal-button";
import { useNavigate } from "react-router-dom";

const CandidateQuestionDisplay = () => {
  const navigate = useNavigate();
  const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
  const { selectedCandidateId, selectedCandidateRating } = useSelector(
    (state) => state.interviewResponsesL1DashboardSliceReducer
  );
  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const [showQuestion, setShowQuestion] = useState(true);
  const dispatch = useDispatch();
  const [totalQuestions, setTotalQuestions] = useState(0);

  const {
    candidateList,
    isViewByApplicant,
    selectedJobId,
    selectedRoundId,
    filteredCandidateResponseList,
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);

  // const handleSelectApplicant = (id) => {
  //   dispatch(setSelectedCandidateId(id));
  //   dispatch(
  //     fetchCandidateResponseList({ selectedJobId, selectedRoundId, id })
  //   );
  //   dispatch(fetchSelectedCandidateInfo({ id }));
  // };

  const handleBack = () => {
    navigate("/admin/candidate-video-answers");
  };

  useEffect(() => {
    const updatedCount = filteredCandidateResponseList?.length ?? 0;
    if (updatedCount > 0) setSelectedQuestion(0);
    else setSelectedQuestion(-1);
    setTotalQuestions(() => updatedCount);
  }, [filteredCandidateResponseList]);

  useEffect(() => {
    console.log("inside candidate-rating ");
    dispatch(fetchSelectedCandidateRating({ selectedCandidateId }));
  }, [selectedCandidateId]);

  console.log("selectedCandidateRating ===>> ", selectedCandidateRating);

  return (
    <div className="box-main-bg mt15">
      <div className="table-bodywr table-responsive">
        <table className="striped responsive-table topalign-table">
          <thead>
            <tr>
              <th style={{ width: "120px" }}>Ques. No.</th>
              <th>Question Description</th>
              <th>Video Clips</th>
              <th>AI comments</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidateResponseList?.length > 0 ? (
              filteredCandidateResponseList.map((question, index) => (
                <tr>
                  <td>{question.id}</td>
                  <td>{question.queText}</td>
                  <td>
                    <div className="video-section">
                      <video
                        src={question.response}
                        style={{ width: "100%" }}
                        controls
                      />
                    </div>
                  </td>
                  <td>
                    {/* <p className="comments-p-summary">
                  The candidate displayed a good understanding of using
                  scikit-learn to display the confusion matrix. The response was
                  clear and indicated practical experience in working with
                  classNameification models and evaluating their performance
                  using confusion matrices.
                </p> */}
                    <p>{selectedCandidateRating?.aiComment ?? ""}</p>
                  </td>
                  <td style={{ width: "200px" }}>
                    <div className="scoregraph-wr scoregraph-2">
                      <div className="multigraph">
                        <span className="graph" style={{
                            "--score": `${
                              (
                                // (selectedCandidateRating?.aiScore ?? 0)
                                43 * 180) /
                              100
                            }deg`,
                          }}>43</span>
                      </div>
                      <p>Pause/15 Sec</p>
                    </div>
                    {/* <div className="scoregraph-wr scoregraph-2">
                  <div className="multigraph">
                    <span className="graph">53.8</span>
                  </div>
                  <p>Audio <br />Score</p>
                </div> */}
                    {/* <div className="scoregraph-wr scoregraph-cus">
                  <div className="multigraph">
                  <span className="graph">53.8</span>
                  {/* <span className="scorepoint"></span> 
                  </div>
                  <p>Audio <br />Score</p>
                </div> */}
                    <div className="scoregraph-wr scoregraph-2">
                      <div className="multigraph">
                        <span
                          className="graph "
                          style={{
                            "--score": `${
                              ((selectedCandidateRating?.aiScore ?? 0) * 180) /
                              100
                            }deg`,
                          }}
                        >
                          {selectedCandidateRating?.aiScore ?? 0}
                        </span>
                        <span
                          className="circle"
                          style={{
                            "--scoree": `${
                              ((selectedCandidateRating?.aiScore ?? 0) * 158) /
                                100 -
                              3
                            }deg`,
                          }}
                        >
                          {/* <span className="ball"></span> */}
                        </span> 
                      </div>
                      <p>
                        Audio <br />
                        Score
                      </p>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No questions available</td>
              </tr>
            )}
            <tr>
            <td colSpan="5" style={{textAlign:"center"}}>
              <NormalButton
                buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit btn-back"
                onClick={() => handleBack()}
                buttonText={"BACK"}
              />
            </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateQuestionDisplay;
