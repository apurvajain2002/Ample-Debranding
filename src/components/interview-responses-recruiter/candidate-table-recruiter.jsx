import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import EvuemeModalTrigger from "../modals/evueme-modal-trigger";
import TableComponent from "../table-components/table-component";
import {  icon, image } from "../assets/assets";
import AudioPopupModal from "./audio-popup-modal";
import EvuemeSelectTag from "../evueme-html-tags/evueme-select-tag";
import InterviewerTextNote from "./interviewerTextNote";
import { getAllInvitedCandidates } from "../../redux/actions/invited-candidates";
import { useDispatch, useSelector } from "react-redux";
import InterviewerModalRecruiter from "./interviewerModalRecruiter";
import CandidateEmailModal from "./candidateEmailModal";
import CandidateWhatsappModal from "./candidateWhatsappModal";
import CandidateScoreTableModal from "./candidate-score-table-modal";
import { ClockLoader } from "react-spinners";
import InterviewModalPositionReport from "../interview-responses/interviewModalPositionReport";
import {
  getJob,
  getAllInterviewrs,
} from "../../redux/actions/create-job-actions";
import RecorderModal from "./recorder-modal";
import JobDetails from "../../screens/job-details";
import {
  setIsStatusUpdateSuccessful,
  setSelectedCandidateEmailWpInfo,
  clearMoveToNextRoundResponse,
} from "../../redux/slices/interview-responses-recuriter-dashboard-slice";
import { setIsGetJobsApiCalled, selectJobId, setRoundName } from "../../redux/slices/create-new-job-slice";
import { setIsNotPublishedJobsApiCalled } from "../../redux/slices/define-interview-slice";
import {
  moveToNextRound,
  updateCandidateStatus,
} from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import ErrorToast from "../toasts/error-toast";
import WarningToast from "../toasts/warning-toast";
import SuccessToast from "../toasts/success-toast";
import VideoPopupModal from "./video-popup-modal";
import TablePopupModal from "./table-popup-modal";
import { useNavigate } from "react-router-dom";
import EvuemeImageTag from "../evueme-html-tags/Evueme-image-tag";
import { statusColorCode } from "../../resources/constant-data/candidate-status-color-code";
import DownloadCandidateReport from "../../screens/candidate-report/report-page-pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { showRowsList } from "../../resources/constant-data/common";
import { useGlobalContext } from "../../context";
const CandidateTableRecruiter = ({ selectedInterviewersInJob }) => {
  const [interviewers, setInterviewers] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPDFMail, setIsGeneratingPDFMail] = useState(false);
  const [needData, setNeedData] = useState(false);
  const [iswpModelOpen, setisWpModelOpen] = useState(false);
  const [isInterviewerModalOpen, setIsInterviewerModalOpen] = useState(false);
  const [isInterviewerModalOpenRecruiter, setIsInterviewerModalOpenRecruiter] =
    useState(false);
  const [isSendEmailToCandidateModelOpen, setIsSendEmailToCandidateModelOpen] =
    useState(false);
  const sortByOptionTable = [
    { optionKey: "Sort By Option", optionValue: "" },
    { optionKey: "Sort Ascending", optionValue: "asc" },
    { optionKey: "Sort Descending", optionValue: "dsc" },
  ];
  const navigate = useNavigate();
  const pageRef = useRef();
  const { jobId } = useSelector((state) => state.createNewJobSliceReducer);
  const [selectedQueTypes, setSelectedQueTypes] = useState([]);
  const {
    selectedQuestionsMap,
    questionsByTypes,
    selectedJobId,
    selectedRoundId,
    selectedQuestionsResponse,
    filteredResponses,
    interviewResultStatusList,
    videoSkills,
    isStatusUpdateSuccessful,
    domainSkills,
    moveToNextRoundResponse,
    moveToNextRoundStatus,
    moveToNextRoundError,
  } = useSelector(
    (state) => {
      console.log('Redux state for moveToNextRound:', {
        response: state.interviewResponsesRecruiterDashboardSliceReducer.moveToNextRoundResponse,
        status: state.interviewResponsesRecruiterDashboardSliceReducer.moveToNextRoundStatus,
        error: state.interviewResponsesRecruiterDashboardSliceReducer.moveToNextRoundError
      });
      return state.interviewResponsesRecruiterDashboardSliceReducer;
    }
  );

  const [tableHeadValues, setTableHeadValues] = useState([]);
  const [candidateStatusOptions, setCandidateStatusOptions] = useState([]);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRows, setShowRows] = useState(10);
  const [showCustomSort, setShowCustomSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [customSortArray, setCustomSortArray] = useState([]);
  const [filterArray, setFilterArray] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  

  const [showModal, setShowModal] = useState(false);
  const audioScoreModalButtonRef = useRef(null);
  const audioScoreModalRef = useRef(null);
  const [isAudioScoreModalVisible, setIsAudioScoreModalVisible] =
    useState(false);
  const [hoveredCandidateIndex, setHoveredCandidateIndex] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [updatedStatusMap, setUpdatedStatusMap] = useState({});
  const [checkedCandidates, setCheckedCandidates] = useState({});
  
  // Debug effect to monitor pageRef
  useEffect(() => {
    console.log("pageRef changed:", pageRef.current);
    console.log("needData:", needData);
    console.log("selectedCandidateId:", selectedCandidateId);
  }, [pageRef.current, needData, selectedCandidateId]);
  const [popup, setPopup] = useState({
    isVisible: false,
    position: { top: 0, left: 0 },
    content: "",
  });
  const [disableUpdatedStatusCandidates, setdisableUpdatedStatusCandidates] =
    useState({});
  const [doPublishOrUnpublish, setDoPublishOrUnpublish] = useState(false);
  const [audioPopupFlag, setAudioPopupFlag] = useState("");
  const [videoPopupFlag, setVideoPopupFlag] = useState("");
  const [audioScorePopupFlag, setAudioScorePopupFlag] = useState(-1);
  const [audioTranscriptPopupFlag, setAudioTranscriptPopupFlag] = useState(-1);
  const [videoTranscriptPopupFlag, setVideoTranscriptPopupFlag] = useState(-1);

  const [videoScorePopupFlag, setVideoScorePopupFlag] = useState(-1);
  const [pdfVal, setPdfVal] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [savingRating, setSavingRating] = useState(false);
  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  // Sorting functions - moved to top to avoid hoisting issues
  const getColumnValue = useCallback((userData, columnName) => {
    switch (columnName) {
      case "applicantName":
        return userData?.["applicant"]?.["firstName"] + " " + userData?.["applicant"]?.["lastName"] ?? "";
      case "A1":
      case "A2":
      case "A3":
      case "A4":
      case "A5":
        const audioIndex = parseInt(columnName.substring(1)) - 1;
        return userData?.["audio"]?.[audioIndex]?.["response"] ?? "";
      case "V1":
      case "V2":
      case "V3":
      case "V4":
      case "V5":
        const videoIndex = parseInt(columnName.substring(1)) - 1;
        return userData?.["video"]?.[videoIndex]?.["response"] ?? "";
      case "F1":
      case "F2":
      case "F3":
      case "F4":
      case "F5":
        const filtrationIndex = parseInt(columnName.substring(1)) - 1;
        return userData?.["filtration"]?.[filtrationIndex]?.["response"] ?? "";
      case "competancy":
        return userData?.["competancy"] ?? "";
      case "domainscore":
        return userData?.["domainScore"] ?? 0;
      case "audioscore":
        return userData?.["audioScore"]?.["audioScore"] ?? 0;
      case "softskillscore":
        return userData?.["softskillScore"] ?? 0;
      case "voice-pitch":
        return userData?.["audioScore"]?.["voicePitch"] ?? 0;
      case "speech-fluency":
        return userData?.["audioScore"]?.["speechFluency"] ?? 0;
      case "speaking-speed":
        return userData?.["audioScore"]?.["speakingSpeed"] ?? 0;
      case "pauses-per-15sec":
        return userData?.["audioScore"]?.["pausesPer15Sec"] ?? 0;
      case "audio-score":
        return userData?.["audioScore"]?.["audioScore"] ?? 0;
      case "Soft Skills Score":
        return userData?.["softskillScore"] ?? 0;
      case "rating":
        return userData?.["status"] ?? 0;
      default:
        // Handle MCQ questions by question text
        if (columnName && typeof columnName === 'string') {
          // Check if it's an MCQ question
          const mcqQuestions = questionsByTypes?.["mcq"] || [];
          const mcqIndex = mcqQuestions.findIndex(q => q?.questionText === columnName);
          if (mcqIndex !== -1) {
            return userData?.["mcq"]?.[mcqIndex]?.["response"] ?? "";
          }
          // Check if it's a video skill
          if (videoSkills?.includes(columnName)) {
            const skillIndex = videoSkills.indexOf(columnName);
            return userData?.["videoScore"]?.[skillIndex] ?? 0;
          }
        }
        return "";
    }
  }, [questionsByTypes, videoSkills]);

  const compareValues = useCallback((a, b, sortOrder) => {
    // Convert string sortOrder to boolean for comparison
    const isAscending = sortOrder === "true";
    
    // Handle numeric values
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    
    if (!isNaN(numA) && !isNaN(numB)) {
      return isAscending ? numA - numB : numB - numA;
    }
    
    // Handle string values
    const strA = String(a || "").toLowerCase();
    const strB = String(b || "").toLowerCase();
    
    if (isAscending) {
      return strA.localeCompare(strB);
    } else {
      return strB.localeCompare(strA);
    }
  }, []);

  const applyCustomSorting = useCallback((data) => {
    try {
      if (!customSortArray || customSortArray.length === 0) {
        return data;
      }

      if (!Array.isArray(data)) {
        return data;
      }

      const sortedData = [...data].sort((a, b) => {
        for (const sortConfig of customSortArray) {
          if (!sortConfig.columnName || !sortConfig.sortByAsc) {
            continue;
          }
          
          const valueA = getColumnValue(a, sortConfig.columnName);
          const valueB = getColumnValue(b, sortConfig.columnName);
          
          const comparison = compareValues(valueA, valueB, sortConfig.sortByAsc);
          if (comparison !== 0) {
            return comparison;
          }
        }
        return 0;
      });

      return sortedData;
    } catch (error) {
      return data;
    }
  }, [customSortArray, getColumnValue, compareValues]);

  const handleViewReportClick = () => {
    navigate("/candidate-report", {
      state: { selectedCandidateId, selectedJobId, selectedRoundId },
    });
  };

  const handlePlayPauseClick = (event, flag, setFlag, row, col) => {
    setAudioTranscriptPopupFlag("");
    setVideoTranscriptPopupFlag("");
    if (flag === row + "-" + col) {
      setFlag("");
    } else {
      setFlag(row + "-" + col);
    }
  };

  const handleScorePopupClick = (event, flag, setFlag, row) => {
    if (flag === row) {
      setFlag(-1);
    } else setFlag(row);
  };
  const handleClickOutside = (e) => {
    if (!e.target.closest(".popup") && !e.target.closest(".table")) {
      setPopup((prevPopup) => ({ ...prevPopup, isVisible: false }));
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      const job = tableDataPublished.find(
        (job) => job.jobId === parseInt(selectedJobId, 10)
      );
      setSelectedJob(job);
    }
  }, [selectedJobId, tableDataPublished]);

  const getInterviewerNames = (ids) => {
    return (
      ids?.map((id) => {
        const numericId = parseInt(id, 10);
        const interviewer = interviewrs?.find(
          (interviewer) => interviewer?.id === numericId
        );
        return interviewer;
        // ? `${interviewer?.firstName.trim()} ${interviewer?.lastName.trim()}`
        // : "Unknown";
      }) || []
    );
  };

  const interviewerNames = getInterviewerNames(selectedJob?.interviewers);

  useEffect(() => {
    const candidateStatusOpt = [];
    const list = [...interviewResultStatusList];
    setdisableUpdatedStatusCandidates({});
    setUpdatedStatusMap({});
    list?.sort((a, b) => b?.["id"] - a?.["id"]);
    candidateStatusOpt.push({ optionKey: "Select Status", optionValue: -1 });
    list?.forEach((element, index) => {
      candidateStatusOpt.push({
        optionKey: element?.["interviewStatus"] ?? "",
        optionValue: element?.["id"],
      });
    });
    candidateStatusOpt.push({
      optionKey: "Select Status",
      optionValue: 0,
    });

    setCandidateStatusOptions(candidateStatusOpt);
  }, [selectedQuestionsResponse]);

  useEffect(() => {
    let tableHeader = [];
    tableHeader.push({
      optionKey: "Applicant Name",
      optionValue: "applicantName",
      customTableName: 'Recruiter Round',
      allowFilter: true,
    });
    const selectedQueTypes = [];
    Object.entries(selectedQuestionsMap)?.forEach(([type, lst]) => {
      if (lst.some((val) => val)) selectedQueTypes.push(type);
    });
    setSelectedQueTypes(selectedQueTypes);

    if (
      selectedQueTypes.length === 3 ||
      (selectedQueTypes.includes("audio") && selectedQueTypes.includes("video"))
    ) {
      if (selectedQueTypes.includes("audio")) {
        const filteredArray = [];
        selectedQuestionsMap["audio"]?.forEach((item, i) => {
          if (item) {
            filteredArray.push({
              optionKey: `A${i + 1}`,
              optionValue: `A${i + 1}`,
              allowFilter: false,
            });
          }
        });
        tableHeader = [...tableHeader, ...filteredArray];
      }
      if (selectedQueTypes.includes("video")) {
        const filteredArray = [];
        selectedQuestionsMap["video"]?.forEach((item, i) => {
          if (item) {
            filteredArray.push({
              optionKey: `V${i + 1}`,
              optionValue: `V${i + 1}`,
              allowFilter: false,
            });
          }
        });
        tableHeader = [...tableHeader, ...filteredArray];
      }
      if (selectedQueTypes.includes("mcq")) {
        tableHeader.push({
          optionKey: "Competancy",
          optionValue: "competancy",
          allowFilter: false,
        });
        tableHeader.push({
          optionKey: "Domain Score",
          optionValue: "domainscore",
          allowFilter: false,
        });
      }

      if (selectedQueTypes.includes("audio"))
        tableHeader.push({
          optionKey: "Audio Score",
          optionValue: "audioscore",
          allowFilter: false,
        });
      if (selectedQueTypes.includes("video"))
        tableHeader.push({
          optionKey: "Soft Skill Score",
          optionValue: "softskillscore",
          allowFilter: false,
        });
    } else {
      if (selectedQueTypes.includes("mcq")) {
        const competancyH = [];
        selectedQuestionsMap["mcq"]?.forEach((booleanVal, index) => {
          if (booleanVal) {
            const val = questionsByTypes["mcq"]?.[index]?.["questionText"];
            competancyH.push({ optionKey: val, optionValue: val, allowFilter: false });
          }
        });
        competancyH.push({
          optionKey: "Domain Score",
          optionValue: "domainscore",
          allowFilter: false,
        });
        tableHeader = [...tableHeader, ...competancyH];
      }
      if (selectedQueTypes.includes("audio")) {
        const filteredArray = [];
        selectedQuestionsMap["audio"]?.forEach((item, i) => {
          if (item) {
            filteredArray.push({
              optionKey: `A${i + 1}`,
              optionValue: `A${i + 1}`,
              allowFilter: false,
            });
          }
        });
        tableHeader = [...tableHeader, ...filteredArray];
        const scoreInfo = [
          { optionKey: "Voice Pitch", optionValue: "voice-pitch", allowFilter: false },
          { optionKey: "Speech Fluency", optionValue: "speech-fluency", allowFilter: false },
          { optionKey: "Speaking Speed", optionValue: "speaking-speed", allowFilter: false },
          { optionKey: "Pauses Per 15Sec", optionValue: "pauses-per-15sec", allowFilter: false },
          { optionKey: "Audio Score", optionValue: "audio-score", allowFilter: false },
        ];
        tableHeader = [...tableHeader, ...scoreInfo];
      }
      if (selectedQueTypes.includes("video")) {
        const filteredArray = [];
        selectedQuestionsMap["video"]?.forEach((item, i) => {
          if (item) {
            filteredArray.push({
              optionKey: `V${i + 1}`,
              optionValue: `V${i + 1}`,
              allowFilter: false,
            });
          }
        });
        tableHeader = [...tableHeader, ...filteredArray];
        const scoreInfo = [];
        videoSkills?.forEach((skill) =>
          scoreInfo.push({ optionKey: skill, optionValue: skill, allowFilter: false })
        );
        tableHeader = [
          ...tableHeader,
          ...scoreInfo,
          { optionKey: "Soft Skills Score", optionValue: "Soft Skills Score", allowFilter: false },
        ];
      }
    }
    if (selectedQueTypes.includes("filtration")) {
      const filteredArray = [];
      selectedQuestionsMap["filtration"]?.forEach((item, i) => {
        if (item) {
          filteredArray.push({
            optionKey: `F${i + 1}`,
            optionValue: `F${i + 1}`,
            allowFilter: false,
          });
        }
      });
      tableHeader = [...tableHeader, ...filteredArray];
    }

    tableHeader.push({ optionKey: "Rating", optionValue: "rating", allowFilter: false });
    tableHeader.push({ optionKey: "Actions", optionValue: "actions" });
    setTableHeadValues(tableHeader);

    const updatedVal = {};
    filteredResponses.forEach((obj) => {
      updatedVal[obj?.["applicant"]?.["id"]] = {
        userId: obj?.["applicant"]?.["id"],
        status: obj?.["status"],
      };
    });
    setUpdatedStatusMap(updatedVal);
    setTotalItems(filteredResponses?.length ?? 0);
  }, [filteredResponses]);

  const paginatedResponses = useMemo(() => {
    // Apply custom sorting to filteredResponses
    const sortedData = applyCustomSorting(filteredResponses || []);
    
    const startIndex = (currentPage - 1) * showRows;
    const endIndex = startIndex + showRows;
    const paginatedData = sortedData.slice(startIndex, endIndex) || [];
    
    return paginatedData;
  }, [filteredResponses, currentPage, showRows, customSortArray]);

  // Reset to first page when showRows changes
  useEffect(() => {
    setCurrentPage(1);
  }, [showRows]);

  // Reset to first page when customSortArray changes
  useEffect(() => {
    setCurrentPage(1);
  }, [customSortArray]);

  const handleRowSelection = (index) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((row) => row !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const getOptionsText = (question, type, questionIndex) => {
    let textArr = [];
    const que = Object.entries(question);
    if (que.length > 0) {
      textArr = que[0][1].split(",").map((option) => {
        const optIndex = option.charCodeAt(0) - "a".charCodeAt(0);
        return (
          selectedQuestionsMap["filtration"]?.[questionIndex]?.["answers"]?.[
            optIndex
          ]?.["optionValue"] ?? "-"
        );
      });
    }
    return textArr.join(",");
  };

  const openWpModal = () => setisWpModelOpen(true);
  const closeWpModal = () => setisWpModelOpen(false);
  const openInterviewerModal = () => {
    dispatch(getJob({ jobId: selectedJobId }));
    dispatch(getAllInterviewrs());
    setIsInterviewerModalOpen(true);
  };
  const closeInterviewerModal = () => setIsInterviewerModalOpen(false);

  const openInterviewerModalRecruiter = async () => {
    setIsGeneratingPDFMail(true);
    await generateDownloadPDFtoMail();
    setIsGeneratingPDFMail(false);
    setIsInterviewerModalOpenRecruiter(true);
  };
  const closeInterviewerModalRecruiter = () =>
    setIsInterviewerModalOpenRecruiter(false);

  const openCandidateEmailModal = () =>
    setIsSendEmailToCandidateModelOpen(true);
  const closeCandidateEmailModal = () =>
    setIsSendEmailToCandidateModelOpen(false);

  const handleMouseEnter = (index) => {
    setHoveredCandidateIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredCandidateIndex(null);
  };

  const getStatusText = (val) => {
    if (val === "HR Reject") return "HR Rejected";
    else if (val === "filterRejected") return "Filter Reject";
    else return val;
  };

  const handleCheckApplicant = (isChecked) => {
    const updatedVal = {
      ...checkedCandidates,
      [selectedCandidateId]: isChecked,
    };
    setCheckedCandidates(updatedVal);
  };

  const handleStatusChange = async (e) => {
    const val = e.target?.value ?? 1;
    const updatedVal = {
      ...updatedStatusMap,
      [selectedCandidateId]: {
        userId: selectedCandidateId,
        status: Number(val),
      },
    };
    setUpdatedStatusMap(updatedVal);

    // Save rating immediately when dropdown is clicked
    if (Number(val) !== -1) { // Don't save if "Select Status" is selected
      setSavingRating(true);
      try {
        await dispatch(
          updateCandidateStatus({
            selectedJobId,
            selectedRoundId,
            statusData: [updatedVal[selectedCandidateId]],
            published: false, // Save rating but don't publish
          })
        );
        SuccessToast("Rating saved successfully!");
      } catch (error) {
        console.error('Error saving rating:', error);
        ErrorToast("Failed to save rating. Please try again.");
      } finally {
        setSavingRating(false);
      }
    }
  };

  const handlePublishStatus = (published) => {
    const statusData = [];
    const hasUpdates = Object.values(checkedCandidates).some((bool) => bool);
    if (hasUpdates) {
      if (published) {
        Object.entries(checkedCandidates).forEach(([key, value]) => {
          if (value && updatedStatusMap[key]) {
            if (updatedStatusMap[key]?.["status"] !== -1) {
              statusData.push(updatedStatusMap[key]);
            }
          }
        });
      } else {
        Object.entries(checkedCandidates).forEach(([key, value]) => {
          if (value) {
            statusData.push({ userId: key, status: 30 });
          }
        });
      }

      if (statusData?.length) {
        setDoPublishOrUnpublish(published);

        dispatch(
          updateCandidateStatus({
            selectedJobId,
            selectedRoundId,
            statusData,
            published,
          })
        );
      }
    } else WarningToast("Please check atleast one Candidate");
  };

  const handleInviteNextRound = () => {
    const arr = [];
    const hasUpdates = Object.values(checkedCandidates).some((bool) => bool);
    if (hasUpdates) {
      Object.entries(checkedCandidates).forEach(([key, value]) => {
        if (value) {
          arr.push(key);
        }
      });
      if (arr?.length) {
        const userIds = arr.join(",");
        dispatch(moveToNextRound({ selectedJobId, selectedRoundId, userIds }));
      }
    } else WarningToast("Please check atleast one Candidate");
  };

  const getCommaSeparatedCompetancy = (competancyList) => {
    const result =
      competancyList
        ?.reduce((acc, item) => {
          if (item?.["competancy"]) {
            acc.push(item?.["competancy"]);
          }
          return acc;
        }, [])
        .join(", ") ?? "-";
    return result === "" ? "-" : result;
  };

  const audioScoreObjtoArr = (audioScore) => {
    const arr = [];
    arr.push(audioScore?.["voicePitch"] ?? "-");
    arr.push(audioScore?.["speechFluency"] ?? "-");
    arr.push(audioScore?.["speakingSpeed"] ?? "-");
    arr.push(audioScore?.["pausePer15Sec"] ?? "-");
    return arr;
  };

  const videoScoreObjtoArr = (videoScore) => {
    const arr = videoScore?.map((score) => score?.["score"] ?? "-") ?? [];
    return arr;
  };

  const getStatusColor = (userData) => {
    const code =
      updatedStatusMap[userData["applicant"]?.["id"]]?.["status"] ??
      userData["status"] ??
      0;
    const color = statusColorCode?.[code] ?? "#ffffff";

    return color;
  };

  useEffect(() => {
    if (isStatusUpdateSuccessful) {
      let obj = { ...disableUpdatedStatusCandidates };
      Object.entries(checkedCandidates).forEach(([key, value]) => {
        if (value) {
          obj[key] = doPublishOrUnpublish;
        }
      });

      setdisableUpdatedStatusCandidates(obj);
      setCheckedCandidates({});
      dispatch(setIsStatusUpdateSuccessful(false));
    }
  }, [isStatusUpdateSuccessful]);

  const getCandidateList = () => {
    let arr = [];
    arr = filteredResponses?.map((row) => row?.["applicant"]);
    return arr;
  };

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const generateDownloadPDF = async () => {
    console.log("Starting PDF generation...");
    console.log("Current needData state:", needData);
    console.log("Current selectedCandidateId:", selectedCandidateId);
    
    setNeedData(true);
    setIsGeneratingPDF(true);
    await sleep(10000);
    
    console.log("After sleep, checking pageRef...");
    console.log("pageRef:", pageRef);
    console.log("pageRef.current:", pageRef.current);
    console.log("needData after setting:", needData);
    
    let input = pageRef.current;
    
    // Check if pageRef.current exists before accessing its properties
    if (!input) {
      console.error('pageRef.current is null or undefined. Trying retry...');
      console.log("needData state:", needData);
      console.log("selectedCandidateId:", selectedCandidateId);
      
      // Try waiting a bit more
      await sleep(5000);
      input = pageRef.current;
      
      if (!input) {
        console.error("pageRef.current is still null after retry. Component may not be rendered.");
        setIsGeneratingPDF(false);
        setNeedData(false);
        return;
      }
    }
    
    input.style.display = "block";
    input.style.position = "absolute";
    input.style.left = "-9999px";

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = { top: 10, bottom: 10 };
      console.log(input);
      console.log(pageRef.current);

      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = margin.top;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      setPdfVal(pdfBlob);

      pdf.save("documentttttt.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
      setNeedData(false); // Set needData to false after PDF generation is complete
    }
  };

  const generateDownloadPDFtoMail = async () => {
    setNeedData(true);
    setIsGeneratingPDFMail(true);
    await sleep(10000);
    const input = pageRef.current;
    
    // Check if pageRef.current exists before accessing its properties
    if (!input) {
      console.error('pageRef.current is null or undefined');
      setIsGeneratingPDFMail(false);
      setNeedData(false);
      return;
    }
    
    input.style.display = "block";
    input.style.position = "absolute";
    input.style.left = "-9999px";

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = { top: 10, bottom: 10 };
      console.log(input);
      console.log(pageRef.current);

      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      let heightLeft = imgHeight;
      let position = margin.top;

      pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const pdfBlob = pdf.output("blob");
      setPdfVal(pdfBlob);

      pdf.save("documentttttt.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDFMail(false);
      setNeedData(false); // Set needData to false after PDF generation is complete
    }
  };

  const handleSendEmailWhatsappCandidates = async () => {
    console.log("checked Candidates", checkedCandidates);
    console.log("filtered responses", filteredResponses);
    let result = "";
    result =
      Object.entries(checkedCandidates).reduce((res, [key, value]) => {
        if (value) {
          console.log("key", key, "value", value);
          const applicantList = filteredResponses.filter(
            (res) => res?.["applicant"]?.["id"] == key
          );

          if (applicantList.length) {
            const applicant = applicantList[0]?.["applicant"];
            const mobileNumber = applicant?.["mobileNumber1"]
              ? applicant?.["mobileNumber1"]
              : applicant?.["whatsappNumber"] ?? "";
            const email = applicant?.["primaryEmailId"]
              ? applicant?.["primaryEmailId"]
              : applicant?.["secondaryEmailId"] ?? "";
            const details =
              applicant?.["firstName"] + "," + mobileNumber + "," + email;
            res += details + "\n";
          }
        }
        return res;
      }, "") ?? "";
    console.log(
      "result is ",
      result,
      "selected candidate",
      selectedCandidateId
    );
    if (result === "") {
      const applicantList = filteredResponses.filter(
        (res) => res?.["applicant"]?.["id"] === selectedCandidateId
      );

      if (applicantList.length) {
        const applicant = applicantList[0]?.["applicant"];
        const mobileNumber = applicant?.["mobileNumber1"]
          ? applicant?.["mobileNumber1"]
          : applicant?.["whatsappNumber"] ?? "";
        const email = applicant?.["primaryEmailId"]
          ? applicant?.["primaryEmailId"]
          : applicant?.["secondaryEmailId"] ?? "";
        result = applicant?.["firstName"] + "," + mobileNumber + "," + email;
      }
    }

    await dispatch(setSelectedCandidateEmailWpInfo(result));
    await dispatch(getJob({ jobId: selectedJobId }));
    dispatch(selectJobId(selectedJobId));
    dispatch(setRoundName(selectedRoundId));
    navigate("/admin/invite-candidates");
  };

  const { rootColor } = useGlobalContext();

  const handleGetAllCandidates = async () => {
    // if (!jobId) return;
    dispatch(
      getAllInvitedCandidates({
        currentPage,
        showRows,
        filterArray,
        customSortArray,
      })
    );
  };

  useEffect(() => {
    handleGetAllCandidates();
  }, [showRows, currentPage, customSortArray, filterArray, jobId]);

  // Handle moveToNextRound response
  useEffect(() => {
    console.log('useEffect triggered - Status:', moveToNextRoundStatus, 'Response:', moveToNextRoundResponse);
    
    if (moveToNextRoundStatus === 'succeeded' && moveToNextRoundResponse) {
      console.log('Move to next round successful:', moveToNextRoundResponse);
      
      // Navigate to invite candidates page with the users data
      if (moveToNextRoundResponse.users && moveToNextRoundResponse.users.length > 0) {
        console.log('candidateInvitations :: ', moveToNextRoundResponse.users);
        
        // Transform the users data to match the expected format
        const candidateInvitations = moveToNextRoundResponse.users.map(user => ({
          emailAddress: user.primaryEmailId,
          username: user.userName,
          mobileNumber: user.mobileNumber1,
          whatsappNumber: user.whatsappNumber,
          interviewRound: selectedRoundId, // Use the current round ID
          vacancyLocations: "Multiple locations", // You might want to get this from somewhere
          agencyName: "Multiple agencies", // You might want to get this from somewhere
          // Add any other required fields
        }));
        
        // Set the jobId and roundName in Redux state
        dispatch(selectJobId(selectedJobId));
        dispatch(setRoundName(selectedRoundId));
        
        // Set the flags to trigger the API call
        dispatch(setIsGetJobsApiCalled(false));
        dispatch(setIsNotPublishedJobsApiCalled(false));
        
        navigate("/admin/invite-candidates?type=invited-candidates", {
          state: { candidateInvitations: candidateInvitations }
        });
        
        // Clear the response state to prevent re-navigation
        dispatch(clearMoveToNextRoundResponse());
      }
    } else if (moveToNextRoundStatus === 'failed' && moveToNextRoundError) {
      console.log('Move to next round failed:', moveToNextRoundError);
      // Handle error case if needed
    }
  }, [moveToNextRoundStatus, moveToNextRoundResponse, moveToNextRoundError, navigate]);

  // Clear the response state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearMoveToNextRoundResponse());
    };
  }, [dispatch]);

  return (
    <>
      {/* Debug: Move to Next Round Response Status */}
      {moveToNextRoundStatus !== 'idle' && (
        <div style={{ 
          padding: '10px', 
          margin: '10px', 
          backgroundColor: moveToNextRoundStatus === 'succeeded' ? '#d4edda' : '#f8d7da',
          border: `1px solid ${moveToNextRoundStatus === 'succeeded' ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <strong>Move to Next Round Status:</strong> {moveToNextRoundStatus}
          {moveToNextRoundResponse && (
            <div style={{ marginTop: '5px' }}>
              <strong>Response:</strong> 
              <div style={{ marginTop: '5px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                <pre>{JSON.stringify(moveToNextRoundResponse, null, 2)}</pre>
              </div>
              {moveToNextRoundResponse.users && (
                <div style={{ marginTop: '5px' }}>
                  <strong>Users Count:</strong> {moveToNextRoundResponse.users.length}
                </div>
              )}
            </div>
          )}
          {moveToNextRoundError && (
            <div style={{ marginTop: '5px', color: '#721c24' }}>
              <strong>Error:</strong> {JSON.stringify(moveToNextRoundError, null, 2)}
            </div>
          )}
        </div>
      )}
      
      {filteredResponses?.length !== 0 ? (
        <>
          <div className="right-sidebar candidate-rightwrapper-recruiter">
            <div className="container">
              <div className="showMastersData rec-dashboard-table">
                <TableComponent
                  tableName="RecruiterRoundScores"
                  tableHeadValues={tableHeadValues}
                  // tableData={tableData}
                  selectColumnList={tableHeadValues}
                  sortByOptionList={sortByOptionTable}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalItems={totalItems}
                  setTotalItems={setTotalItems}
                  searchValue={searchValue}
                  setSearchValue={setSearchValue}
                  showRows={showRows}
                  setShowRows={setShowRows}
                  showRowsList={showRowsList}
                  loading={isLoading}
                  setLoading={setIsLoading}
                  showCustomSort={showCustomSort}
                  setShowCustomSort={setShowCustomSort}
                  customSortArray={customSortArray}
                  setCustomSortArray={setCustomSortArray}
                  showFilter={showFilter}
                  setShowFilter={setShowFilter}
                  filterArray={filterArray}
                  setFilterArray={setFilterArray}
                  itemName="Roles"
                  isCandidateTableRecruiter={true}
                  isVCPLHeaderVisible={false}
                  selectedJobId={selectedJobId}
                  candidateTableRecruiterFooter={
                    <div className="candidate-table-footer-recruiter">
                      <button
                        id="rec-table-footer-btn"
                        onClick={() => handlePublishStatus(true)}
                      >
                        Publish
                      </button>
                      <button
                        id="rec-table-footer-btn"
                        onClick={() => handlePublishStatus(false)}
                      >
                        Unpublish
                      </button>
                      <button
                        id="rec-table-footer-btn"
                        onClick={openInterviewerModal}
                      >
                        Share
                      </button>
                      <button
                        id="rec-table-footer-btn"
                        onClick={handleInviteNextRound}
                      >
                        Next Round Invite
                      </button>
                      <button id="rec-table-footer-btn"
                      onClick={handleInviteNextRound}
                      >
                        Inform Next Round Shortlist
                      </button>
                    </div>
                  }
                >
                  {paginatedResponses && paginatedResponses?.length > 0 ? (
                    (paginatedResponses ?? []).map((userData, index) =>
                      selectedQueTypes.length === 3 ||
                      (selectedQueTypes.includes("audio") &&
                        selectedQueTypes.includes("video")) ? (
                        <tr
                          key={index}
                          onMouseEnter={() =>
                            setSelectedCandidateId(
                              userData?.["applicant"]?.["id"]
                            )
                          }
                          className="candidate-table-row-rec"
                        >
                          <td className="candidate-checkbox-td">
                            <label>
                              <input
                                type="checkbox"
                                class="filled-in"
                                checked={
                                  checkedCandidates[
                                    userData?.["applicant"]?.["id"]
                                  ]
                                }
                                onChange={(e) =>
                                  handleCheckApplicant(e.target.checked)
                                }
                              />
                              <span></span>
                            </label>
                            <i>
                              <img
                                style={{ width: "35px" }}
                                src={image.userProfileImage}
                              />
                            </i>
                            {userData?.["applicant"]?.["firstName"] +
                              " " +
                              userData?.["applicant"]?.["lastName"] ?? "-"}
                          </td>
                          {selectedQueTypes.includes("audio") &&
                            userData["audio"]?.map(
                              (audioResponse, colIndex) => (
                                <td className={"play-pause-wrapper"}>
                                  <EvuemeImageTag
                                    className={"play-pause-button"}
                                    imgSrc={
                                      audioPopupFlag === index + "-" + colIndex
                                        ? icon.pauseIconCircle
                                        : icon.playIconCircle
                                    }
                                    onClick={(e) =>
                                      handlePlayPauseClick(
                                        e,
                                        audioPopupFlag,
                                        setAudioPopupFlag,
                                        index,
                                        colIndex
                                      )
                                    }
                                  />{" "}
                                  {audioPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup audio-top">
                                      <AudioPopupModal
                                        audioFile={audioResponse?.["response"]}
                                        audioPopupClose={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            audioPopupFlag,
                                            setAudioPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                        audioTranscriptPopupToggle={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            audioTranscriptPopupFlag,
                                            setAudioTranscriptPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                  {audioTranscriptPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup transcript-bottom-wrapper">
                                      <div className="transcript-bottom-header">
                                        Transcription{" "}
                                        <span
                                          onClick={(e) =>
                                            handlePlayPauseClick(
                                              e,
                                              audioTranscriptPopupFlag,
                                              setAudioTranscriptPopupFlag,
                                              index,
                                              colIndex
                                            )
                                          }
                                        >
                                          x
                                        </span>
                                      </div>
                                      <div className="transcript-bottom-text">
                                        {audioResponse?.["transcription"]}
                                      </div>

                                      {}
                                    </div>
                                  )}
                                </td>
                              )
                            )}
                          {selectedQueTypes.includes("video") &&
                            userData["video"]?.map(
                              (videoResponse, colIndex) => (
                                <td className={"play-pause-wrapper"}>
                                  <EvuemeImageTag
                                    className={"play-pause-button"}
                                    imgSrc={icon.playIconRoundedRectangle}
                                    onClick={(e) =>
                                      handlePlayPauseClick(
                                        e,
                                        videoPopupFlag,
                                        setVideoPopupFlag,
                                        index,
                                        colIndex
                                      )
                                    }
                                  />
                                  {videoPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup video-top">
                                      <VideoPopupModal
                                        videoUrl={
                                          videoResponse?.["response"] ?? ""
                                        }
                                        videoPopupClose={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            videoPopupFlag,
                                            setVideoPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                        videoTranscriptPopupToggle={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            videoTranscriptPopupFlag,
                                            setVideoTranscriptPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                  {videoTranscriptPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup transcript-bottom-wrapper">
                                      <div className="transcript-bottom-header">
                                        Transcription{" "}
                                        <span
                                          onClick={(e) =>
                                            handlePlayPauseClick(
                                              e,
                                              videoTranscriptPopupFlag,
                                              setVideoTranscriptPopupFlag,
                                              index,
                                              colIndex
                                            )
                                          }
                                        >
                                          x
                                        </span>
                                      </div>
                                      <div className="transcript-bottom-text">
                                        {videoResponse?.["transcription"]}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              )
                            )}
                          {selectedQueTypes.includes("mcq") && (
                            <td>
                              {getCommaSeparatedCompetancy(userData["mcq"])}
                            </td>
                          )}
                          {selectedQueTypes.includes("mcq") && (
                            <td>{userData["domainScore"] ?? "-"}</td>
                          )}
                          {selectedQueTypes.includes("audio") && (
                            <td className={"play-pause-wrapper"}>
                              {userData["audioScore"]?.["audioScore"] ?? "-"}
                              <span
                                className="plus-char-yellow"
                                onClick={(e) =>
                                  handleScorePopupClick(
                                    e,
                                    audioScorePopupFlag,
                                    setAudioScorePopupFlag,
                                    index
                                  )
                                }
                              >
                                +
                              </span>
                              {audioScorePopupFlag === index && (
                                <div className="popup score-top">
                                  <TablePopupModal
                                    queType="Audio"
                                    headData={[
                                      "Voice Pitch",
                                      "Speech Fluency",
                                      "Speaking Speed",
                                      "Pauses Per 15Sec",
                                    ]}
                                    rowData={audioScoreObjtoArr(
                                      userData["audioScore"]
                                    )}
                                    onClose={(e) => {
                                      handleScorePopupClick(
                                        e,
                                        audioScorePopupFlag,
                                        setAudioScorePopupFlag,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </td>
                          )}
                          {selectedQueTypes.includes("video") && (
                            <td className={"play-pause-wrapper"}>
                              {userData["softskillScore"] ?? "-"}
                              <span
                                className="plus-char-yellow"
                                onClick={(e) =>
                                  handleScorePopupClick(
                                    e,
                                    videoScorePopupFlag,
                                    setVideoScorePopupFlag,
                                    index
                                  )
                                }
                              >
                                +
                              </span>
                              {videoScorePopupFlag === index && (
                                <div className="popup score-top">
                                  <TablePopupModal
                                    queType="Soft skills"
                                    headData={videoSkills}
                                    rowData={videoScoreObjtoArr(
                                      userData["videoScore"]
                                    )}
                                    onClose={(e) => {
                                      handleScorePopupClick(
                                        e,
                                        videoScorePopupFlag,
                                        setVideoScorePopupFlag,
                                        index
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </td>
                          )}
                          <td>
                            <div
                              style={{
                                "--statusColor": `${getStatusColor(userData)}`,
                              }}
                              className="rec-table-candidate-status"
                            >
                              <EvuemeSelectTag
                                value={
                                  updatedStatusMap[
                                    userData["applicant"]?.["id"]
                                  ]?.["status"] ??
                                  userData["status"] ??
                                  0
                                }
                                disabled={
                                  (disableUpdatedStatusCandidates[
                                    userData["applicant"]?.["id"]
                                  ] ??
                                  userData["published"] ??
                                  false) || savingRating
                                }
                                // firstOptionDisabled={true}
                                options={candidateStatusOptions}
                                onChange={(e) => handleStatusChange(e)}
                              />
                              {savingRating && selectedCandidateId === userData["applicant"]?.["id"] && (
                                <div style={{
                                  fontSize: '10px',
                                  color: '#2196f3',
                                  marginTop: '2px',
                                  fontStyle: 'italic'
                                }}>
                                
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <ul
                              class="viewmoreul-recruiter"
                              onMouseEnter={() => {
                                setHoveredCandidateIndex(index);
                                setSelectedCandidateId(
                                  paginatedResponses[index]?.applicant?.id
                                );
                              }}
                            >
                              <li>
                                <a class="viewmore-text" href="#!">
                                  View More
                                </a>
                                <ul class="dropdown-share-recruiter">
                                  <li>
                                    <a
                                      href="#!"
                                      style={{ padding: "7px" }}
                                      onClick={openInterviewerModal}
                                    >
                                      <i>
                                        <img src={icon.shareIconShareIcon} />
                                      </i>{" "}
                                      Share
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={handleViewReportClick}>
                                      <i>
                                        <img src={icon.reportShareIcon} />
                                      </i>{" "}
                                      View Report
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={generateDownloadPDF}>
                                      {/* <i>
                                        <img src={icon.pdfFilesIconShare} />
                                      </i>{" "} */}
                                      {isGeneratingPDF ? (
                                        <ClockLoader
                                          size={15}
                                          color={rootColor.primary}
                                          loading={isGeneratingPDF}
                                        />
                                      ) : (
                                        <i>
                                          <img
                                            src={icon.pdfFilesIconShare}
                                            alt="download position report"
                                          />
                                        </i>
                                      )}
                                      Download PDF Report
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#!"
                                      onClick={openInterviewerModalRecruiter}
                                    >
                                      {/* <i>
                                        <img src={icon.emailAddressIconShare} />
                                      </i>{" "} */}
                                      {isGeneratingPDFMail ? (
                                        <ClockLoader
                                          size={15}
                                          color={rootColor.primary}
                                          loading={isGeneratingPDFMail}
                                        />
                                      ) : (
                                        <i>
                                          <img
                                            src={icon.emailAddressIconShare}
                                            alt="download position report"
                                          />
                                        </i>
                                      )}
                                      Mail HTML Report
                                    </a>
                                  </li>
                                  {/* <li>
                                    <a href="#!">
                                      <i>
                                        <img
                                          src={
                                            icon.questionMarkCircleOutlineIconShare
                                          }
                                        />
                                      </i>{" "}
                                      View Question-wise Answers
                                    </a>
                                  </li> */}
                                  <li>
                                    <EvuemeModalTrigger modalId="interviewerAudioNote">
                                      <a href="#!">
                                        <i>
                                          <img
                                            src={icon.micMicrophoneIconShare}
                                          />
                                        </i>{" "}
                                        Add Assessor Voice Note
                                      </a>
                                    </EvuemeModalTrigger>
                                  </li>
                                  <li>
                                    <EvuemeModalTrigger modalId="interviewerTextNote">
                                      <a href="#!" style={{ padding: 0 }}>
                                        <i>
                                          <img
                                            src={
                                              icon.textDocumentCheckIconShare
                                            }
                                          />
                                        </i>{" "}
                                        Add Assessor Text Note
                                      </a>
                                    </EvuemeModalTrigger>
                                  </li>
                                  <li>
                                    <a
                                      style={{ padding: "7px" }}
                                      onClick={
                                        handleSendEmailWhatsappCandidates
                                      }
                                      // onClick={openWpModal}
                                    >
                                      <i>
                                        <img src={icon.whatsappIconShare} />
                                      </i>{" "}
                                      Send WA to Candidate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      style={{ padding: "7px" }}
                                      onClick={
                                        handleSendEmailWhatsappCandidates
                                      }
                                      // onClick={openCandidateEmailModal}
                                    >
                                      <i>
                                        <img src={icon.emailAddressIconShare} />
                                      </i>{" "}
                                      Send Email to Candidate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#!"
                                      className="hover-mobile-no"
                                      contact={
                                        userData["applicant"]?.[
                                          "mobileNumber1"
                                        ] ?? "-"
                                      }
                                    >
                                      <i>
                                        <img src={icon.phoneIconShare} />
                                      </i>
                                      <span> Speak to Candidate</span>
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={index}
                                                      onMouseEnter={() =>
                              setSelectedCandidateId(
                                paginatedResponses[index]?.applicant?.id
                              )
                            }
                          className="candidate-table-row-rec"
                        >
                          <td className="candidate-checkbox-td">
                            <label>
                              <input
                                type="checkbox"
                                class="filled-in"
                                checked={
                                  checkedCandidates[
                                    userData?.["applicant"]?.["id"]
                                  ]
                                }
                                onChange={(e) =>
                                  handleCheckApplicant(e.target.checked)
                                }
                              />
                              <span></span>
                            </label>
                            <i>
                              <img
                                style={{ width: "35px" }}
                                src={image.userProfileImage}
                              />
                            </i>
                            {userData?.["applicant"]?.["firstName"] +
                              " " +
                              userData?.["applicant"]?.["lastName"] ?? "-"}
                          </td>
                          {selectedQueTypes?.includes("filtration") &&
                            userData["filtration"].map((question, index) => (
                              <td>
                                {getOptionsText(
                                  question,
                                  "filtration",
                                  index
                                ) ?? "-"}
                              </td>
                            ))}
                          {selectedQueTypes.includes("mcq") &&
                            userData["mcq"]?.map((response) => (
                              <td>{response?.["averageScore"] ?? "-"}</td>
                            ))}
                          {selectedQueTypes.includes("mcq") && (
                            <td>{userData["domainScore"] ?? "-"}</td>
                          )}
                          {selectedQueTypes.includes("audio") &&
                            userData["audio"]?.map(
                              (audioResponse, colIndex) => (
                                <td className={"play-pause-wrapper"}>
                                  <EvuemeImageTag
                                    className={"play-pause-button"}
                                    imgSrc={
                                      audioPopupFlag === index + "-" + colIndex
                                        ? icon.pauseIconCircle
                                        : icon.playIconCircle
                                    }
                                    onClick={(e) =>
                                      handlePlayPauseClick(
                                        e,
                                        audioPopupFlag,
                                        setAudioPopupFlag,
                                        index,
                                        colIndex
                                      )
                                    }
                                  />{" "}
                                  {audioPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup audio-top">
                                      <AudioPopupModal
                                        audioFile={audioResponse?.["response"]}
                                        audioPopupClose={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            audioPopupFlag,
                                            setAudioPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                        audioTranscriptPopupToggle={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            audioTranscriptPopupFlag,
                                            setAudioTranscriptPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                  {audioTranscriptPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup transcript-bottom-wrapper">
                                      <div className="transcript-bottom-header">
                                        Transcription{" "}
                                        <span
                                          onClick={(e) =>
                                            handlePlayPauseClick(
                                              e,
                                              audioTranscriptPopupFlag,
                                              setAudioTranscriptPopupFlag,
                                              index,
                                              colIndex
                                            )
                                          }
                                        >
                                          x
                                        </span>
                                      </div>
                                      <div className="transcript-bottom-text">
                                        {audioResponse?.["transcription"]}
                                      </div>

                                      {}
                                    </div>
                                  )}
                                </td>
                              )
                            )}
                          {selectedQueTypes.includes("audio") && (
                            <td>
                              {userData["audioScore"]?.["voicePitch"] ?? "-"}
                            </td>
                          )}
                          {selectedQueTypes.includes("audio") && (
                            <td>
                              {userData["audioScore"]?.["speechFluency"] ?? "-"}
                            </td>
                          )}
                          {selectedQueTypes.includes("audio") && (
                            <td>
                              {userData["audioScore"]?.["speakingSpeed"] ?? "-"}
                            </td>
                          )}
                          {selectedQueTypes.includes("audio") && (
                            <td>
                              {userData["audioScore"]?.["pausePer15Sec"] ?? "-"}
                            </td>
                          )}
                          {selectedQueTypes.includes("audio") && (
                            <td>
                              {userData["audioScore"]?.["audioScore"] ?? "-"}
                            </td>
                          )}
                          {selectedQueTypes.includes("video") &&
                            userData["video"]?.map(
                              (videoResponse, colIndex) => (
                                <td className={"play-pause-wrapper"}>
                                  <EvuemeImageTag
                                    className={"play-pause-button"}
                                    imgSrc={icon.playIconRoundedRectangle}
                                    onClick={(e) =>
                                      handlePlayPauseClick(
                                        e,
                                        videoPopupFlag,
                                        setVideoPopupFlag,
                                        index,
                                        colIndex
                                      )
                                    }
                                  />
                                  {videoPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup video-top">
                                      <VideoPopupModal
                                        videoUrl={
                                          videoResponse?.["response"] ?? ""
                                        }
                                        videoPopupClose={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            videoPopupFlag,
                                            setVideoPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                        videoTranscriptPopupToggle={(e) =>
                                          handlePlayPauseClick(
                                            e,
                                            videoTranscriptPopupFlag,
                                            setVideoTranscriptPopupFlag,
                                            index,
                                            colIndex
                                          )
                                        }
                                      />
                                    </div>
                                  )}
                                  {videoTranscriptPopupFlag ===
                                    index + "-" + colIndex && (
                                    <div className="popup transcript-bottom-wrapper">
                                      <div className="transcript-bottom-header">
                                        Transcription{" "}
                                        <span
                                          onClick={(e) =>
                                            handlePlayPauseClick(
                                              e,
                                              videoTranscriptPopupFlag,
                                              setVideoTranscriptPopupFlag,
                                              index,
                                              colIndex
                                            )
                                          }
                                        >
                                          x
                                        </span>
                                      </div>
                                      <div className="transcript-bottom-text">
                                        {videoResponse?.["transcription"]}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              )
                            )}
                          {selectedQueTypes.includes("video") &&
                            userData["videoScore"]?.map((response) => (
                              <td>{response?.["score"] ?? "-"}</td>
                            ))}
                          {selectedQueTypes.includes("video") && (
                            <td>{userData["softskillScore"] ?? "-"}</td>
                          )}
                          <td>
                            <div
                              style={{
                                "--statusColor": `${getStatusColor(userData)}`,
                              }}
                              className="rec-table-candidate-status"
                            >
                              <EvuemeSelectTag
                                value={
                                  updatedStatusMap[
                                    userData["applicant"]?.["id"]
                                  ]?.["status"] ??
                                  userData["status"] ??
                                  0
                                }
                                disabled={
                                  (disableUpdatedStatusCandidates[
                                    userData["applicant"]?.["id"]
                                  ] ??
                                  userData["published"] ??
                                  false) || savingRating
                                }
                                // firstOptionDisabled={true}
                                options={candidateStatusOptions}
                                onChange={(e) => handleStatusChange(e)}
                              />
                              {savingRating && selectedCandidateId === userData["applicant"]?.["id"] && (
                                <div style={{
                                  fontSize: '10px',
                                  color: '#2196f3',
                                  marginTop: '2px',
                                  fontStyle: 'italic'
                                }}>
                                
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <ul
                              class="viewmoreul-recruiter"
                              onMouseEnter={() => {
                                setHoveredCandidateIndex(index);
                                setSelectedCandidateId(
                                  paginatedResponses[index]?.applicant?.id
                                );
                              }}
                            >
                              <li>
                                <a class="viewmore-text" href="#!">
                                  View More
                                </a>
                                <ul class="dropdown-share-recruiter">
                                  <li>
                                    <a
                                      href="#!"
                                      style={{ padding: "7px" }}
                                      onClick={openInterviewerModal}
                                    >
                                      <i>
                                        <img src={icon.shareIconShareIcon} />
                                      </i>{" "}
                                      Share
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={handleViewReportClick}>
                                      <i>
                                        <img src={icon.reportShareIcon} />
                                      </i>{" "}
                                      View Report
                                    </a>
                                  </li>
                                  <li>
                                    <a onClick={generateDownloadPDF}>
                                      {isGeneratingPDF ? (
                                        <ClockLoader
                                          size={15}
                                          color={rootColor.primary}
                                          loading={isGeneratingPDF}
                                        />
                                      ) : (
                                        <i>
                                          <img
                                            src={icon.pdfFilesIconShare}
                                            alt="download position report"
                                          />
                                        </i>
                                      )}
                                      Download PDF Report
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#!"
                                      onClick={openInterviewerModalRecruiter}
                                    >
                                      {/* <i>
                                        <img src={icon.emailAddressIconShare} />
                                      </i>{" "} */}
                                       {isGeneratingPDFMail ? (
                                        <ClockLoader
                                          size={15}
                                          color={rootColor.primary}
                                          loading={isGeneratingPDFMail}
                                        />
                                      ) : (
                                        <i>
                                          <img
                                            src={icon.emailAddressIconShare}
                                            alt="download position report"
                                          />
                                        </i>
                                      )}
                                      Mail HTML Report
                                    </a>
                                  </li>
                                  {/* <li>
                                    <a href="#!">
                                      <i>
                                        <img
                                          src={
                                            icon.questionMarkCircleOutlineIconShare
                                          }
                                        />
                                      </i>{" "}
                                      View Question-wise Answers
                                    </a>
                                  </li> */}
                                  <li>
                                    <EvuemeModalTrigger modalId="interviewerAudioNote">
                                      <a href="#!">
                                        <i>
                                          <img
                                            src={icon.micMicrophoneIconShare}
                                          />
                                        </i>{" "}
                                        Add Assessor Voice Note
                                      </a>
                                    </EvuemeModalTrigger>
                                  </li>
                                  <li>
                                    <EvuemeModalTrigger modalId="interviewerTextNote">
                                      <a href="#!" style={{ padding: 0 }}>
                                        <i>
                                          <img
                                            src={
                                              icon.textDocumentCheckIconShare
                                            }
                                          />
                                        </i>{" "}
                                        Add Assessor Text Note
                                      </a>
                                    </EvuemeModalTrigger>
                                  </li>
                                  <li>
                                    <a
                                      style={{ padding: "7px" }}
                                      // onClick={openWpModal}
                                      onClick={
                                        handleSendEmailWhatsappCandidates
                                      }
                                    >
                                      <i>
                                        <img src={icon.whatsappIconShare} />
                                      </i>{" "}
                                      Send WA to Candidate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      style={{ padding: "7px" }}
                                      // onClick={openCandidateEmailModal}
                                      onClick={
                                        handleSendEmailWhatsappCandidates
                                      }
                                    >
                                      <i>
                                        <img src={icon.emailAddressIconShare} />
                                      </i>{" "}
                                      Send Email to Candidate
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#!"
                                      className="hover-mobile-no"
                                      contact={
                                        userData["applicant"]?.[
                                          "mobileNumber1"
                                        ] ?? "-"
                                      }
                                    >
                                      <i>
                                        <img src={icon.phoneIconShare} />
                                      </i>
                                      <span> Speak to Candidate</span>
                                    </a>
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <p>loading...</p>
                  )}
                </TableComponent>
              </div>
            </div>

            <RecorderModal
              jobId={selectedJobId}
              userId={selectedCandidateId}
              selectedRoundId={selectedRoundId}
            />
            <CandidateWhatsappModal
              onClose={closeWpModal}
              onOpen={iswpModelOpen}
            />
            <CandidateEmailModal
              onClose={closeCandidateEmailModal}
              onOpen={isSendEmailToCandidateModelOpen}
              candidateRowIndex={hoveredCandidateIndex}
            />
            <InterviewerTextNote
              jobId={selectedJobId}
              userId={selectedCandidateId}
              selectedRoundId={selectedRoundId}
            />
            <InterviewerModalRecruiter
              selectedInterviewersInJob={selectedInterviewersInJob}
              onClose={closeInterviewerModal}
              statusList={candidateStatusOptions}
              onOpen={isInterviewerModalOpen}
              candidateList={getCandidateList()}
            />
            <InterviewModalPositionReport
              selectedInterviewersInJob={interviewerNames}
              attachmentFile={pdfVal}
              onClose={closeInterviewerModalRecruiter}
              statusList={""}
              onOpen={isInterviewerModalOpenRecruiter}
              candidateList={""}
            />
            <DownloadCandidateReport
              ref={pageRef}
              selectedCandidateId={selectedCandidateId}
              selectedJobId={selectedJobId}
              selectedRoundId={selectedRoundId}
              needData={needData}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            height: "50rem",
            display: "flex",
            justifyContent: "center",
            paddingTop: "5rem",
            fontSize: "2rem",
          }}
        >
          No Records Found
        </div>
      )}
    </>
  );
};

export default CandidateTableRecruiter;
