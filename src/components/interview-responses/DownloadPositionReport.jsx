import { image, icon } from "../assets/assets";
import { useSelector } from "react-redux";
import { useState, useEffect, forwardRef } from "react";
 
const DownloadPositionReport = forwardRef((props, ref) => {
  const tableDataPublished = useSelector(
    (state) => state.createNewJobSliceReducer.tableDataPublished
  );
  const { interviewrs } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  const { roundScores, audioScores, videoScores, candidateCount, pageRef } = props;
  const [round1DomainScores, setRound1DomainScores] = useState([]);
  const [round2DomainScores, setRound2DomainScores] = useState([]);
  const [round2SoftSkillsScores, setRound2SoftSkillsScores] = useState([]);
  const [round1DomainSkills, setRound1DomainSkills] = useState([]);
  const [round2DomainSkills, setRound2DomainSkills] = useState([]);
  const [round2SoftSkills, setRound2SoftSkills] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [round1SoftSkills, setRound1SoftSkills] = useState([]);
  const [round1SoftSkillsScores, setRound1SoftSkillsScores] = useState([]);
  const [isWeightageSectionVisible, setIsWeightageSectionVisible] =
    useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
 
  const [round2TechnicalRatio, setRound2TechnicalRatio] = useState(50); // 50%
  const [round2SoftSkillsRatio, setRound2SoftSkillsRatio] = useState(30); // 30%
  const [round1Ratio, setRound1Ratio] = useState(20); // 20%

  const {
    selectedJobId,
  } = useSelector((state) => state.interviewResponsesL1DashboardSliceReducer);


  useEffect(() => {
    if (selectedJobId) {
      const job = tableDataPublished.find(
        (job) => job.jobId === parseInt(selectedJobId, 10)
      )
      setSelectedJob(job);
    }
  }, [selectedJobId, tableDataPublished]);

  // useEffect(() => {
  //   if (selectedJob) {
  //     console.log("Selected Job=> NAME :::::::  ", selectedJob);
  //   }
  // }, [selectedJob]);



  const getInterviewerNames = (ids) => {
    const names = ids?.map(id => {
      const numericId = parseInt(id, 10);
      const interviewer = interviewrs?.find(interviewer => interviewer?.id === numericId);
      return interviewer
        ? `${interviewer?.firstName.trim()} ${interviewer?.lastName.trim()}`
        : 'Unknown';
    });

    return names?.join(', ');
  };

  const interviewerNames = getInterviewerNames(selectedJob?.interviewers);

  const getRecruiterNames = (recruiters) => {
    return recruiters?.join(", ") || "-";
  };
  // Log the recruiter names

  const recName = getRecruiterNames(selectedJob?.recruiterName);
 
  // Calculate Weighted Average Score
  const calculateWeightedAverage = (
    round2TechnicalScore,
    round2SoftSkillScore,
    round1TechnicalScore
  ) => {
    return (
      round2TechnicalScore * (round2TechnicalRatio / 100) +
      round2SoftSkillScore * (round2SoftSkillsRatio / 100) +
      round1TechnicalScore * (round1Ratio / 100)
    );
  };
 
  // Round 1 and Round 2 Data fetching
  useEffect(() => {
    if (roundScores) {
      const round1Data =
        roundScores.roundSpecificHashMap["Recruiter Round"] || {};
      const round1DataLength =
        roundScores.roundSpecificSkills["Recruiter Round"]?.domainList.length;
 
      // Round 1 Domain Skills (Recruiter Round)
      const round1DomainSkills =
        roundScores.roundSpecificSkills["Recruiter Round"]?.domainList || [];
      setRound1DomainSkills(round1DomainSkills);
 
      // Round 1 Domain Scores (Recruiter Round)
      const round1Domain = Object.keys(round1Data).map((userId) => {
        const userData = round1Data[userId];
        const domainScores = userData.filter(
          (entry) => entry.skillType === "Domain"
        );
 
        // const averageDomainScore = domainScores.reduce((acc, curr) => acc + (curr.averageScore || 0), 0) / domainScores.length;
        const totalDomainScore = domainScores.reduce((acc, curr) => {
          const score =
            curr.averageScore === "-" ||
            curr.averageScore === null ||
            curr.averageScore === undefined
              ? 0
              : curr.averageScore;
          return acc + score;
        }, 0);
 
        const averageDomainScore =
          domainScores.length > 0
            ? (totalDomainScore / round1DataLength).toFixed(1)
            : 0;
        const userName =
          userData.find((entry) => entry.userName)?.userName || "Unknown User";
 
        const rowData = {
          userId,
          userName,
          scores: domainScores.map((score) => ({
            competency: score.competancy,
            score: score.averageScore === "-" ? 0 : score.averageScore,
          })),
          averageDomainScore,
        };
        return rowData;
      });
 
      setRound1DomainScores(round1Domain);
    } else {
      console.log("No roundScores data passed.");
    }
  }, [roundScores]);
 
  // Fetching Round 2 Data from Video Scores
  useEffect(() => {
    if (videoScores) {
      const round2Data =
        videoScores.roundSpecificHashMap["L1 Hiring Manager Round"] || {};
      // console.log("videoScores ==>>>>>>>>>>>   ", videoScores);
 
      const round2DataLengthSoft =
        videoScores.roundSpecificSkills["L1 Hiring Manager Round"]
          ?.softSkillList.length;
      // console.log(
      //   "videoScores skill length==>>>>>>>>>>>   ",
      //   round2DataLengthSoft
      // );
 
      const round2DataLengthDomain =
        videoScores.roundSpecificSkills["L1 Hiring Manager Round"]?.domainList
          .length;
      // console.log("round 2 data length ==>>> ", round2DataLength);
 
      // Round 2 Domain Skills (L1 Hiring Manager Round)
      const round2DomainSkills =
        videoScores.roundSpecificSkills["L1 Hiring Manager Round"]
          ?.domainList || [];
      setRound2DomainSkills(round2DomainSkills);
 
      // Round 2 Soft Skills (L1 Hiring Manager Round)
      const round2SoftSkillsList =
        videoScores.roundSpecificSkills["L1 Hiring Manager Round"]
          ?.softSkillList || [];
      setRound2SoftSkills(round2SoftSkillsList);
 
      // Round 2 Domain Scores (L1 Hiring Manager Round)
      const round2Domain = Object.keys(round2Data).map((userId) => {
        const userData = round2Data[userId];
        const domainScores = userData.filter(
          (entry) => entry.skillType === "Domain"
        );
        // const averageDomainScore = domainScores.reduce((acc, curr) => acc + (curr.score || 0), 0) / domainScores.length;
        const totalDomainScore = domainScores.reduce((acc, curr) => {
          const score =
            curr.score === "-" ||
            curr.score === null ||
            curr.score === undefined
              ? 0
              : curr.score;
          return acc + score;
        }, 0);
 
        const averageDomainScore =
          domainScores.length > 0
            ? (totalDomainScore / round2DataLengthDomain).toFixed(1)
            : 0;
        const userName =
          userData.find((entry) => entry.userName)?.userName || "Unknown User";
 
        const rowData = {
          userId,
          userName,
          scores: domainScores.map((score) => ({
            competency: score.competancy,
            score: score.score === "-" ? 0 : score.score,
          })),
          averageDomainScore,
        };
        return rowData;
      });
 
      setRound2DomainScores(round2Domain);
 
      // Round 2 Soft Skills Scores
      const round2SoftSkillsScoresList = Object.keys(round2Data).map(
        (userId) => {
          const userData = round2Data[userId];
          const softSkills = userData.filter(
            (entry) => entry.skillType === "Soft"
          );
          // const averageSoftSkillScore = softSkills.reduce((acc, curr) => acc + (curr.score || 0), 0) / softSkills.length;
          const totalSoftSkillScore = softSkills.reduce((acc, curr) => {
            const score =
              curr.score === "-" ||
              curr.score === null ||
              curr.score === undefined
                ? 0
                : curr.score;
            return acc + score;
          }, 0);
 
          const averageSoftSkillScore =
            softSkills.length > 0
              ? (totalSoftSkillScore / round2DataLengthSoft).toFixed(1)
              : 0;
 
          const userName =
            userData.find((entry) => entry.userName)?.userName ||
            "Unknown User";
 
          const rowData = {
            userId,
            userName,
            scores: softSkills.map((skill) => ({
              competency: skill.competancy,
              score: skill.score === "-" ? 0 : skill.score,
            })),
            averageSoftSkillScore,
          };
          return rowData;
        }
      );
 
      setRound2SoftSkillsScores(round2SoftSkillsScoresList);
    } else {
      console.log("No videoScores data passed.");
    }
  }, [videoScores]);
 
  useEffect(() => {
    if (videoScores) {
      const recruiterRoundData =
        videoScores.roundSpecificHashMap["Recruiter Round"] || {};
      const recruiterRoundDataLength =
        videoScores.roundSpecificSkills["Recruiter Round"]?.softSkillList
          .length;
 
      // Round 1 Soft Skills (Recruiter Round)
      const recruiterRoundSoftSkills =
        videoScores.roundSpecificSkills["Recruiter Round"]?.softSkillList || [];
      setRound1SoftSkills(recruiterRoundSoftSkills);
 
      // Round 1 Soft Skill Scores
      const recruiterRoundSoftSkillsScoresList = Object.keys(
        recruiterRoundData
      ).map((userId) => {
        const userData = recruiterRoundData[userId];
        const softSkills = userData.filter(
          (entry) => entry.skillType === "Soft"
        );
        // const averageSoftSkillScore = softSkills.reduce((acc, curr) => acc + (curr.score || 0), 0) / softSkills.length;
 
        const totalSoftSkillScore = softSkills.reduce((acc, curr) => {
          const score =
            curr.score === "-" ||
            curr.score === null ||
            curr.score === undefined
              ? 0
              : curr.score;
          return acc + score;
        }, 0);
 
        const averageSoftSkillScore =
          softSkills.length > 0
            ? (totalSoftSkillScore / recruiterRoundDataLength).toFixed(1)
            : 0;
 
        const userName =
          userData.find((entry) => entry.userName)?.userName || "Unknown User";
 
        const rowData = {
          userId,
          userName,
          scores: softSkills.map((skill) => ({
            competency: skill.competancy,
            score: skill.score === "-" ? 0 : skill.score,
          })),
          averageSoftSkillScore,
        };
        return rowData;
      });
 
      setRound1SoftSkillsScores(recruiterRoundSoftSkillsScoresList);
    }
  }, [videoScores]);
 
  // Fetching Audio Scores
  useEffect(() => {
    if (audioScores) {
      const recruiterRoundData = audioScores?.["Recruiter Round"];
 
      if (
        recruiterRoundData &&
        Array.isArray(recruiterRoundData) &&
        recruiterRoundData.length > 0
      ) {
        const parsedAudioData = recruiterRoundData.map((entry) => {
          const userName = entry.userName || "Unknown User";
 
          return {
            userId: entry.userId || "N/A",
            userName: entry.userName || "-",
            voicePitch:
              entry.voicePitch !== null && entry.voicePitch !== undefined
                ? entry.voicePitch
                : "-",
            speechFluency:
              entry.speechFluency !== null && entry.speechFluency !== undefined
                ? entry.speechFluency
                : "-",
            speakingSpeed:
              entry.speakingSpeed !== null && entry.speakingSpeed !== undefined
                ? entry.speakingSpeed
                : "-",
            pausesPer15Sec:
              entry.pausePer15Sec !== null && entry.pausePer15Sec !== undefined
                ? entry.pausePer15Sec
                : "-",
            audioScore:
              entry.audioScore !== null && entry.audioScore !== undefined
                ? entry.audioScore
                : "-",
          };
        });
 
        setAudioData(parsedAudioData);
      } else {
        console.log("No valid audioScores data found.");
        setAudioData([]);
      }
    } else {
      console.log("No audioScores data passed.");
    }
  }, [audioScores]);
  // console.log("audioData ---> ", audioData)
 
  const renderTableHeaders = (skills) => {
    return skills.map((skill, index) => (
      <th key={index}>
        {skill !== undefined && skill !== null && skill !== "" ? skill : "-"}
      </th>
    ));
  };
  const renderTableRows = (data, skills, isSoftSkill = false) => {
    return data.length === 0 ? (
      <tr>
        <td colSpan={skills.length + 1}>No data available</td>
      </tr>
    ) : (
      data.map(
        ({
          userId,
          userName,
          scores,
          averageDomainScore,
          averageSoftSkillScore,
        }) => {
          return (
            <tr key={userId}>
              <td>{userName}</td>
              {skills.map((competency, index) => {
                const score = scores.find(
                  (s) => s.competency === competency
                )?.score;
                return (
                  <td key={index}>
                    {score !== undefined && score !== null ? score : "-"}
                  </td>
                );
              })}
              <td>
                {isSoftSkill
                  ? averageSoftSkillScore != null &&
                    !isNaN(averageSoftSkillScore)
                    ? averageSoftSkillScore
                    : "-"
                  : averageDomainScore != null && !isNaN(averageDomainScore)
                  ? averageDomainScore
                  : "-"}
              </td>
            </tr>
          );
        }
      )
    );
  };
 
  const renderTableHeadersDummy = () => {
    return (
      <tr>
        <th>Name</th>
        <th>Weighted Average Score</th>
        <th>Round 2 Technical Score</th>
        <th>Round 2 Soft Skill Score</th>
        <th>Round 1 Technical Score</th>
      </tr>
    );
  };
 
  const renderTableRowsDummy = () => {
    // Combine all user data and ensure uniqueness based on userId
    const allData = [
      ...round1DomainScores,
      ...round2DomainScores,
      ...round2SoftSkillsScores,
    ];
 
    // Create a Map to ensure each userId is unique
    const userMap = new Map();
 
    allData.forEach((data) => {
      const existingData = userMap.get(data.userId) || {};
 
      // Merge data for the same userId
      userMap.set(data.userId, {
        userId: data.userId,
        userName: data.userName,
        // Combine domain scores for Round 1 and Round 2
        round2TechnicalScore:
          round2DomainScores.find((userData) => userData.userId === data.userId)
            ?.averageDomainScore || "-",
        round2SoftSkillScore:
          round2SoftSkillsScores.find(
            (userData) => userData.userId === data.userId
          )?.averageSoftSkillScore || "-",
        round1TechnicalScore:
          round1DomainScores.find((userData) => userData.userId === data.userId)
            ?.averageDomainScore || "-",
      });
    });
 
    // Convert the map values to an array for rendering
    const uniqueUserData = Array.from(userMap.values());
 
    return uniqueUserData.length > 0 ? (
      uniqueUserData.map((user, index) => {
        const round2TechnicalScore = user.round2TechnicalScore;
        const round2SoftSkillScore = user.round2SoftSkillScore;
        const round1TechnicalScore = user.round1TechnicalScore;
 
        // Calculate Weighted Average Score
        const weightedAverageScore = calculateWeightedAverage(
          round2TechnicalScore !== "-" ? round2TechnicalScore : 0,
          round2SoftSkillScore !== "-" ? round2SoftSkillScore : 0,
          round1TechnicalScore !== "-" ? round1TechnicalScore : 0
        );
 
        return (
          <tr key={index}>
            <td>{user.userName}</td>
            <td>
              {weightedAverageScore !== undefined
                ? weightedAverageScore.toFixed(1)
                : "-"}
            </td>
            <td>
              {round2TechnicalScore !== undefined ? round2TechnicalScore : "-"}
            </td>
            <td>
              {round2SoftSkillScore !== undefined ? round2SoftSkillScore : "-"}
            </td>
            <td>
              {round1TechnicalScore !== undefined ? round1TechnicalScore : "-"}
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={5}>No data available</td>
      </tr>
    );
  };
 
  // Handle the change in weightage values
  const handleWeightageChange = (e, setWeightage) => {
    const value = e.target.value.trim();
    if (value === "") {
      setWeightage("");
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
        setWeightage(parsedValue);
      }
    }
  };
 
  // Check if the total of all ratios equals 100 (100%)
  const validateRatios = () => {
    const totalRatio =
      round2TechnicalRatio + round2SoftSkillsRatio + round1Ratio;
    return totalRatio === 100;
  };
 
  const toggleWeightageSection = () => {
    setIsWeightageSectionVisible(!isWeightageSectionVisible);
  };
  return (
    <div
      ref={ref}
      style={{
        display: "none",
        position: "absolute",
        left: "-9999px",
      }}
    >
      <div style={{ width: "596px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="container report-container report-2container">
          <header className="report-header">
            <div className="report-logo">
              <img src={icon.reportLogo} alt="brandLogo" />
            </div>
          </header>
          <section className="report2-frontpage">
            <div className="row row-margin">
              <aside className="col xl12 l12 m12 s12 po-report2">
                <h1>Position Report</h1>
                <h4>
                Position Name: <span> {selectedJob?.positionName ?? "-"} </span>
                </h4>
                <h4>
                Recruiter Name <span> {getRecruiterNames(selectedJob?.recruiterName)} </span>
                </h4>
              </aside>
              <aside className="col xl12 l12 m12 s12 report2-barcode">
                <img src={image.vectorImage} alt="barcodeImage" />
              </aside>
            </div>
          </section>
          <section className="report-name-wr">
            <div className="report-2bottonsection">
              <h4>Hiring Managers</h4>
              <p>
                {/* L3: - <br /> */}
                L2: - <br />
                L1: {interviewerNames || "-"} <br />
                HR:  {getRecruiterNames(selectedJob?.recruiterName)}
              </p>
            </div>
          </section>
        </div>
 
        {/* <div className="container report-container report-cand-wr"> */}
        <section className="report-table-wr mt15">
          <header>Over View</header>
          <div className="overviewreport2-section">
            <table className="table table-dashedborder">
              <tr>
                <td>Candidates Sourced </td>
                <td>
                  <div className="scorecolor1">
                    {candidateCount?.candidateSourced || "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Candidates showed interest </td>
                <td>
                  <div className="scorecolor1 scorecolor2">
                    {candidateCount?.candidatesIntrest || "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Completed Round 1</td>
                <td>
                  <div className="scorecolor1 scorecolor3">
                    {candidateCount?.candidatesRound1 || "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Shortlisted for Round 2</td>
                <td>
                  <div className="scorecolor1 scorecolor4">
                    {candidateCount?.candidatesShortlistedRound1 || "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Completed Round 2</td>
                <td>
                  <div className="scorecolor1 scorecolor5">
                    {candidateCount?.candidatesRound2 || "-"}
                  </div>
                </td>
              </tr>
              <tr>
                <td>1 to 1 interviews with hiring panel</td>
                <td>
                  <div className="scorecolor1 scorecolor6">
                    {candidateCount?.candidatesShortlistedRound2 || "-"}
                  </div>
                </td>
                {/* discuss last column with sir! */}
              </tr>
            </table>
          </div>
        </section>
        <section className="report-table-wr mt15">
          <header>
            Weighted Average Score - Completed Round 2 ({round2TechnicalRatio}:
            {round2SoftSkillsRatio}:{round1Ratio})
          </header>
          <div className="weightage-inputs">
            <button
              className="waves-effect waves-light btn btn-clear btn-submit search-dropdown"
              style={{ margin: "0", marginTop: "3px", marginLeft: "3px" }}
              onClick={toggleWeightageSection}
            >
              {isWeightageSectionVisible ? "↑" : "↓"}
            </button>
 
            {/* Weightage Inputs Section */}
            {isWeightageSectionVisible && (
              <div className="weightage-inputs">
                <div>
                  <label
                    htmlFor="round2TechnicalRatio"
                    style={{ margin: "0 5px" }}
                  >
                    Round 2 Technical Score Weightage (%)
                  </label>
                  <input
                    style={{ margin: "0 5px", width: "98%" }}
                    type="number"
                    id="round2TechnicalRatio"
                    value={round2TechnicalRatio}
                    onChange={(e) =>
                      handleWeightageChange(e, setRound2TechnicalRatio)
                    }
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label
                    htmlFor="round2SoftSkillsRatio"
                    style={{ margin: "0 5px" }}
                  >
                    Round 2 Soft Skills Score Weightage (%)
                  </label>
                  <input
                    style={{ margin: "0 5px", width: "98%" }}
                    type="number"
                    id="round2SoftSkillsRatio"
                    value={round2SoftSkillsRatio}
                    onChange={(e) =>
                      handleWeightageChange(e, setRound2SoftSkillsRatio)
                    }
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label htmlFor="round1Ratio" style={{ margin: "0 5px" }}>
                    Round 1 Technical Score Weightage (%)
                  </label>
                  <input
                    style={{ margin: "0 5px", width: "98%" }}
                    type="number"
                    id="round1Ratio"
                    value={round1Ratio}
                    onChange={(e) => handleWeightageChange(e, setRound1Ratio)}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="ratio-warning">
                  {!validateRatios() && (
                    <p style={{ color: "red" }}>
                      Error: The total weightage must equal 100%.
                    </p>
                  )}
                </div>
                {/* <button
                                      style={{ marginLeft: "3px", marginTop: "5px" }}
                                      className="waves-effect waves-light btn btn-clear btn-submit search-dropdown"
                                      onClick={calculateWeightedAverage}
                                      disabled={!validateRatios()}
                                  >
                                      Submit & Calculate Average
                                  </button> */}
              </div>
            )}
          </div>
          <div className="overviewreport2-section">
            <table className="table striped responsive-table dummy-table-center-data">
              <thead>{renderTableHeadersDummy()}</thead>
              <tbody>{renderTableRowsDummy()}</tbody>
            </table>
          </div>
        </section>
        {/* </div> */}
        {/* <div className="container report-container report-cand-wr"> */}
        {round2DomainSkills.length > 0 && (
          <section className="report-table-wr mt15">
            <header>Round 2 Domain Scores</header>
            <div className="overviewreport2-section">
              <table className="table striped responsive-table table-position-report">
                <thead>
                  <tr>
                    <th>Name</th>
                    {renderTableHeaders(round2DomainSkills)}
                    <th>Average Domain Score</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(round2DomainScores, round2DomainSkills)}
                </tbody>
              </table>
            </div>
          </section>
        )}
 
        {round2SoftSkills.length > 0 && (
          <section className="report-table-wr mt15">
            <header>Round 2 Soft skill Scores</header>
            <div className="overviewreport2-section">
              <table className="table striped responsive-table table-position-report">
                <thead>
                  <tr>
                    <th>Name</th>
                    {renderTableHeaders(round2SoftSkills)}
                    <th>Average Soft Skill Score</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(
                    round2SoftSkillsScores,
                    round2SoftSkills,
                    true
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {/* </div> */}
        {/* <div className="container report-container report-cand-wr"> */}
        {round1DomainSkills.length > 0 && (
          <section className="report-table-wr mt15">
            <header>Round 1 Domain Scores</header>
            <div className="overviewreport2-section">
              <table className="table striped responsive-table table-position-report">
                <thead>
                  <tr>
                    <th>Name</th>
                    {renderTableHeaders(round1DomainSkills)}
                    <th>Average Domain Score</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(round1DomainScores, round1DomainSkills)}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {audioData.length > 0 && (
          <section className="report-table-wr mt15">
            <header>Round 1 audio Scores</header>
            <div className="overviewreport2-section">
              <table className="table striped responsive-table table-position-report">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Voice Pitch</th>
                    <th>Speech Fluency</th>
                    <th>Speaking Speed</th>
                    <th>Pause/ 15 Sec</th>
                    <th>Audio Score</th>
                  </tr>
                </thead>
                <tbody>
                  {audioData.length > 0 ? (
                    audioData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.userName}</td>
                        <td>{data.voicePitch}</td>
                        <td>{data.speechFluency}</td>
                        <td>{data.speakingSpeed}</td>
                        <td>{data.pausesPer15Sec}</td>
                        <td>{data.audioScore}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {round1SoftSkills.length > 0 && (
          <section className="report-table-wr mt15">
            <header>Round 1 Soft Skill Scores</header>
            <div className="overviewreport2-section">
              <table className="table striped responsive-table table-position-report">
                <thead>
                  <tr>
                    <th>Name</th>
                    {renderTableHeaders(round1SoftSkills)}
                    <th>Average Soft Skill Score</th>
                  </tr>
                </thead>
                <tbody>
                  {renderTableRows(
                    round1SoftSkillsScores,
                    round1SoftSkills,
                    true
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
 
export default DownloadPositionReport;