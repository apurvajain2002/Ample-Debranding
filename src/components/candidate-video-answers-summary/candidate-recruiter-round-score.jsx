import SelectInputField from "../input-fields/select-input-field";
import { useState, useEffect, useRef } from "react";
import PositionReport from "../interview-responses/positionReport";
// import CandidateScoreChange from "../interview-responses/candidate-score-change";
import InterviewerModalSummaryPage from "./interviewerModalSummaryPage";
import InterviewModalPositionReport from "../interview-responses/interviewModalPositionReport";
import { icon } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ClockLoader } from "react-spinners";
import axiosInstance from "../../interceptors";
import { useDispatch, useSelector } from "react-redux";
import InterviewerTextNote from "../interview-responses-recruiter/interviewerTextNote";
import { updateCandidateStatus } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import WarningToast from "../toasts/warning-toast";
import EvuemeModalTrigger from "../modals/evueme-modal-trigger";
import RecorderModal from "../interview-responses-recruiter/recorder-modal";
import { baseUrl } from "../../config/config";
import M from "materialize-css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DownloadCandidateReport from "../../screens/candidate-report/report-page-pdf";

const CandidateRecruiterRoundScore = ({ selectedQuestionData }) => {
  const [candidateFiltrations, setCandidateFiltrations] = useState([]);
  const [pdfVal,setPdfVal] = useState({});
  const [applicantList, setApplicantList] = useState([]);
  const navigate = useNavigate();
  const [isInterviewerModalOpen, setIsInterviewerModalOpen] = useState(false);
  const [isInterviewerModalOpenSummary, setIsInterviewerModalOpenSummary] = useState(false);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isGeneratingPDFMail, setIsGeneratingPDFMail] = useState(false);
  const [domainScores, setDomainScores] = useState(null);
  const [videoScores, setVideoScores] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const [needData, setNeedData] = useState(false);

  const [interviewResults, setInterviewResults] = useState([]);
  const pageRef = useRef();

  const [loading, setLoading] = useState(false);

  const {
    interviewResponsesL1DashboardSliceReducer: {
      selectedJobId,
      selectedCandidateId,
      selectedRoundId,
      candidateList,
    },
    interviewResponsesRecruiterDashboardSliceReducer: {
      interviewResultStatusList,
    },
  } = useSelector((state) => state);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (selectedJobId) {
      const elems = document.querySelectorAll(".modal");
      M.Modal.init(elems);

      fetchDomainScores(selectedJobId);
      fetchVideoScores(selectedJobId);
    } else {
      console.log("Job ID or Round ID not available yet.");
    }
  }, [selectedJobId]);

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
    if (selectedCandidateId && candidateList.length > 0) {
      const matchedCandidates = candidateList
        .filter(
          (candidate) => candidate.id === parseInt(selectedCandidateId, 10)
        )
        .map((candidate) => ({
          optionKey: `${candidate.firstName} ${candidate.lastName}(${candidate.id})`,
          optionValue: `${candidate.firstName} ${candidate.lastName}(${candidate.id})`,
        }));

      setApplicantList(matchedCandidates);
    } else {
      setApplicantList([]); // Clear if no matching candidate is found or candidateList is empty
    }
  }, [selectedCandidateId, candidateList]);

  const openInterviewerModal = async () => {
    setIsInterviewerModalOpen(true);
  };

  const closeInterviewerModal = () => setIsInterviewerModalOpen(false);

  const openInterviewerModalSummary = async () => {
    setIsGeneratingPDFMail(true);
    await generateDownloadPDFtoMail();
    setIsGeneratingPDFMail(false); 
    setIsInterviewerModalOpenSummary(true);
  };

  const closeInterviewerModalSummary = () => setIsInterviewerModalOpenSummary(false);

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

  const interviewStatusOptions = interviewResults
    ? interviewResults.map((result) => ({
        optionKey: result.interviewStatus,
        optionValue: result.id,
      }))
    : [];

  const handleViewReportClick = () => {
    navigate("/candidate-report", {
      state: { selectedCandidateId, selectedJobId, selectedRoundId },
    });
  };

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  const generateDownloadPDF = async () => {
    setNeedData(true);
    setIsGeneratingPDF(true);
    await sleep(10000);
    const input = pageRef.current;
    
    // Check if pageRef.current exists before accessing its properties
    if (!input) {
      console.error('pageRef.current is null or undefined');
      setIsGeneratingPDF(false);
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
      // console.log(input);
      // console.log(pageRef.current);
      
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
      setNeedData(false); 
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
      setNeedData(false);
    }
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

  const { domainSkills, softSkills } =
    getSkillsForCandidate(selectedCandidateId);

  const getSkillsForCandidateRecruiter = (candidateId) => {
    const roundSpecificHashMap =
      videoScores?.roundSpecificHashMap?.["Recruiter Round"];
    const skillsData = roundSpecificHashMap?.[candidateId] || [];

    return {
      softSkillsRecruiter: skillsData.filter(
        (item) => item.skillType === "Softs"
      ),
    };
  };

  const { domainSkillsRecruiter, softSkillsRecruiter } =
    getSkillsForCandidateRecruiter(selectedCandidateId);

  return (
    <>
      {!domainSkills.length > 0 && !softSkillsRecruiter.length > 0 && (
        <div className="box-main-bg summary-page" style={{ height: "18.4rem" }}>
          <h4 className="recruiter">Recruiter Round Score</h4>
          <p style={{ fontSize: "12px", fontWeight: "250" }}>
            No skills available for this round
          </p>
        </div>
      )}

      {domainSkills.length > 0 && softSkillsRecruiter.length > 0 && (
        <div className="box-main-bg summary-page">
          <h4 className="recruiter">Recruiter Round Score</h4>
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
                      "--score": `${
                        ((skill?.averageScore ?? 0) * 180) / 100
                      }deg`,
                    }}
                  >
                    {skill?.averageScore % 1 === 0
                      ? skill.averageScore
                      : skill.averageScore.toFixed(1) ?? 0}
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
            {softSkillsRecruiter.map((skill, index) => (
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

      {domainSkills.length > 0 && !softSkillsRecruiter.length > 0 && (
        <div className="box-main-bg summary-page">
          <h4 className="recruiter">Recruiter Round Score</h4>
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
                      "--score": `${
                        ((skill?.averageScore ?? 0) * 180) / 100
                      }deg`,
                    }}
                  >
                    {skill?.averageScore % 1 === 0
                      ? skill.averageScore
                      : skill.averageScore.toFixed(1) ?? 0}
                  </span>
                </div>
                <p>{skill?.competancy || "-"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {softSkillsRecruiter.length > 0 && !domainSkills.length > 0 && (
        <div className="box-main-bg summary-page">
          <h4 className="recruiter">Recruiter Round Score</h4>
          <div
            className="score-wrapper"
            style={{ height: "13.4rem", overflow: "auto" }}
          >
            <h5>Soft Skills</h5>
            {softSkillsRecruiter.map((skill, index) => (
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

      <div className="box-main-bg boxmainmargin" style={{ minHeight: "12rem" }}>
        <h4 className="recruiter">Recruiter Action</h4>
        <div className="row row-margin" style={{ marginTop: 0 }}>
          <SelectInputField
            labelText={"Rate Candidate"}
            divTagCssClasses="col xl12 l12 m12 s12 publish-field"
            value={selectedStatus}
            onChange={handleChange}
            options={interviewStatusOptions}
            disabled={selectedStatus === 14}
          />

          <aside className="col xl12 l12 m12 s12">
            <ul className="enhance-sectionul interview-actionul">
              <EvuemeModalTrigger modalId="interviewerAudioNote">
                <li className="active">
                  <a href="#">
                    <i>
                      <img src={icon.enhanceAudioIcon} />
                    </i>
                    <p>Add Voice Note</p>
                  </a>
                </li>
              </EvuemeModalTrigger>
              <EvuemeModalTrigger modalId="interviewerTextNote">
                <li style={{ margin: "0 5px" }}>
                  <a href="#">
                    <i>
                      <img src={icon.enhanceTextIcon} />
                    </i>
                    <p>Add Text Note</p>
                  </a>
                </li>
              </EvuemeModalTrigger>
              <a
                className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
                data-position="top"
                data-tooltip="Download Candidate Report"
                onClick={generateDownloadPDF}
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
                      alt="download candidate report"
                    />
                  </i>
                )}
              </a>

              <a
                className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped "
                data-position="top"
                data-tooltip="Share Candidate Report"
                onClick={openInterviewerModalSummary}
              >
                {isGeneratingPDFMail ? (
                  <ClockLoader
                    size={20}
                    color={"#ffffff"}
                    loading={isGeneratingPDFMail}
                  />
                ) : (
                  <i>
                    <img
                      src={icon.sharePositionReportIcon}
                      alt="Share candidate report"
                    />
                  </i>
                )}
              </a>

                <a
                  className="waves-effect waves-light btn btn-clear btn-submit btn-small-can-rating noborder changescore-btn tooltipped"
                  data-position="top"
                  data-tooltip="Share Candidate Summary"
                  onClick={openInterviewerModal}
                >
                  <i>
                    <img src={icon.changeScoreIcon} />
                  </i>
                </a>
            </ul>
          </aside>
        </div>
        <RecorderModal
          jobId={selectedJobId}
          userId={selectedCandidateId}
          selectedRoundId={selectedRoundId}
        />
        <InterviewerTextNote
          jobId={selectedJobId}
          userId={selectedCandidateId}
          selectedRoundId={selectedRoundId}
        />
        <DownloadCandidateReport
          pageRef={pageRef}
          selectedCandidateId={selectedCandidateId}
          selectedJobId={selectedJobId}
          selectedRoundId={selectedRoundId}
          needData={needData}
        />
        <InterviewerModalSummaryPage
          selectedInterviewersInJob={interviewerNames}
          onClose={closeInterviewerModal}
          statusList={interviewStatusOptions}
          onOpen={isInterviewerModalOpen}
          candidateList={applicantList}
        />
        <InterviewModalPositionReport
          selectedInterviewersInJob={interviewerNames}
          attachmentFile={pdfVal}
          onClose={closeInterviewerModalSummary}
          statusList={interviewStatusOptions}
          onOpen={isInterviewerModalOpenSummary}
          candidateList={applicantList}
        />
      </div>
    </>
  );
};

export default CandidateRecruiterRoundScore;