import React, { useRef } from "react";
import { useState, useEffect , forwardRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCandidateResponseList,fetchSelectedCandidateInfo, fetchCandidateList} from "../../redux/actions/interview-responses-l1-dashboard-actions";
import { setSelectedCandidateId } from "../../redux/slices/interview-responses-l1-dashboard-slice";
import { fetchAudioScores, fetchDomainScores, fetchVideoScores, } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";
import { fetchTotalQuestions } from "../../redux/actions/interview-responses-l1-dashboard-actions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from 'react-router-dom';
import { fetchFilterRejectCandidates } from "../../redux/actions/interview-responses-recruiter-dashboard-actions";

const DownloadCandidateReport = forwardRef((props, ref) => {
    const { selectedCandidateId: id ,selectedJobId,selectedRoundId , pageRef, needData } = props;
    

  const dispatch = useDispatch();
  const location = useLocation();


//   const { selectedCandidateId, selectedJobId, selectedRoundId } = location.state || {};

  // const [id, setId] = useState(selectedCandidateId); 
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [domainScores, setDomainScores] = useState(null);
  const [audioScores, setAudioScores] = useState(null);
  const [videoScores, setVideoScores] = useState(null);
  const [candidateRating, setCandidateRating] = useState(null);
  const [r2DomainSkills, setR2DomainSkills] = useState(null);
  const [r1SoftSkills, setR1SoftSkills] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
    const [playVideo, setPlayVideo] = useState(false);
    const [canRespList, setCanRespList] = useState(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [audioRecordings, setAudioRecordings] = useState(null);
    const questionData = { };
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  const handlePlayVideo = (url) => {
    // Set the video URL from candidateResponseList[0].amazonS3Link
    setVideoUrl(url);
    setPlayVideo(true);
  };

  
  
  

  const {selectedCandidateRating,isViewByApplicant,selectedQuestionMap,candidateResponseMap,candidateResponseList,candidateList,totalQuestionList,selectedCandidateInfo} = useSelector((state)=>state.interviewResponsesL1DashboardSliceReducer);

  const page1Ref = useRef();
  const page2Ref = useRef();
  const page3Ref = useRef();
  const page4Ref = useRef();
  const printRef = useRef();
  const generatePDF = async () => {

    setIsGeneratingPDF(true);
  
    setTimeout(async () => {
      const input = page1Ref.current;
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
  
      pdf.save("documennnnnnnnnt.pdf");
  
     
      setIsGeneratingPDF(false);
    }, 5000); 
  
  };
  
  
    
  useEffect(() => {
    if (needData && id){

      dispatch(setSelectedCandidateId(id));
      dispatch(fetchSelectedCandidateInfo({ id }))
      .then((userData) => {
        setCandidateInfo(userData.payload.userProfileDTO); 
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData , id]);

  useEffect(() => {
    if (needData && id) {

      dispatch(fetchDomainScores({selectedJobId, id}))
      .then((domainScoreData) => {
        setDomainScores(domainScoreData?.payload?.roundSpecificHashMap["Recruiter Round"][id]   ); 
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData, id]);


  useEffect(() => {
    if (needData && id){
      dispatch(fetchFilterRejectCandidates({selectedJobId,selectedRoundId, questionData}))
      .then((audioRecordings) => {
        setAudioRecordings(audioRecordings?.payload?.candidateFiltrations?.find(item => item.user.id === id)); 
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData, id]);

  useEffect(() => {
    if (needData && id) {
      console.log("test");
      dispatch(fetchVideoScores({selectedJobId}))
      .then((videoScoreData) => {
        setVideoScores(videoScoreData?.payload?.roundSpecificHashMap["Recruiter Round"][id] ); 
        setR2DomainSkills(videoScoreData?.payload?.roundSpecificHashMap["L1 Hiring Manager Round"][id] ); 
        setR1SoftSkills(videoScoreData?.payload?.roundSpecificHashMap["Recruiter Round"][id] ); 
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData, id]);

  useEffect(() => {
    if (needData && selectedJobId){

      dispatch(fetchAudioScores({selectedJobId}))
      .then((audioScoreData) => {
        setAudioScores(audioScoreData.payload.roundSpecificDataDTO["Recruiter Round"].find(item => item.userId === id));
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData, selectedJobId]);

  // useEffect(() => {
  //   if (id) {
  //       dispatch(fetchSelectedCandidateRating({
  //           selectedJobId,
  //           selectedRoundId,
  //           selectedCandidateId
  //         }))
  //     .then((candidateRating) => {
  //       setCandidateRating(candidateRating); 
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching candidate info:", error);
  //     });
  // }
  // }, []);

  useEffect(() => {
    if (needData && id) {
        dispatch(fetchCandidateResponseList({
            selectedJobId,
            id,
            selectedRoundId: "L1 Hiring Manager Round"
          }))
      .then((candidateAnswer) => {
       setCanRespList (candidateAnswer?.payload?.candidateResponseList); 
      })
      .catch((error) => {
        console.error("Error fetching candidate info:", error);
      });
    }
  }, [needData , id]);



  useEffect(() => {
    if (needData && id) {
      dispatch(fetchSelectedCandidateInfo({id}));
      // dispatch(fetchSelectedCandidateRating);
      dispatch(fetchCandidateList({selectedJobId,selectedRoundId}));
      const responseType="video";
      dispatch(fetchTotalQuestions({selectedJobId,selectedRoundId: "L1 Hiring Manager Round",responseType}));
    }
    }, [needData, id]);
   
    

  //   const r2SoftSkills = videoScores?.filter(item => item.skillType === "Soft").length > 0
  // ? (videoScores.filter(item => item.skillType === "Soft")
  //     .reduce((acc, item) => acc + item.score, 0) / 
  //     videoScores.filter(item => item.skillType === "Soft").length).toFixed(1)
  // : '0.0';
  //   const r2DomainSkills = domainScores?.length > 0
  // ? (domainScores.reduce((acc, scoreData) => acc + scoreData.averageScore, 0) / domainScores.length).toFixed(1)
  // : '0.0';
  //   // const r1DomainSkills = pdf.internal.pageSize.getWidth();

  //   console.log(r2DomainSkills);
  //   console.log(r2SoftSkills);
//   console.log(r2DomainSkills);


  const avgSoftSkillScore = r2DomainSkills?.filter(scoreData => scoreData.skillType === "Soft").length > 0
  ? (
      r2DomainSkills.filter(scoreData => scoreData.skillType === "Soft")
        .reduce((acc, scoreData) => acc + scoreData.score, 0) /
      r2DomainSkills.filter(scoreData => scoreData.skillType === "Soft").length
    ).toFixed(1)
  : '0.0';

  const avgR2DomainScore = r2DomainSkills?.filter(scoreData => scoreData.skillType === "Domain").length > 0
  ? (
      r2DomainSkills.filter(scoreData => scoreData.skillType === "Domain")
        .reduce((acc, scoreData) => acc + scoreData.score, 0) /
      r2DomainSkills.filter(scoreData => scoreData.skillType === "Domain").length
    ).toFixed(1)
  : '0.0';

  const avgR1DomainScore = domainScores?.filter(scoreData => scoreData.skillType === "Domain").length > 0
  ? (
      domainScores.filter(scoreData => scoreData.skillType === "Domain")
        .reduce((acc, scoreData) => acc + scoreData.averageScore, 0) /
      domainScores.filter(scoreData => scoreData.skillType === "Domain").length
    ).toFixed(1)
  : '0.0';

  const weightedAverageScore = (
    (parseFloat(avgSoftSkillScore) * 0.50) + 
    (parseFloat(avgR2DomainScore) * 0.30) + 
    (parseFloat(avgR1DomainScore) * 0.20)
  ).toFixed(1);
  
  const currentWorkEx = candidateInfo?.workExperience?.find(experience => experience.currentOrganization === true);
  
  const calculateDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const days = now.getDate() - start.getDate();
  
    let duration = `${years} years`;
  
    // If months are not 0, add the months to the duration
    if (months > 0) {
      duration += `, ${months} months`;
    }
  
    // If days are not 0, add the days to the duration
    if (days > 0) {
      duration += `, ${days} days`;
    }
  
    // If duration is less than a month, just show months and days
    if (years === 0 && months === 0 && days === 0) {
      return 'Less than a month';
    }
  
    return duration;
  };

  const latestDegree = candidateInfo?.userAcademics?.sort((a, b) => {
    // Treat null endDate as the most recent (use current date if endDate is null)
    const endDateA = a.endDate ? new Date(a.endDate) : new Date();
    const endDateB = b.endDate ? new Date(b.endDate) : new Date();
  
    // Sort in descending order (latest first)
    return endDateB - endDateA;
  })[0];


const handleAudioClick = (audioUrl) => {
    setCurrentAudioUrl(audioUrl);
  };

  const audioList = audioRecordings?.audioList || [];

  
  
  
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
		
  
  return (
    
    <div className="rep-container" ref={ref}
    style={{
        display: "none",
      }}>
      <div className="report-container report-1container"
      style={{
         paddingLeft: "10px",  
         paddingRight: "10px"
      }}>

      <header className="report-header">
        <div className="report-logo">
          <img src="images-3/report-logo.png" alt="" />
        </div>
      </header>
      <section className="report-name-wr">
        <div className="row row-margin">
          <aside className="col xl8 l8 m8 s8">
          
    <h1>Candidate Report</h1>
    <h4>Name: {selectedCandidateInfo?.name}</h4>
    <h4>Position: {selectedCandidateInfo?.designation}</h4>

          </aside>
          <aside className="col xl4 l4 m4 s4 report-barcode">
            <img src="images-3/Vector.png" alt="" />
          </aside>
        </div>
        <div className="row row-margin reportfooterlast">
          <aside className="col xl9 l9 m9 s9">
            <p className="reportfooterp">EvueMe AI Report</p>
          </aside>
          <aside className="col xl3 l3 m3 s3">
            <p className="reportfooterp reportfooter-last">evueme.ai</p>
          </aside>
        </div>
      </section>
      </div>
      <section className="report-table-wr-mt">
          <table className="table table-report">
            <thead>
              <tr>
                <th colSpan="4">Candidate Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span>Current Designation</span>{currentWorkEx?.designation} </td>
                <td><span>Email ID </span> {candidateInfo?.primaryEmailId}</td>
                <td><span>Current Organization</span> {currentWorkEx?.organizationName}</td>
                <td><span>Name</span> {selectedCandidateInfo?.name}</td>
              </tr>
              <tr>
                <td><span>Date of birth</span> {candidateInfo?.dateOfBirth} </td>
                <td><span>Year of Experience</span> {candidateInfo?.totalExperience}</td>
                <td><span>Mobile No</span> {candidateInfo?.mobileNumber1}</td>
                <td><span>WhatsApp No</span> {candidateInfo?.whatsappNumber}</td>
              </tr>
              <tr>
                <td><span>Highest Degree </span>{latestDegree?.degreeName} </td>
                <td><span>Current CTC</span> {candidateInfo?.currentCTC}</td>
                <td><span>Notice Period</span> {candidateInfo?.noticePeriod}</td>
                <td><span>Age</span> </td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="ac-information-wr">
          <header>Academic Information</header>
          <div className="Information-details-wr">
          <ul>
  {candidateInfo?.userAcademics?.map((academic, index) => (
    <li key={academic.userAcademicId}>
      {/* <div className="ac-inf-round">
        <img src="images-3/univercity-ico.svg" alt="University Icon" />
      </div> */}
      <div className="ac-inf-right">
        <h4>{academic.degreeName} ({academic.levelOfEducation})</h4>
        <p>{academic.universityName}</p>
        <p>
          <span><img src="images-3/calender.svg" alt="Calendar" /></span>
          {`${new Date(academic.startDate).toISOString().split('T')[0]} - 
           ${academic.endDate ? new Date(academic.endDate).toISOString().split('T')[0] : 'Present'}`}
        </p>
        <p>CGPA - {academic.cgpa}</p>
      </div>
    </li>
  ))}
</ul>
          </div>
        </section>
        <section className="report-table-wr"> {/* css not found */}

          <table className="table table-report table-strippedwr">  {/* css not found */}
            <thead>
              <tr>
                <th colSpan="5">Work experience</th>
              </tr>
            </thead>
            <tbody>
  {candidateInfo?.workExperience?.map((experience, index) => (
    <tr key={experience.workExperienceId}>
      <td>
        <div className="com-logo"><img src={`images-3/company-${index + 1}.png`} alt={`Company ${index + 1} Logo`} /></div>
      </td>
      <td><span>From </span> {new Date(experience.startDate).toISOString().split('T')[0]}</td>
      <td><span>To</span> {experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : 'Present'}</td>
      <td><span>Designation</span> {experience.designation}</td>
      <td><span>Duration</span> {calculateDuration(experience.startDate)}</td>
    </tr>
  ))}
</tbody>
          </table>
        </section>
  
        <footer className="reportfooter-inner">
          <div className="row row-margin-for-report">
            <aside className="col xl4 l4 m4 s4">
              <p className="footer-inner-p">EvueMe AI Report</p>
            </aside>
            <aside className="col xl4 l4 m4 s4">
              {/* <p className="footer-inner-p text-center">Page - 2/8</p> */}
            </aside>
            <aside className="col xl4 l4 m4 s4">
              <p className="footer-inner-p text-right">evueme.ai</p>
            </aside>
          </div>
        </footer>

        <section className="report-table-wr">
  <header>Overall Score</header>
  <h3>Overall Score</h3>
  <div className="overall-box">
    <div className="row">
      <aside className="col xl4 l4 m4 s4 cspadding">
        <div className="scorebox">
          <h2>Round 2</h2>
          <div className="scoregraph-wr scoregraph-2">
            <div className="multigraph">
            <span className="graph" style={{
                  "--score": `${(avgSoftSkillScore * 180) / 100}deg`,
                }}> {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Soft").length > 0 ? (
                    avgSoftSkillScore
                  ) : (
                    '0.0'
                  )}{/* Calculate and display the average soft skill score */}
              {/* {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Soft").length > 0 ? (
  (r2DomainSkills.filter(scoreData => scoreData.skillType === "Soft")
    .reduce((acc, scoreData) => acc + scoreData.score, 0) /
    r2DomainSkills.filter(scoreData => scoreData.skillType === "Soft").length
  ).toFixed(1)
) : (
  '0.0'
)} */}
</span>
            </div>
            <p>Avg Soft<br /> Skill Scores</p>
            <div className="average-score">
              
            </div>
          </div>
          <div className="scoregraph-wr scoregraph-2">
            <div className="multigraph">
            <span className="graph" style={{
                  "--score": `${(avgR2DomainScore * 180) / 100}deg`,
                }}> {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Soft").length > 0 ? (
                    avgR2DomainScore
                  ) : (
                    '0.0'
                  )}
              {/* {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Domain").length > 0 ? (
  (r2DomainSkills.filter(scoreData => scoreData.skillType === "Domain")
    .reduce((acc, scoreData) => acc + scoreData.score, 0) /
    r2DomainSkills.filter(scoreData => scoreData.skillType === "Domain").length
  ).toFixed(1)
) : (
  '0.0'
)} */}
</span>
            </div>
            <p>Avg Domain<br /> Score</p>
            <div className="average-score">
              
            </div>
          </div>
        </div>
      </aside>
      <aside className="col xl4 l4 m4 s4 cspadding">
        <div className="scorebox">
          <h2>Round 1</h2>
          <div className="scoregraph-wr scoregraph-2">
            <div className="multigraph">
              <span className="graph"></span>
            </div>
            <p>Avg Aptitude<br /> Scores</p>
          </div>
          <div className="scoregraph-wr scoregraph-2">
            <div className="multigraph">
            <span className="graph" style={{
                  "--score": `${(avgR1DomainScore * 180) / 100}deg`,
                }}> {avgR1DomainScore > 0 ? (
                    avgR1DomainScore
                  ) : (
                    '0.0'
                  )}
                {/* {domainScores?.filter(scoreData => scoreData.skillType === "Domain").length > 0 ? (
  (domainScores.filter(scoreData => scoreData.skillType === "Domain")
    .reduce((acc, scoreData) => acc + scoreData.averageScore, 0) /
    domainScores.filter(scoreData => scoreData.skillType === "Domain").length
  ).toFixed(1)
) : (
  '0.0'
)} */}
</span>
            </div>
            <p>Avg Domain<br /> Score</p>
          </div>
        </div>
      </aside>
      <aside className="col xl4 l4 m4 s4 cspadding">
        <div className="scorebox">
          <h2>Weighted Avg Score</h2>
          <h2 className="avg-goldent">{weightedAverageScore}</h2>
          <h2 className="avgtricolor">
            <span>50</span> : <span>30</span> : <span>20</span>
          </h2>
          <ul className="svgscore-ul">
            <li><span className="black-square"></span> R2 Soft Skills</li>
            <li><span className="green-square"></span> R2 Domain Skills</li>
            <li><span className="red-square"></span> R1 Domain Skills</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
  <div className="border-h2">
    <h3>Round 2 Scores</h3>
  </div>
  <div className="overall-box">
    <div className="row">
      <aside className="col xl6 l6 m6 s6 cspadding">
        <div className="scorebox dm-scoreboard">
          <h2>Domain Skills</h2>
          <div className="scoreboard-inn">
            <table className="table table-scoreboard">
              <tbody>
              {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Domain").map((scoreData, index) => (
  <tr key={index}>
    <td>{scoreData.competancy}</td>
    <td>
      <div className="score-rope">
      <div
                className={`scorerope-inn ${scoreData.averageScore ? `sc-${scoreData.averageScore * 10}` : ''}`}
                style={{ width: `${scoreData.score}%` }}
              ></div>
      </div>
    </td>
    <td>{scoreData.score.toFixed(1)}</td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>
      </aside>
      <aside className="col xl6 l6 m6 s6 cspadding">
        <div className="scorebox dm-scoreboard">
          <h2>Soft Skills</h2>
          <div className="scoreboard-inn">
            <table className="table table-scoreboard">
              <tbody>
              {r2DomainSkills?.filter(scoreData => scoreData.skillType === "Soft").map((scoreData, index) => (
  <tr key={index}>
    <td>{scoreData.competancy}</td>
    <td>
      <div className="score-rope">
      <div
                className={`scorerope-inn ${scoreData.averageScore ? `sc-${scoreData.averageScore * 10}` : ''}`}
                style={{ width: `${scoreData.score}%` }}
              ></div>
      </div>
    </td>
    <td>{scoreData?.score?.toFixed(1)}</td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
      <section className="report-table-wr mt15 min-325">
        <header>Round 1 Interview Performance</header>
        <h4 className="intblack-head">Interview Score</h4>
        <div className="skillscore-box">
      <h3>Domain Skills</h3>
      {domainScores
        ?.filter(item => item.skillType === "Domain") // Filter out only "Domain" skill types
        .map((item, index) => (
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(item.averageScore ?? 0) * 180 / 100}deg` }}>{item.averageScore ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((item.averageScore ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>{item.competancy}</p> {/* Display the competency name */}
          </div>
        ))}
    </div>
    <div className="skillscore-box">
      <h3>Soft Skills</h3>
      {videoScores
        ?.filter(item => item.skillType === "Soft") // Filter out only "Domain" skill types
        .map((item, index) => (
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(item.averageScore ?? 0) * 180 / 100}deg` }}>{item.averageScore ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((item.averageScore ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>{item.competancy}</p> {/* Display the competency name */}
          </div>
        ))}
    </div>
        <div className="skillscore-box">
          <h3>Communication Skills</h3>
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(audioScores?.voicePitch ?? 0) * 180 / 100}deg` }}>{audioScores?.voicePitch ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((audioScores?.voicePitch ?? 0) * 158 / 100) - 3}deg`
							}}> */}

								{/* <span className="ball" ></span> */}
							{/* </span> */}
            </div>
            <p>Voice <br />Pitch</p>
          </div>
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(audioScores?.speechFluency ?? 0) * 180 / 100}deg` }}>{audioScores?.speechFluency ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((audioScores?.speechFluency ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>Speech <br />Fluency</p>
          </div>
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(audioScores?.speakingSpeed ?? 0) * 180 / 100}deg` }}>{audioScores?.speakingSpeed ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((audioScores?.speakingSpeed ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>Speaking <br />Speed</p>
          </div>
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(audioScores?.pausePer15Sec ?? 0) * 180 / 100}deg` }}>{audioScores?.pausePer15Sec ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((audioScores?.pausePer15Sec ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>Pause/15 <br />Sec</p>
          </div>
          <div className="scoregraph-wr scoregraph-2">
						<div className="multigraph">
            <span className="graph " style={{ '--score': `${(audioScores?.audioScore ?? 0) * 180 / 100}deg` }}>{audioScores?.audioScore ?? 0}</span>
							{/* <span className="circle" style={{
								'--scoree': `${((audioScores?.audioScore ?? 0) * 158 / 100) - 3}deg`
							}}>

								<span className="ball" ></span>
							</span> */}
            </div>
            <p>Audio <br />Score</p>
          </div>
        </div>
      </section>

      <footer className="reportfooter-inner">
        <div className="row row-margin">
          <aside className="col xl4 l4 m4 s4">
            <p className="footer-inner-p">EvueMe AI Report</p>
          </aside>
          <aside className="col xl4 l4 m4 s4">
            {/* <p className="footer-inner-p text-center">Page - 2/8</p> */}
          </aside>
          <aside className="col xl4 l4 m4 s4">
            <p className="footer-inner-p text-right">evueme.ai</p>
          </aside>
        </div>
      </footer>

      <section className="report-table-wr">
          <header>Overall EvueMe AI Comments</header>
          <div className="overall-box reportbox-comment">
            <p>
              {"-"}
            </p>
            <div className="expand-com"></div>
          </div>
        </section>
  
        <section className="report-table-wr mt15">
  <header>Round 2 Interview Performance</header>
  <div className="table-header-q">
    <div className="row valign-wrapper">
      <aside className="col xl5 l5 m5 hp cspadding">
        <p>Question</p>
      </aside>
      <aside className="col xl2 l2 m2 hp cspadding">
        <p>EvueMe AI score</p>
      </aside>
      <aside className="col xl5 l5 m5 hp cspadding">
        <p>EvueMe AI Comments</p>
      </aside>
    </div>
  </div>

  <div className="table-body-q">
    {totalQuestionList.map((item, index) => {
      const aiAnswer = canRespList?.find(answer => answer.questionId === item.questionId);

      return (
        <div className="row valign-wrapper" key={index}>
          {/* Main/Probing Question */}
          <aside className="col xl5 l5 m5 cspadding">
            <div className="table-left-b">
              <h5>Skill Name: {item.competancy}</h5>
              <p style={{ textAlign: 'justify' }}>{item.questionText}</p>
              {aiAnswer && aiAnswer.response && videoUrl !== aiAnswer.response && (
                <a
                  className={`play-videoa ${isGeneratingPDF ? 'hide-in-pdf' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePlayVideo(aiAnswer.response)}
                >
                  Play Video
                </a>
              )}

              {/* Render the selected video player right below the button */}
              {isGeneratingPDF === false && videoUrl && videoUrl === aiAnswer?.response && (
                <div>
                  <video width="200" height="150" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </aside>

          <aside className="col xl2 l2 m2 cspadding">
            <div className="table-left-b">
              <p className="sc-p">
                {aiAnswer && aiAnswer.aiScore === "null" ? "-" : aiAnswer ? aiAnswer.aiScore : "0.0"}
              </p>
            </div>
          </aside>

          <aside className="col xl5 l5 m5 cspadding">
            <div className="table-left-b tbl-comment-box">
              <div className="expand-com">
                <p>{aiAnswer ? aiAnswer.aiComment : 'No AI comment available'}</p>
              </div>
            </div>
          </aside>
        </div>
      );
    })}
  </div>
</section>
  
        <footer className="reportfooter-inner">
          <div className="row row-margin">
            <aside className="col xl4 l4 m4 s4">
              <p className="footer-inner-p">EvueMe AI Report</p>
            </aside>
            <aside className="col xl4 l4 m4 s4">
              {/* <p className="footer-inner-p text-center">Page - 2/8</p> */}
            </aside>
            <aside className="col xl4 l4 m4 s4">
              <p className="footer-inner-p text-right">evueme.ai</p>
            </aside>
          </div>
        </footer>

        <section className="report-table-wr">
      <header>Audio Question</header>
      <div className="audio-boxwr">
        {audioList && audioList.length > 0 ? (
          audioList.map((audio, index) => (
            <a
              key={audio.id}
              className={`play-videoa play-audio ${currentAudioUrl === audio.response ? 'playing' : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleAudioClick(audio.response)}
            >
              Audio - {index + 1}
            </a>
          ))
        ) : (
          <p>No audio available</p>
        )}
      </div>

      {currentAudioUrl && (
        <div className="audio-player">
          <audio key={currentAudioUrl} controls>
            <source src={currentAudioUrl} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </section>
      {/* <section className="prb-solverwr mt-15">
        <h3>Suggestions for hiring manager</h3>
        <p>We suggest you deep dive in your personal interview on following competency with below scores </p>
      </section>
      <section className="skill-prb-wr">
        <h3>Skills Name: <span>Problem Solver</span></h3>
        <h5>Suggested Question 1</h5>
        <p>You're developing a feature for a mobile-responsive web application, but users report that the feature is not functioning correctly on certain mobile devices. How would you address and rectify this cross-device compatibility issue?</p>
        <table className="table no-border">
          <tbody>
            <tr>
              <td>Probe 1</td>
              <td>What tools or methods would you use to replicate and diagnose the issue across different devices?</td>
            </tr>
            <tr>
              <td>Probe 2</td>
              <td>How do you plan to ensure that the feature works consistently across various devices and screen sizes?</td>
            </tr>
            <tr>
              <td>Probe 3</td>
              <td>Can you share an experience where you had to troubleshoot and solve a device compatibility problem in a previous project? What was the outcome?</td>
            </tr>
          </tbody>
        </table>
        <h5>Suggested Question 2</h5>
        <p>You're working on a web application where the front end is not properly communicating with the back-end server, resulting in data inconsistencies for the users. How would you go about diagnosing and solving this issue?</p>
        <table className="table no-border">
          <tbody>
            <tr>
              <td>Probe 1</td>
              <td>What initial steps would you take to investigate whether the issue lies with the front-end code, the back-end logic, or the communication between them?</td>
            </tr>
            <tr>
              <td>Probe 2</td>
              <td>How would you ensure that similar communication issues are prevented or quickly identified in the future?</td>
            </tr>
            <tr>
              <td>Probe 3</td>
              <td>Can you give an example from your past experience where you resolved a similar integration issue between front end and back end?</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="skill-prb-wr">
        <h3>Skills Name: <span>MySql</span></h3>
        <h5>Suggested Question 1</h5>
        <p>Imagine you've inherited a MySQL database that is running slowly. Upon investigation, you find that the database hasn’t been optimized for a long time. How would you approach optimizing this database?</p>
      </section>
      <footer className="reportfooter-inner">
        <div className="row row-margin">
          <aside className="col xl4 l4 m4 s4">
            <p className="footer-inner-p">EvueMe AI Report</p>
          </aside>
          <aside className="col xl4 l4 m4 s4">
          </aside>
          <aside className="col xl4 l4 m4 s4">
            <p className="footer-inner-p text-right">evueme.ai</p>
          </aside>
        </div>
      </footer> */}

        <button onClick={generatePDF}>Download PDF</button>
        
        {/* {videoUrl && (
        <div>
          <video width="640" height="360" controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )} */}
    </div>

    
    
  );
});

export default DownloadCandidateReport;