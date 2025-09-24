import { useState, useEffect } from "react";
import { icon } from "../assets/assets";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import M from "materialize-css";
// import { fetchSelectedCandidateRating } from "../../redux/actions/interview-responses-l1-dashboard-actions";

const CandidateLHiringRoundScore = () => {
  const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [domainScores, setDomainScores] = useState(null);
  const {
    selectedCandidateId,
    selectedJobId,
    selectedRoundId,
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);

  useEffect(() => {
    if (selectedJobId && selectedRoundId) {
      const elems = document.querySelectorAll(".modal");
      M.Modal.init(elems);
      fetchDomainScores(selectedJobId, selectedRoundId);
    } else {
      console.log("Job ID or Round ID not available yet.");
    }
  }, [selectedJobId, selectedRoundId]);

  const fetchDomainScores = async (selectedJobId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-video-score/get`,
        {
          jobId: selectedJobId,
          interviewRound: "L1 Hiring Manager Round",
        }
      );
      if (data) {
        setDomainScores(data);
      } else {
        setError(data.message || "Failed to fetch domain scores");
      }
    } catch (error) {
      setError(error.message || "Could not fetch domain scores");
    } finally {
      setLoading(false);
    }
  };

  const openAICommentModal = () => {
    setAICommentModalOpen(true);
  };
  useEffect(() => {
    if (isAICommentModalOpen) {
      const modalElem = document.querySelector("#com_full_screen");
      if (modalElem) {
        M.Modal.init(modalElem);
        const modalInstance = M.Modal.getInstance(modalElem);
        modalInstance.open();
      }
    }
  }, [isAICommentModalOpen]);

  const closeAICommentModal = () => {
    setAICommentModalOpen(false);
  };

  const getSkillsForCandidate = (candidateId) => {
    const roundSpecificHashMap =
      domainScores?.roundSpecificHashMap?.["L1 Hiring Manager Round"];
    const skillsData = roundSpecificHashMap?.[candidateId] || [];

    return {
      domainSkills: skillsData.filter((item) => item.skillType === "Domain"),
      softSkills: skillsData.filter((item) => item.skillType === "Soft"),
    };
  };

  const { domainSkills, softSkills } =
    getSkillsForCandidate(selectedCandidateId); // Defaulting to 1584 for testing

  return (
    <>
      {!domainSkills.length > 0 && !softSkills.length > 0 && (
        <div class="box-main-bg summary-page" style={{ height: "18.4rem" }}>
          <h4 className="recruiter">L1 Hiring Manager Round Score </h4>
          <p style={{ fontSize: "12px", fontWeight: "250" }}>
            No skills available for this round
          </p>
        </div>
      )}

      {domainSkills.length > 0 && softSkills.length > 0 && (
        <div class="box-main-bg summary-page">
          <h4 className="recruiter">L1 Hiring Manager Round Score </h4>
          <div
            class="score-wrapper"
            style={{ height: "6rem", overflow: "auto" }}
          >
            <h5>Domain Skills</h5>
            {domainSkills.map((skill, index) => (
              <div
                key={index}
                className="scoregraph-wr scoregraph-2 scoregraph-summary-page"
              >
                <div className="multigraph">
                  <span
                    className="graph"
                    style={{
                      "--score": `${((skill?.score ?? 0) * 180) / 100}deg`,
                    }}
                  >
                    {/* {((skill?.score).toFixed(1) ?? 0)} */}
                    {skill?.score % 1 === 0
                      ? skill.score
                      : skill.score.toFixed(1) || 0}
                  </span>
                </div>
                <p>{skill?.competancy || "-"}</p>
              </div>
            ))}
          </div>
          <div
            className="score-wrapper"
            style={{ height: "6rem", overflow: "auto" }}
          >
            <h5>Soft Skills</h5>
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="scoregraph-wr scoregraph-2 scoregraph-summary-page"
              >
                <div className="multigraph">
                  <span
                    className="graph"
                    style={{
                      "--score": `${((skill?.score ?? 0) * 180) / 100}deg`,
                    }}
                  >
                    {/* {(skill?.score ?? 0)} */}
                    {skill?.score % 1 === 0
                      ? skill.score
                      : skill.score.toFixed(1) ?? 0}
                  </span>
                </div>
                <p>{skill?.competancy || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {domainSkills.length > 0 && !softSkills.length > 0 && (
        <div class="box-main-bg summary-page">
          <h4 className="recruiter">L1 Hiring Manager Round Score </h4>
          <div
            class="score-wrapper"
            style={{ height: "13.4rem", overflow: "auto" }}
          >
            <h5>Domain Skills</h5>
            {domainSkills.map((skill, index) => (
              <div
                key={index}
                className="scoregraph-wr scoregraph-2 scoregraph-summary-page"
              >
                <div className="multigraph">
                  <span
                    className="graph"
                    style={{
                      "--score": `${((skill?.score ?? 0) * 180) / 100}deg`,
                    }}
                  >
                    {skill?.score % 1 === 0
                      ? skill.score
                      : skill.score.toFixed(1) ?? 0}
                  </span>
                </div>
                <p>{skill?.competancy || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {softSkills.length > 0 && !domainSkills.length > 0 && (
        <div class="box-main-bg summary-page">
          <h4 className="recruiter">L1 Hiring Manager Round Score </h4>
          <div
            className="score-wrapper"
            style={{ height: "13.4rem", overflow: "auto" }}
          >
            <h5>Soft Skills</h5>
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="scoregraph-wr scoregraph-2 scoregraph-summary-page scoregraph-round-page"
              >
                <div className="multigraph">
                  <span
                    className="graph"
                    style={{
                      "--score": `${((skill?.score ?? 0) * 180) / 100}deg`,
                    }}
                  >
                    {skill?.score % 1 === 0
                      ? skill.score
                      : skill.score.toFixed(1) ?? 0}
                  </span>
                </div>
                <p>{skill?.competancy || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        class="box-main-bg"
        style={{ marginTop: "10px", paddingTop: 0, minHeight: "12.2rem" }}
      >
        <aside
          className="input-field textarea-full"
          style={{ marginTop: "15px" }}
        >
          <a
            href="#com_full_screen"
            className="comment-fullscreen modal-trigger"
            onClick={openAICommentModal}
          >
            <i>
              <img src={icon.commentFullscreenIcon} alt="comment full screen" />
            </i>
          </a>
          <textarea
            placeholder={"Comments"}
            id="aicomments"
            // value={selectedCandidateRating?.aiComment ?? ""}
            value={""}
            className="materialize-textarea aicomments"
            readOnly
          ></textarea>
          <label for="aicomments" className="active">
            <i>
              <img src={icon.commentblogIconsvg} alt="aiComment" />
            </i>{" "}
            Evueme AI Comments
          </label>
        </aside>
        {isAICommentModalOpen && (
          <div id="com_full_screen" className="modal open">
            <a
              href="#!"
              className="modal-close waves-effect waves-red btn-flat close-ixon-can-rating"
              onClick={closeAICommentModal}
            ></a>
            <div className="modal-content">
              <div className="coment_content">
                {/* {selectedCandidateRating?.aiComment ?? ""} */}
                {""}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateLHiringRoundScore;
