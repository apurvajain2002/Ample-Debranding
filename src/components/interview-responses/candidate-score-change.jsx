import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import EvuemeModal from "../modals/evueme-modal";
import NormalButton from "../buttons/normal-button";
import M from "materialize-css";
import SuccessToast from "../toasts/success-toast";
import ErrorToast from "../toasts/error-toast";

const CandidateScoreChange = ({ jobId, userId, selectedQuestionData }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const previousSliderValue = useRef(sliderValue);

  const dispatch = useDispatch();
  const id = localStorage.getItem("userId");

  const { selectedRoundId } = useSelector(
    (state) => state.interviewResponsesL1DashboardSliceReducer
  );

  useEffect(() => {
    if (selectedQuestionData) {
      setSliderValue(selectedQuestionData.accessorScore || 0);
    }
  }, [selectedQuestionData]);


  const handleSave = () => {
    setLoading(true);
    const updatedAccessorScore = sliderValue;


    axiosInstance
      .post(
        `${baseUrl}/job-posting/api/candidate-video-score/update`,
        {
          jobId: jobId,
          userId: userId,
          accessorInterviewerId: id,
          interviewRound: selectedRoundId,
          accessorScore: updatedAccessorScore,
          questionId: selectedQuestionData?.questionId
        }
      )
      .then((response) => {
        // On successful response, show success toast and close modal
        SuccessToast("Rating Updated Successfully!");
        const modalElement = document.getElementById("scoreChange");
        const modalInstance = M.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.close();
        }
      })
      .catch((error) => {
        // On failure, show error toast, and revert slider value
        setError(error.message || 'Failed to update score');
        ErrorToast("Failed to update score");

        setSliderValue(previousSliderValue.current);

        // Close modal even in case of failure
        const modalElement = document.getElementById("scoreChange");
        const modalInstance = M.Modal.getInstance(modalElement);
        if (modalInstance) {
          modalInstance.close();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };


  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <EvuemeModal divTagClasses="evuemeModal" modalId={"scoreChange"}>
      <div className="col s12 xl6 l6 m6 login-wrap" style={{ width: "100%" }}>
        <span
          style={{
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          Change Score
        </span>
        <div className="modal-body">
          <h3>
        {selectedQuestionData?.competancy ?? "Accessor Score"}
        </h3>
          <div className="sliders-container">
            <div className="custom-sliders">
              <div className="value-label">{sliderValue}</div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                className="sliders"
                id="sliders"
                onInput={handleSliderChange}
              />
            </div>
          </div>
        </div>
      </div>
      <NormalButton
        buttonTagCssClasses="waves-effect waves-light btn btn-clear btn-submit"
        onClick={handleSave}
        buttonText={loading ? "Saving..." : "Lock Rating"}
        disabled={loading}
      />
    </EvuemeModal>
  );
};

export default CandidateScoreChange;
