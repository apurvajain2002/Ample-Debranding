import { useDispatch, useSelector } from "react-redux";
import { optionMapper } from "../../utils/optionMapper";
import NormalInputField from "../input-fields/normal-input-field";
import SelectInputField from "../input-fields/select-input-field";
import { useEffect, useState } from "react";
import handleDate from "../../utils/handleDate";
import DateInputField from "../input-fields/date-input-field";
import NewTypeaheadInputField from "../input-fields/NewTypeaheadInputField";
import {
  getAllJob,
  getAllPublishedJob,
  getJob,
} from "../../redux/actions/create-job-actions";
import { interviewRounds } from "../../resources/constant-data/AddJobDetails";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import ErrorToast from "../toasts/error-toast";
import EvuemeLoader from "../loaders/evueme-loader";
import {
  setSelectedJobId,
  setSelectedRoundId,
  setSelectedQuestionMap,
  setInitialState,
} from "../../redux/slices/interview-responses-l1-dashboard-slice";

import {
  fetchCandidateList,
  fetchTotalQuestions,
  triggerScoreCalculation,
} from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { useGlobalContext } from "../../context";
import CustomModal from "../modals/custom-modal";

const initialState = {
  fromDate: "",
  toDate: "",
};
const CandidateSearch = ({ l1Jobs = false }) => {
  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const { userType } = useSelector(
    (state) => state.signinSliceReducer
  );
  const jobId = useSelector((state) => state.createNewJobSliceReducer.jobId);
  const [selectedJobRounds, setSelectedJobRounds] = useState([]);
  const [selectedPlacementAgencies, setSelectedPlacementAgencies] = useState(
    []
  );
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);
  const [report, setReport] = useState(initialState);
  const [selectedVacancyLocations, setSelectedVacancyLocations] = useState([]);
  const [selectedView, setSelectedView] = useState("applicant");
  const [candidateName, setCandidateName] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCandidateStatus, setSelectedCandidateStatus] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [selectedPlacementAgency, setSelectedPlacementAgency] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hiringType, setHiringType] = useState("Lateral Hiring");
  const [candidateList, setCandidateList] = useState([]);
  const [questionTypesList, setQuestionTypesList] = useState([]);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isAiScoreModalOpen, setIsAiScoreModalOpen] = useState(false);
  const {
    selectedJobId,
    selectedRoundId,
    totalQuestionList,
    isViewByApplicant,
    triggerScore
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);

  console.log("triggerScore ::: ", triggerScore);

  const { userId } = useSelector((state) => state.signinSliceReducer);
  const { hostname } = useGlobalContext();
  const isAdmin = hostname === 'ev' && userType === 'recruiter';

  useEffect(() => {
    // Only fetch published jobs if we have a valid userId and user is authenticated
    if (userId) {
      dispatch(getAllPublishedJob({ showRows: " ", id: userId }))
        .catch((error) => {
          console.error("Failed to fetch published jobs:", error);
          // Don't show error toast for initial load failures
        });
    }
  }, [userId]);

  useEffect(() => {
    if (selectedJobId) {
      const selectedJob = tableDataPublished.find(
        (job) => job.jobId === parseInt(selectedJobId, 10)
      );

      if (selectedJob) {
        if (l1Jobs) {
          if (selectedJob.interviewRounds?.includes("L1 Hiring Manager Round")) {
            setSelectedJobRounds([
              { label: "L1 Hiring Manager Round", value: "L1 Hiring Manager Round" },
            ]);
          } else {
            setSelectedJobRounds([]);
          }
        } else {
          setSelectedJobRounds(
            selectedJob.interviewRounds?.map((round) => ({
              label: round,
              value: round,
            })) || []
          );
        }
        setHiringType(selectedJob.hiringType || "Lateral Hiring"); // Default to "Lateral Hiring"
        setSelectedPlacementAgencies(
          selectedJob.placementAgencies?.map((agency) => ({
            label: agency,
            value: agency,
          })) || []
        );

        setSelectedRecruiters(
          selectedJob.recruiterName?.map((recruiter) => ({
            label: recruiter,
            value: recruiter,
          })) || []
        );

        setSelectedVacancyLocations(
          selectedJob.locations?.map((location) => ({
            label: location,
            value: location,
          })) || []
        );
      }
    }
  }, [selectedJobId, tableDataPublished]);

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const labelText =
    hiringType === "Campus Hiring" ? "Campus Name" : "Placement Agency";

  const handleJobChange = (e) => {
    dispatch(setInitialState());
    dispatch(setSelectedJobId(e.target.value));
    dispatch(setSelectedRoundId(""));
    setSelectedPlacementAgency("");
    setSelectedRecruiter("");
    setSelectedLocation("");
    setCandidateName("");
    setSelectedDate("");
    setSelectedCandidateStatus("");
  };

  const handleCandidateNameChange = (selectedValue) => {
    setCandidateName(selectedValue);
  };
  const handleRemoveMultiValueCandidateName = (value) => {
    setCandidateName((prevState) =>
      prevState.filter((candidate) => candidate !== value)
    );
  };

  const handleOnClickClear = () => {
    dispatch(setInitialState());
    dispatch(setSelectedJobId(""));
    dispatch(setSelectedRoundId(""));
    setSelectedPlacementAgency("");
    setSelectedRecruiter("");
    setSelectedLocation("");
    setCandidateName("");
    setSelectedDate("");
    setSelectedCandidateStatus("");
  };

  const handleOnClickSubmit = async () => {
    // Validate required fields before making API calls
    if (!selectedJobId || !selectedRoundId) {
      ErrorToast("Please select both Job Position and Interview Round");
      return;
    }

    try {
      setLoading(true);
      const reportLink = "";

      // Make API calls sequentially to prevent race conditions
      await dispatch(fetchCandidateList({ selectedJobId, selectedRoundId, reportLink }));

      const responseType = "video";
      await dispatch(fetchTotalQuestions({ selectedJobId, selectedRoundId, responseType }));

    } catch (error) {
      console.error("Error fetching candidate data:", error);
      const errorMessage = error.message || "Failed to fetch candidate data";
      ErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dispatch(setSelectedQuestionMap({ totalQuestionList, isViewByApplicant }));
  }, [totalQuestionList]);

  const handlePlacementAgencyChange = (e) =>
    setSelectedPlacementAgency(e.target.value);
  const handleRecruiterChange = (e) => setSelectedRecruiter(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);
  const handleRoundChange = (e) => dispatch(setSelectedRoundId(e.target.value));
  const openAiScoreModal = async () => {

    if (!selectedJobId || !selectedRoundId) {
      ErrorToast("Please select both Job Position and Interview Round");
      return;
    }

    await dispatch(triggerScoreCalculation({
      jobId: selectedJobId,
      interviewRound: selectedRoundId,
      questionType: '1',
      candidateStatus: selectedCandidateStatus,
      placementAgency: selectedPlacementAgency,
      recruiterName: selectedRecruiter,
      vacancyLocation: selectedLocation,
    }));

    setIsAiScoreModalOpen(true)
  };
  const closeAiScoreModal = () => setIsAiScoreModalOpen(false);

  return (
    <div className="container">
      {loading && <EvuemeLoader />}
      <div className="row row-margin">
        <div className="col xl6 l6 m6 s6"></div>
        <div
          className="col xl6 l6 m6 s6 right-align search-button"
        //  style={{paddingRight: 0,marginLeft: "50.6%"}}
        >
          <a
            className="waves-effect waves-light btn btn-clear btn-submit search-dropdown"
            onClick={toggleSearchVisibility}
          >
            Search Candidate &darr;
          </a>
        </div>
      </div>
      <div
        className={`body-box-header mb-15 candidate-body ${isSearchVisible ? "expanded" : "collapsed"
          }`}
        style={{ display: isSearchVisible ? "block" : "none" }}
      >
        <div
          className="body-box-header mb-15 candidate-body"
          style={{ display: "block" }}
        >
          <header className="body-box-top">
            <div className="row ">
              <aside className="xl-6 lg-6 md-6 s12">
                <h3>Search Candidate</h3>
              </aside>
            </div>
          </header>
          <div className="body-box-body">
            <div className="row">
              <SelectInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                labelText={"Job Position"}
                options={optionMapper(
                  tableDataPublished,
                  "positionName",
                  "jobId",
                  "Select a job"
                )}
                firstOptionDisabled={true}
                required
                value={selectedJobId}
                onChange={handleJobChange}
              />
              <aside className="input-field col xl3 l3 m4 s12">
                <select
                  value={selectedRoundId}
                  onChange={handleRoundChange}
                  required
                >
                  <option disabled value="">
                    Select Interview Round
                  </option>
                  {selectedJobRounds.map((round, index) => (
                    <option key={index} value={round.value}>
                      {round.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="vacancy_locations">
                  Interview Round <span style={{ color: "red" }}>*</span>
                </label>
              </aside>
              <div className="input-field col xl3 l3 m4 s12">
                <select
                  value={selectedPlacementAgency}
                  onChange={handlePlacementAgencyChange}
                >
                  <option disabled value="">
                    Select {labelText}
                  </option>
                  {selectedPlacementAgencies.map((agency, index) => (
                    <option key={index} value={agency.value}>
                      {agency.label}
                    </option>
                  ))}
                </select>
                <label>{labelText}</label>
              </div>

              <aside className="input-field col xl3 l3 m4 s12">
                <select
                  value={selectedRecruiter}
                  onChange={handleRecruiterChange}
                >
                  <option disabled value="">
                    Select Recruiter Name
                  </option>
                  {selectedRecruiters.map((recruiter, index) => (
                    <option key={index} value={recruiter.value}>
                      {recruiter.label}
                    </option>
                  ))}
                </select>
                <label>Recruiter Name</label>
              </aside>
              <aside className="input-field col xl3 l3 m4 s12">
                <select
                  value={selectedCandidateStatus}
                  onChange={(e) => setSelectedCandidateStatus(e.target.value)}
                >
                  <option value="">Select Candidate Status</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
                <label htmlFor="vacancy_locations">Candidate Status</label>
              </aside>

              <aside className="input-field col xl3 l3 m4 s12">
                <select
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  <option disabled value="">
                    Select Vacancy Location
                  </option>
                  {selectedVacancyLocations.map((location, index) => (
                    <option key={index} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
                <label>Vacancy Location</label>
              </aside>

              <div className="input-field col xl3 l3 m4 s12">
                <select disabled value={"Video Questions"}>
                  <option value="1">Video Questions</option>
                </select>
                <label htmlFor="first_name">Question Type</label>
              </div>
              <div className="input-field col xl3 l3 m3 s3">
                <div
                  style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}
                >
                  {!isAdmin &&
                    <a
                      className="waves-effect waves-light btn btn-clear left"
                      onClick={handleOnClickClear}
                    >
                      Clear
                    </a>
                  }
                  <a
                    className="waves-effect waves-light btn btn-clear btn-submit right"
                    onClick={handleOnClickSubmit}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? "Loading..." : "Submit"}
                  </a>
                  {isAdmin &&
                    <a
                      className="waves-effect waves-light btn btn-clear btn-submit right btnsmall-tr"
                      onClick={openAiScoreModal}
                      style={{ cursor: 'pointer' }}
                    >
                      AI Score Prediction
                    </a>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomModal isOpen={isAiScoreModalOpen} onClose={closeAiScoreModal}>
        <div style={{ padding: 16 }}>
          <h5 style={{ marginTop: 0, marginBottom: 12 }}>Getting AI Scores</h5>
          <p style={{ marginTop: 0, marginBottom: 8 }}>It might take a few minutes</p>
          <p style={{ marginTop: 0 }}>
            Don’t worry. You can see the scores once heavy lifting is completed. You can close this window now
          </p>
        </div>
      </CustomModal>
    </div>
  );
};

export default CandidateSearch;
