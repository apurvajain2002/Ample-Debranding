import React from "react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import M from "materialize-css";
import { icon } from "../assets/assets";
import EvuemeModal from "../modals/evueme-modal";
import NormalButton from "../buttons/normal-button";
import SuccessToast from "../toasts/success-toast";
import { saveInterviewerTextNote } from "../../redux/actions/create-job-actions";
import ErrorToast from "../toasts/error-toast";

const InterviewerTextNote = ({ jobId, userId, selectedRoundId }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const modalElement = document.getElementById("interviewerTextNote");
    if (modalElement) {
      const modalInstance = M.Modal.init(modalElement);

      return () => {
        if (modalInstance) {
          modalInstance.destroy();
        }
      };
    }
  }, []);

  const handleSave = () => {
    if (!jobId) {
      ErrorToast("Please Select a Job");
      setComment("");
      const modalElement = document.getElementById("interviewerTextNote");
      const modalInstance = M.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.close();
      }
    } else if (!selectedRoundId) {
      ErrorToast("Please Select a Round");
      setComment("");
      const modalElement = document.getElementById("interviewerTextNote");
      const modalInstance = M.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.close();
      }
    } else if (!userId) {
      ErrorToast("Please select a candidate");
      setComment("");
      const modalElement = document.getElementById("interviewerTextNote");
      const modalInstance = M.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.close();
      }
    } else {
      let roundname;
      if (selectedRoundId === "Recruiter Round") {
        roundname = "recruiterNote";
      }
      if (selectedRoundId === "L1 Hiring Manager Round") {
        roundname = "l1RoundRecruiterNote";
      }
      dispatch(
        saveInterviewerTextNote({
          jobId,
          userId,
          comment,
          roundname,
        })
      );
      SuccessToast("Text Note Saved");
      setComment("");
      const modalElement = document.getElementById("interviewerTextNote");
      const modalInstance = M.Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.close();
      }
    }
  };

  return (
    <EvuemeModal divTagClasses="evuemeModal" modalId={"interviewerTextNote"}>
      <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          <i>
            <img src={icon.textDocumentCheckIconShare} />
          </i>{" "}
          Add Assessor Text Note
        </span>
        <textarea
          placeholder="Interviewer's Comment"
          id="aicomments"
          className="materialize-textarea aicomments-interviewers"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ overflow: "auto", height: "300px" }}
        ></textarea>
      </div>
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit"
        onClick={() => handleSave()}
        buttonText={"Save"}
      />
    </EvuemeModal>
  );
};

export default InterviewerTextNote;
