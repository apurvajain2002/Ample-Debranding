import { useDispatch, useSelector } from "react-redux";
import { optionMapper } from "../../utils/optionMapper";
import SelectInputField from "../input-fields/select-input-field";
import { useEffect, useState } from "react";
import handleDate from "../../utils/handleDate";
import DateInputField from "../input-fields/date-input-field";
import { getAllJob,getAllPublishedJob, getJob } from "../../redux/actions/create-job-actions";
import axiosInstance from "../../interceptors";
import { baseUrl } from "../../config/config";
import ErrorToast from "../toasts/error-toast";
import { setSelectedJobId, setSelectedRoundId, setSelectedQueTypes, setInitialState} from "../../redux/slices/interview-responses-recuriter-dashboard-slice";
import { fetchQuestionsByTypes } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import WarningToast from "../toasts/warning-toast";
const responseTypeMapping = {
  mcq: "Competency Section",
  audio: "Audio Questions",
  video: "Video Questions",
  filtration: "Filtration Questions",
};

const initialState = {
  fromDate: "",
  toDate: "",
};

const CandidateSearchRecruiter = ({
  onQuestionTypeChange,
  setShowQuestions,
  setShowTable,
  filteredQueList,
  setFilteredQueList,
  setDisplayQuestionList,
  setJobId,
  setRoundId,
  setSelectedInterviewers,
}) => {

  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const interviewers = useSelector(
    (state) => state.createNewJobSliceReducer.interviewrs
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
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [selectedPlacementAgency, setSelectedPlacementAgency] = useState("");
  const [selectedRecruiter, setSelectedRecruiter] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hiringType, setHiringType] = useState("Lateral Hiring");
  const [candidateList, setCandidateList] = useState([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState([]);
  const [lastValidSelection, setLastValidSelection] = useState(
    selectedQuestionTypes
  );
  const [questionTypes, setQuestionTypes] = useState([]);
  const [questionsList, setQuestionsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewerNames, setInterviewerNames] = useState([]);
  const { selectedJobId, selectedRoundId } = useSelector((state) => state.interviewResponsesRecruiterDashboardSliceReducer);

  const { userId } = useSelector((state) => state.signinSliceReducer);


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPublishedJob({ showRows: " ", id: userId }));
  }, []);

  useEffect(() => {
    async function fetchNames() {
      try {
       
        const { data } = await axiosInstance.post(
          `${baseUrl}/job-posting/api/enablex/get-all-candidates`,
          {
            jobId: selectedJobId,
            interviewRound: selectedRoundId,
            reportLink:''
          }
        );
       
        if (data.success) {
          data?.list?.map((item, index) => {
            setCandidateList((prevState) => [
              ...prevState,
              {
                optionKey: item.firstName + " " + item.lastName,
                optionValue: item.firstName + " " + item.lastName,
              },
            ]);
          });
        }
      } catch (error) {
        ErrorToast(error.message);
      }
    }

    fetchNames();
  }, [selectedJobId, selectedRoundId]);

  useEffect(() => {
    async function fetchQuestionTypes() {
      if (selectedJobId && selectedRoundId) {
        try {
          const { data } = await axiosInstance.post(
            `${baseUrl}/job-posting/interview-question/get-question-types-for-interview`,
            { jobId: selectedJobId, interviewRound: selectedRoundId }
          );
          if (data.status) {
            setQuestionTypes(data?.questionTypeList.filter((val)=>!["codeSnippet","filler"].includes(val)) || []);  
          }
          else {
            WarningToast(data?.message??"No Question Types present for this job");
          }
        } catch (error) {
          ErrorToast(error.message);
        }
      }
    }
    fetchQuestionTypes();
  }, [selectedJobId, selectedRoundId]);

  useEffect(() => {
    if (selectedJobId) {
      const selectedJob = tableDataPublished.find(
        (job) => job.jobId === parseInt(selectedJobId, 10)
      );

      if (selectedJob) {
        if(selectedJob.interviewRounds?.includes("Recruiter Round")){
          setSelectedJobRounds([{label:"Recruiter Round",value:"Recruiter Round"}]);
        } else {
          setSelectedJobRounds([]);
        }

        setHiringType(selectedJob.hiringType || "Lateral Hiring"); 
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

      const interviewerNames = getInterviewerNames(selectedJob?.interviewers);
    
    }
  }, [selectedJobId, tableDataPublished]);

  const getInterviewerNames = (ids) => {
    const names = ids?.map((id) => {
      const numericId = parseInt(id, 10);
      const interviewer = interviewers?.find((iv) => iv.id === numericId);
      return interviewer
        // ? `${interviewer.firstName.trim()} ${interviewer.lastName.trim()}`
        // : "Unknown";
    });

    setInterviewerNames(names);
    setSelectedInterviewers(names);
     };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };


  const handleQuestionTypeChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
   
    if (selectedValues.includes("filtration") && selectedValues.length > 1) {
      ErrorToast("You cannot select any other type with Filtration");
      return;
    }
    setSelectedQuestionTypes(selectedValues);
    onQuestionTypeChange(selectedValues);
  };

  const handleOnClickClear = () => {
    dispatch(setInitialState());
    setQuestionTypes([]);
    setSelectedJobId("");
    setJobId("");
    setSelectedRoundId("");
    setRoundId("");
    setSelectedPlacementAgency("");
    setSelectedRecruiter("");
    setSelectedLocation("");
    setCandidateName("");
    setSelectedDate("");
    setSelectedCandidateStatus("");
    setSelectedQuestionTypes("");

    setDisplayQuestionList([]);
    setFilteredQueList([]);
    setShowQuestions(false);
    setShowTable(false);
  };

  const handlDateInput = (name) => {
    function convertToDate(dateString) {
      const [day, month, year] = dateString.split("/");
      return new Date(year, month - 1, day);
    }

    const onCloseCallback = (result) => {
      const selectedDate = result.date;

      if (name === "fromDate") {
        setReport((prevDetails) => ({
          ...prevDetails,
          fromDate: selectedDate,
          toDate:
            prevDetails.toDate &&
              convertToDate(selectedDate) > convertToDate(prevDetails.toDate)
              ? ""
              : prevDetails.toDate,
        }));
      } else {
        setReport((prevDetails) => ({
          ...prevDetails,
          [name]: selectedDate,
        }));
      }
    };

    const selectedDate = convertToDate(report[name]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date();
    minDate.setMonth(3);
    minDate.setDate(1);
    minDate.setFullYear(today.getFullYear() - 1);

    const maxDate = today;

    if (name === "fromDate") {
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: minDate,
        maxDate: maxDate,
      });
    } else if (name === "toDate") {
      const startDate = convertToDate(report.fromDate) || minDate;
      handleDate(name, onCloseCallback, selectedDate, {
        minDate: startDate > minDate ? startDate : minDate,
        maxDate: maxDate,
      });
    }
  };

  const labelText =
    hiringType === "Campus Hiring" ? "Campus Name" : "Placement Agency";

  const handleJobChange = (e) => {
    dispatch(setSelectedJobId(e.target.value));
    setSelectedJobRounds([]);
    setQuestionTypes([]);
    setSelectedRoundId("");
    setRoundId("");
    setJobId(e.target.value);
    setSelectedPlacementAgency("");
    setSelectedRecruiter("");
    setSelectedLocation("");
    setCandidateName("");
    setSelectedDate("");
    setSelectedCandidateStatus("");
    setSelectedQuestionTypes("");
    setShowTable(false);
    setDisplayQuestionList([]);
    setFilteredQueList([]);
    setShowQuestions(false);
  };
  const handleRoundChange = (e) => {
    dispatch(setSelectedRoundId(e.target.value));
  }
  const handleOnClickSubmit = async () => {
    
    await setShowTable(false);
    if (selectedJobId && selectedRoundId && selectedQuestionTypes.length) {
      dispatch(setSelectedQueTypes(selectedQuestionTypes));
      dispatch(fetchQuestionsByTypes({ selectedJobId, selectedRoundId, selectedQuestionTypes }));
      setShowQuestions(true);
    } else {
      WarningToast("Please Select Mandatory Fields");
    }
  }
  const handlePlacementAgencyChange = (e) => setSelectedPlacementAgency(e.target.value);
  const handleRecruiterChange = (e) => setSelectedRecruiter(e.target.value);
  const handleLocationChange = (e) => setSelectedLocation(e.target.value);



  return (
    <div class="container">
      <div class="row row-margin">
        <div class="col xl6 l6 m6 s6">
        </div>
        <div class="col xl6 l6 m6 s6 right-align">
          <a
            href="javascript:void(0)"
            className="waves-effect waves-light btn btn-clear btn-submit search-dropdown"
            onClick={toggleSearchVisibility}
          >
            Search Candidate &darr;
          </a>
        </div>
      </div>
      <div
        className={`body-box-header mb-15 candidate-body ${isSearchVisible ? 'expanded' : 'collapsed'}`}
        style={{ display: isSearchVisible ? 'block' : 'none' }}
      >
        <div class="body-box-header mb-15 candidate-body" style={{ display: "block" }}>
          <header class="body-box-top candidate-recruiter-search">
            <div class="row ">
              <aside class="xl-6 lg-6 md-6 s12">
                <h3>
                  Search Candidate
                </h3>
              </aside>
            </div>
          </header>
          <div class="body-box-body">
            <div class="row">
              <SelectInputField
                divTagCssClasses="input-field col xl3 l3 m4 s12"
                labelText={"Job Position"}
                options={optionMapper(tableDataPublished, "positionName", "jobId", "Select a job")}
                firstOptionDisabled={true}
                required
                value={selectedJobId}
                onChange={handleJobChange}
              />
              <aside class="input-field col xl3 l3 m4 s12">

                <select
                  value={selectedRoundId}
                  onChange={(e) => {
                    handleRoundChange(e);

                  }}
                  required
                >
                  <option disabled value="">Select Interview Round</option>
                  {selectedJobRounds.map((round, index) => (
                    <option key={index} value={round.value}>{round.label}</option>
                  ))}
                </select>
                <label for="vacancy_locations">Interview Round<span style={{ color: 'red' }}>*</span></label>
              </aside>
            
              <div className="input-field col xl3 l3 m4 s12">
                <select
                  multiple
                  required
                  value={selectedQuestionTypes}
                  onChange={handleQuestionTypeChange}
                >
                  <option value="" disabled>
                    Select Question Type
                  </option>
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {responseTypeMapping[type] || type}
                    </option>
                  ))}
                </select>
                <label>Question Type<span style={{ color: 'red' }}>*</span></label>
              </div>

              <div class="input-field col xl3 l3 m4 s12 date-field">
                <DateInputField
                  inputTagIdAndName="fromDate"
                  value={report.fromDate}
                  placeholder="From Date"
                  onClick={() => handlDateInput("fromDate")}
                  labelText={"From Date"}
                />
                <DateInputField
                  inputTagIdAndName={"toDate"}
                  value={report.toDate}
                  placeholder="To Date"
                  onClick={() => handlDateInput("toDate")}
                  labelText={"To Date"}
                />
              </div>

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
              <div class="input-field col xl3 l3 m3 s3 right-align">
                <a
                  class="waves-effect waves-light btn btn-clear left"
                  onClick={handleOnClickClear}
                >
                  Clear
                </a>
                <a
                  class="waves-effect waves-light btn btn-clear btn-submit right"
                  onClick={handleOnClickSubmit}
                >
                  Submit
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearchRecruiter;
