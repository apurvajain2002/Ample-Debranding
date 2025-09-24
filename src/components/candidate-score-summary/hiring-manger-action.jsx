import { useState, useEffect } from "react";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import { useSelector, useDispatch } from "react-redux";
import SelectInputField from "../input-fields/select-input-field";
import { icon } from "../assets/assets";
import EvuemeModalTrigger from "../modals/evueme-modal-trigger";
import RecorderModal from "../interview-responses-recruiter/recorder-modal";
import InterviewerTextNote from "../interview-responses-recruiter/interviewerTextNote";
import WarningToast from "../toasts/warning-toast";
import { updateCandidateStatus } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";

const HiringManagerAction = ({ selectedCandidateId, selectedRoundId }) => {
  const dispatch = useDispatch();
  const {
    interviewResponsesL1DashboardSliceReducer: { selectedJobId },
    interviewResponsesRecruiterDashboardSliceReducer: {
      interviewResultStatusList,
    },
  } = useSelector((state) => state);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [candidateFiltrations, setCandidateFiltrations] = useState([]);
  const [interviewResults, setInterviewResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // console.log("interviewResultStatusList ===>>> ", interviewResultStatusList);


  useEffect(() => {
    if (selectedJobId, selectedRoundId) {
      fetchInterviewResults(selectedJobId, selectedRoundId);
    } else {
      console.log("Job ID or Round ID not available yet.");
    }
  }, [selectedJobId, selectedRoundId]);

  const fetchInterviewResults = async (selectedJobId, selectedRoundId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/filter-candidate-status`,
        {
          jobId: selectedJobId,
          roundName: selectedRoundId,
          questionData: {},
        }
      );
      if (data) {
        setInterviewResults(data.interviewResultConstantModelList);
        setCandidateFiltrations(data.candidateFiltrations);

      } else {
        setError(data.message || 'Failed to fetch interview results');
      }
    } catch (error) {
      setError(error.message || 'Could not fetch interview results');
    } finally {
      setLoading(false);
    }
  };
  const interviewStatusOptions = interviewResults ? interviewResults.map(result => ({
    optionKey: result.interviewStatus,
    optionValue: result.id
  })) : [];

  const handleChange = (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    // if (!newStatus) {
    // 	WarningToast("Please select a valid status");
    // 	return;
    // }

    // const statusData = [
    // 	{
    // 		userId: selectedCandidateId,
    // 		status: newStatus,
    // 	},
    // ];
    // dispatch(
    // 	updateCandidateStatus({
    // 		selectedJobId,
    // 		selectedRoundId: "L1 Hiring Manager Round",
    // 		statusData,
    // 		published: true,
    // 	})
    // );
  };


  useEffect(() => {
    const filtration = candidateFiltrations.find(item => item.user.id === selectedCandidateId);
    if (filtration) {
      setSelectedStatus(filtration.status);
    }
  }, [candidateFiltrations, selectedCandidateId]);


  // const handleChange = (event) => {
  //   setSelectedStatus(event.target.value);
  // };

  const handleSubmitAction = () => {
    if (!selectedCandidateId) {
      WarningToast("Please select a candidate");
      return;
    }
    if (!selectedStatus) {
      WarningToast("Please select a valid status");
      return;
    }

    const statusData = [
      {
        userId: selectedCandidateId,
        status: selectedStatus,
      },
    ];
    dispatch(
      updateCandidateStatus({
        selectedJobId,
        selectedRoundId: "L1 Hiring Manager Round",
        statusData,
        published: true,
      })
    );
  };

  return (
    <div className="input-field textarea-full" style={{ marginTop: "0px" }}>
      <div className="box-main-bg boxmainmargin" style={{ minHeight: "13rem" }}>
        <h4 className="recruiter">Hiring Manager Action</h4>
        <div className="row row-margin" style={{ marginTop: 0 }}>
          <div className="flex-items">
            <SelectInputField
              labelText={"Rate Candidate"}
              divTagCssClasses="col xl12 l12 m12 s12 publish-field"
              value={selectedStatus}
              onChange={handleChange}
              options={interviewStatusOptions}
              disabled={selectedStatus === 14}
            />
            <div className="center-items" style={{ marginTop: "14px" }}>
              <button className="hm-submit-btn" onClick={handleSubmitAction}
                style={{
                  height: "40px",
                  backgroundColor: selectedStatus === 14 ? "grey" : "",
                  cursor: selectedStatus === 14 ? "auto" : "pointer",
                }} disabled={selectedStatus === 14}>
                Submit
              </button>
            </div>
          </div>
          <aside className="col xl12 l12 m12 s12">
            <ul
              className="enhance-sectionul interview-actionul"
              style={{ justifyContent: "start" }}
            >
              <li className="active">
                <EvuemeModalTrigger modalId="interviewerAudioNote">
                  <i>
                    <img src={icon.enhanceAudioIcon} />
                  </i>
                  <p>Add Voice Note</p>
                </EvuemeModalTrigger>
              </li>
              <li style={{ margin: "0 5px" }}>
                <EvuemeModalTrigger modalId="interviewerTextNote">
                  <i>
                    <img src={icon.enhanceTextIcon} />
                  </i>
                  <p>Add Text Note</p>
                </EvuemeModalTrigger>
              </li>
            </ul>
          </aside>
        </div>
      </div>
      <InterviewerTextNote
        jobId={selectedJobId}
        userId={selectedCandidateId}
        selectedRoundId={selectedRoundId}
      />
      <RecorderModal
        jobId={selectedJobId}
        userId={selectedCandidateId}
        selectedRoundId={selectedRoundId}
      />
    </div>
  );
};

export default HiringManagerAction;
