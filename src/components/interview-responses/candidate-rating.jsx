import { icon } from "../assets/assets";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../interceptors";
import InterviewModalPositionReport from "./interviewModalPositionReport";
import InterviewerTextNote from "../interview-responses-recruiter/interviewerTextNote";
import { baseUrl } from "../../config/config";
import PositionReport from "./positionReport";
import jsPDF from "jspdf";
import { ClockLoader } from "react-spinners";
import html2canvas from "html2canvas";
import M from "materialize-css";
import WarningToast from "../toasts/warning-toast";
import { updateCandidateStatus } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import CandidateScoreChange from "./candidate-score-change";
import SelectInputField from "../input-fields/select-input-field";
import EvuemeModalTrigger from "../modals/evueme-modal-trigger";
import DownloadPositionReport from "./DownloadPositionReport";
import { useDispatch, useSelector } from "react-redux";
import styles from './style.module.css'
const CHEATING_PROB_CONFIG = {
  high: { text: "HIGH", color: "red" },
  maybe: { text: "MAYBE", color: "#fcbc05" },
  none: { text: "", color: "white" },
};

const CandidateRating = ({ selectedQuestionData }) => {
  const [isAICommentModalOpen, setAICommentModalOpen] = useState(false);
  const [applicantList, setApplicantList] = useState([]);
  const [isInterviewerModalOpen, setIsInterviewerModalOpen] = useState(false);
  const [candidateFiltrations, setCandidateFiltrations] = useState([]);
  const navigate = useNavigate();
  const [needData, setNeedData] = useState(false);
  const [error, setError] = useState(null);
  const [domainScores, setDomainScores] = useState(null);
  const [roundScores, setRoundScores] = useState(null);
  const [AudioScores, setAudioScores] = useState(null);
  const [videoScores, setVideoScores] = useState(null);
  const [candidateCount, setCandidateCount] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPDFShare, setIsGeneratingPDFShare] = useState(false);
  const transcriptionModalRef = useRef(null);
  const [showTranscriptionPopup, setShowTranscriptionPopup] = useState(false);
  const [pdfVal,setPdfVal] = useState({});
  const [loading, setLoading] = useState(false);
  const [cheatingProb, setCheatingProb] = useState(
    CHEATING_PROB_CONFIG["none"]
  );



  const { selectedCandidateId, selectedRoundId, selectedJobId, candidateList } =
    useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);
  const dispatch = useDispatch();
  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const [interviewResults, setInterviewResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [comments, setComments] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const pageRef = useRef();
  const [hiringManagerComment, setHiringManagerComments] = useState("");

  const getCheatingProbSeverity = (cheatingProbVal) => {
    if (cheatingProbVal >= 85) return CHEATING_PROB_CONFIG["high"];
    else if (cheatingProbVal >= 70) return CHEATING_PROB_CONFIG["maybe"];
    else return CHEATING_PROB_CONFIG["none"];
  };


  useEffect(()=>{
        const list = candidateList?.map((row)=>{ 
          const val = row?.['firstName']+" "+row?.['lastName']+"("+row?.['id']+")";
          return {optionKey:val,
            optionValue:val
          };
        });
        setApplicantList(list);
      }, [candidateList]);
  
      useEffect(() => {
        // console.log("applicantList after setting: ", applicantList);
      }, [applicantList]);
    
    
  const openInterviewerModalReport = async () => {
setIsGeneratingPDFShare(true);
    await generatePDFShare();
    setIsGeneratingPDFShare(false);
    setIsInterviewerModalOpen(true);
  };
  const closeInterviewerModalReport = () => setIsInterviewerModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        transcriptionModalRef.current &&
        !transcriptionModalRef.current.contains(event.target)
      ) {
        setShowTranscriptionPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    if (selectedQuestionData?.cheatingProbability !== undefined) {
      setCheatingProb(
        getCheatingProbSeverity(selectedQuestionData.cheatingProbability)
      );
    }
  }, [selectedQuestionData]);

  useEffect(() => {
    if (selectedJobId) {
      const elems = document.querySelectorAll(".modal");
      M.Modal.init(elems);

      fetchDomainScores(selectedJobId);
      fetchRoundScores(selectedJobId);
      fetchAudioScores(selectedJobId);
      fetchVideoScores(selectedJobId);
      fetchCandidateCount(selectedJobId);
    } else {
      console.log("Job ID or Round ID not available yet.");
    }
  }, [selectedJobId]);

  const fetchDomainScores = async (selectedJobId, selectedRoundId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-domain-score/get`,
        {
          jobId: selectedJobId,
          interviewRound: "Recruiter Round",
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

  const fetchRoundScores = async (selectedJobId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-domain-score/get`,
        {
          jobId: selectedJobId,
        }
      );
      if (data) {
        setRoundScores(data);
      } else {
        setError(data.message || "Failed to fetch domain scores");
      }
    } catch (error) {
      setError(error.message || "Could not fetch domain scores");
    } finally {
      setLoading(false);
    }
  };

  const fetchAudioScores = async (selectedJobId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-audio-score/get`,
        {
          jobId: selectedJobId,
        }
      );
      if (data) {
        setAudioScores(data.roundSpecificDataDTO);
      } else {
        setError(data.message || "Failed to fetch audio scores");
      }
    } catch (error) {
      setError(error.message || "Could not fetch audio scores");
    } finally {
      setLoading(false);
    }
  };

  const fetchVideoScores = async (selectedJobId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-video-score/get`,
        {
          jobId: selectedJobId,
        }
      );
      if (data) {
        setVideoScores(data);
      } else {
        setError(data.message || "Failed to fetch domain scores");
      }
    } catch (error) {
      setError(error.message || "Could not fetch domain scores");
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateCount = async (selectedJobId) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-count/get`,
        {
          jobId: selectedJobId,
        }
      );

      if (data.status) {
        setCandidateCount(data.candidateCountViewDTO);
      } else {
        setError(data.message || "Failed to fetch candidate count");
      }
    } catch (error) {
      setError(error.message || "Could not fetch candidate count");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((selectedJobId, selectedRoundId)) {
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
        setError(data.message || "Failed to fetch interview results");
      }
    } catch (error) {
      setError(error.message || "Could not fetch interview results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtration = candidateFiltrations.find(
      (item) => item.user.id === selectedCandidateId
    );
    if (filtration) {
      setSelectedStatus(filtration.status);
    }
  }, [candidateFiltrations, selectedCandidateId]);

  useEffect(() => {
    if ((selectedJobId, selectedCandidateId)) {
      fetchHiringManagerCommnets(selectedJobId, selectedCandidateId);
    } else {
      console.log("Job ID or Round ID not available yet.");
    }
  }, [selectedJobId, selectedCandidateId]);

  const fetchHiringManagerCommnets = async (
    selectedJobId,
    selectedCandidateId
  ) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-status/get-note`,
        {
          jobId: selectedJobId,
          userId: selectedCandidateId,
        }
      );
      if (data) {
        setComments(data.candidateNotesResDTO);
      } else {
        setError(data.message || "Failed to fetch interview results");
      }
    } catch (error) {
      setError(error.message || "Could not fetch interview results");
    } finally {
      setLoading(false);
    }
  };

  const openAICommentModal = () => {
    setAICommentModalOpen(true);
  };

  const closeAICommentModal = () => {
    setAICommentModalOpen(false);
    setComments("");
    setHiringManagerComments("");
  };

  const interviewStatusOptions = interviewResults
    ? interviewResults.map((result) => ({
        optionKey: result.interviewStatus,
        optionValue: result.id,
      }))
    : [];

  const handleChange = (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    if (!newStatus) {
      WarningToast("Please select a valid status");
      return;
    }

    const statusData = [
      {
        userId: selectedCandidateId,
        status: newStatus,
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

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const input = pageRef.current;
    // Make content visible for rendering
    input.style.display = "block";
    input.style.position = "absolute";
    input.style.left = "-9999px";
    setTimeout(async () => {
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = { top: 10, bottom: 10 };
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
      // console.log("pdf",pdfBlob);
      pdf.save("position_report.pdf");
      setIsGeneratingPDF(false);
    }, 0);
  };

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const generatePDFShare = async () => {
    setNeedData(true);
    setIsGeneratingPDFShare(true);
    await sleep(1000); 
    const input = pageRef.current;
    // Make content visible for rendering
    input.style.display = "block";
    input.style.position = "absolute";
    input.style.left = "-9999px";
    try{
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = { top: 10, bottom: 10 };
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
      // console.log("pdf",pdfBlob);
      pdf.save("position_report.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDFShare(false);
      setNeedData(false);
    }
  };


  const generateViewPDF = async () => {
    // window.open('/position-report', '_blank');
    navigate("/position-report", {
      state: {
        roundScores,
        audioScores: AudioScores,
        videoScores,
        candidateCount,
      },
      ref: pageRef,
    });
  };

  const getSkillsForCandidate = (candidateId) => {
    const roundSpecificHashMap =
      domainScores?.roundSpecificHashMap?.["Recruiter Round"];
    const skillsData = roundSpecificHashMap?.[candidateId] || [];

    return {
      domainSkills: skillsData.filter((item) => item.skillType === "Domain"),
      softSkills: skillsData.filter((item) => item.skillType === "Soft"),
    };
  };

  return (
    <>
      <div ref={pageRef} style={{ display: "none" }}>
        <PositionReport />
      </div>

      <div className="box-main-bg" style={{ paddingBottom: "2.2rem"}}>
        <div style={{textAlign:"center", margin:"0 auto", width:"80%"}}>
          <h4>EvueMe AI Rating</h4>
          <div
            className="scoregraph-wr scoregraph-cus"
            style={{ width: "100%", marginRight: 0 ,}}
          >
            <div className="multigraph">
              <span
                className="graph "
                style={{
                  "--score": `${
                    ((selectedQuestionData?.aiScore ?? 0) * 180) / 100
                  }deg`,
                }}
              >
                {selectedQuestionData?.aiScore ?? 0}
              </span>
              <span
                className="circle"
                style={{
                  "--scoree": `${
                    ((selectedQuestionData?.aiScore ?? 0) * 158) / 100 - 3
                  }deg`,
                }}
              >
                <span className="ball"></span>
              </span>
            </div>
            <p>{selectedQuestionData?.competancy ?? "-"}</p>
          </div>
          </div>

         
          {/* <div className="cheating-wr">
            <h4>Cheating Probability</h4>
            <div
              class="btn-cheat"
              style={{
                display: "flex",
                alignItems: "center",
                borderColor: cheatingProb.color,
                flexDirection: "row",
              }}
            >
              <span style={{ paddingRight: "3px", color: cheatingProb.color }}>
                {cheatingProb.text}
              </span>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: cheatingProb.color,
                }}
              ></span>
            </div>
          </div> */}




        
        <aside className="input-field textarea-full">
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
            style={{textAlign:"left"}}
            value={selectedQuestionData?.aiComment ?? ""}
            className={`materialize-textarea aicomments-rating ${styles['scrollable-textarea']}`}
            readOnly={true}
          ></textarea>
          <label for="aicomments" className="active">
            <i>
              <img src={icon.commentblogIconsvg} alt="aiComment" />
            </i>{" "}
            EvueMe AI Comments
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
                {selectedQuestionData?.aiComment ?? ""}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="box-main-bg boxmainmargin">
        <h4>Interviewer Action</h4>
        <div className="row row-margin">
          <SelectInputField
            labelText={"Rate Candidate"}
            divTagCssClasses="col xl12 l12 m12 s12 publish-field"
            value={selectedStatus}
            onChange={handleChange}
            options={interviewStatusOptions}
            disabled={selectedStatus === 14}
          />
          <aside className="col xl12 l12 m12 s12">
            <EvuemeModalTrigger modalId="interviewerTextNote">
              <a
                href="#"
                className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
                data-position="top"
                data-tooltip="Hiring Manager Comments"
              >
                <i>
                  <img
                    src={icon.commentblogIconsvg}
                    style={{ width: "19px" }}
                    alt="Hiring Manager Comments"
                  />
                </i>
              </a>
            </EvuemeModalTrigger>
            {/* <span style={{ position: "relative" }}> */}
            {/* <EvuemeModalTrigger modalId={comments.recruiterNoteAudio || comments.recruiterNote ? (comments.recruiterNoteAudio ? "interviewerAudioNote" : "interviewerTextNote") : "interviewerAudioNote"}> */}

            {/* </EvuemeModalTrigger> */}
            {/* {showTranscriptionPopup && (
								<TranscriptionPopupModal
									transcription={hiringManagerComment}
									onClose={handleCloseTranscription}
									ref={transcriptionModalRef}
								/>
							)} */}
            {/* </span> */}
            <EvuemeModalTrigger modalId="scoreChange">
              <a
                href="#"
                className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
                data-position="top"
                data-tooltip="Change Score"
              >
                <i>
                  <img src={icon.changeScoreIcon} alt="change score" />
                </i>
              </a>
            </EvuemeModalTrigger>

            <span style={{ position: "relative" }}>
              <a
                className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
                data-position="top"
                data-tooltip="Download Position Report"
                onClick={generatePDF}
              >
                {isGeneratingPDF ? (
                  <ClockLoader
                    size={20}
                    color={"#ffffff"}
                    loading={isGeneratingPDF}
                  />
                ) : (
                  <i>
                    <img
                      src={icon.downloadPositionReportIcon}
                      alt="download position report"
                    />
                  </i>
                )}
                {/* <i><img src={icon.downloadPositionReportIcon} alt="download position report"/></i> */}
              </a>
              {/* <i><img src={icon.downloadPositionReportIcon} alt="download position report" /></i> */}
              {/* </a> */}
              {/* <span style={{position: "absolute"}}>
							{isGeneratingPDF && (
								<div className="clock-loader-container">
									<CustomClockLoader size={16} />
								</div>
							)} */}
              {/* </span> */}
            </span>
            <a
              href="#"
              className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
              data-position="top"
              data-tooltip="Share Position Report"
              onClick={openInterviewerModalReport}
              // onClick={generateViewPDF}
            >
              {/* <i>
                <img
                  src={icon.sharePositionReportIcon}
                  alt="share position report"
                />
              </i> */}
              {isGeneratingPDFShare ? (
                  <ClockLoader
                    size={20}
                    color={"#ffffff"}
                    loading={isGeneratingPDFShare}
                  />
                ) : (
                  <i>
                    <img
                      src={icon.sharePositionReportIcon}
                      alt="Share position report"
                    />
                  </i>
                )}
            </a>
          </aside>
        </div>
      </div>
      <CandidateScoreChange
        jobId={selectedJobId}
        userId={selectedCandidateId}
        selectedQuestionData={selectedQuestionData}
      />
      <InterviewerTextNote
        jobId={selectedJobId}
        userId={selectedCandidateId}
        selectedRoundId={selectedRoundId}
      />
      <DownloadPositionReport
        pageRef={pageRef}
        roundScores={roundScores}
        audioScores={AudioScores}
        videoScores={videoScores}
        candidateCount={candidateCount}
      />
      <InterviewModalPositionReport
        selectedInterviewersInJob={interviewerNames}
        attachmentFile={pdfVal}
        onClose={closeInterviewerModalReport}
        statusList={interviewStatusOptions}
        onOpen={isInterviewerModalOpen}
        candidateList={applicantList}
      />
    </>
  );
};

export default CandidateRating;
