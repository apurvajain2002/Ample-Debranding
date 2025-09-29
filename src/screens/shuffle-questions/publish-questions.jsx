import { useEffect, useState } from "react";
import CircularProgressBarLoader from "../../components/loaders/circular-progress-bar-loader";
import SwitchInputField from "../../components/input-fields/switch-input-field";
import Tooltip from "../../components/miscellaneous/tooltip";
import NormalButton from "../../components/buttons/normal-button";
import RadioButtonInputField from "../../components/input-fields/radio-button-input-field";
import { useNavigate } from "react-router-dom";
import WarningToast from "../../components/toasts/warning-toast";
import { useDispatch, useSelector } from "react-redux";
import { getRoundDetails } from "../../redux/actions/define-interview-actions/define-interview-actions";
import { setRoundName } from "../../redux/slices/create-new-job-slice";
import { roundsData } from "../../resources/constant-data/roundsData";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../components/toasts/error-toast";
import axiosInstance from "../../interceptors";
import { is } from "immutable";
import { interviewRounds } from "../../resources/constant-data/AddJobDetails";
import SuccessToast from "../../components/toasts/success-toast";

const NEXT_ROUND_QUESTIONS_ACTION = "create-next-round-questions"
const INVITE_CANDIDATES_ACTION = "invite-candidates-for-this-round"
const MAPPED_ROUTES = {
  [NEXT_ROUND_QUESTIONS_ACTION]: "/admin/add-questions",
  [INVITE_CANDIDATES_ACTION]: "/admin/invite-link"
}

const PublishingLoader = ({ uploadedPercentage, className }) => {
  return (
    <div className="publishing-questions-loader">
      <CircularProgressBarLoader
        value={uploadedPercentage}
        className="publish-questions-circular-loader"
      />
      { uploadedPercentage == 70 ? (<p>Interview publish in progress ...</p>):"" }
      
    </div>
  );
};

const SwitchInputFieldContainer = ({
  switchInputFieldIdAndName = "",
  checked = false,
  onChange = () => { },
  spanText = "",
  tooltipText = "",
}) => {
  return (
    <ul className="right-q-action ">
      <li style={{ display: "flex", alignItems: "center", justifyContent: "" }}>
        <SwitchInputField
          switchInputFieldIdAndName={switchInputFieldIdAndName}
          checked={checked}
          onChange={onChange}
        />
        <div className="switch-text-container">
          <span className="switch-text">
            {spanText}
          </span>
          <i className="show-details infermation-ico-black switch-icon">
            i
            <Tooltip divTagCssClasses={"infbox-click"}>
              <p>
                {tooltipText}
              </p>
            </Tooltip>
          </i>
        </div>
      </li>
    </ul>
  );
};

const PublishQuestions = () => {
  const [publishInfo, setPublishInfo] = useState({
    cameraOn: false,
    randomizeCompetencyQuestions: false,
    randomizeCompetencySections: false,
    isRoundPublished: false,
    randomiseMcqOptions:false
  });
  const [chooseNextStep, setChooseNextStep] = useState("");
  const [showPublishingModal, setShowPublishingModal] = useState(false);
  const [publishingProgress, setPublishingProgress] = useState(0);
  const currentJobId = useSelector(state => state.createNewJobSliceReducer.jobId);
  const roundName = useSelector(state => state.createNewJobSliceReducer.roundName);
  const recruiterRound = useSelector(state => state.defineInterviewSliceReducer.recruiterRound);
  const l1Round = useSelector(state => state.defineInterviewSliceReducer.l1Round);
  const roundsLength = useSelector(state => state.createNewJobSliceReducer.roundsLength);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isNextRoundQueRadioDiabled = (roundName === roundsData.secondRound.name) || (roundsLength === 1);
  
  const isPublished = roundName === 'L1 Hiring Manager Round' 
  ? l1Round?.isRoundPublished 
  : recruiterRound?.isRoundPublished;
  console.log("isPublished",isPublished);
  
  const handleOnChangeSwitchOptions = (e) => {
    const { name, checked } = e.target;
    setPublishInfo((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  useEffect(()=>{
    
    if(roundName === roundsData.firstRound.name) {

      setPublishInfo((prevState)=>({
        ...prevState,
        cameraOn: recruiterRound.cameraOn,
    randomizeCompetencyQuestions: recruiterRound.randomiseCompetancyQuestions,
    randomizeCompetencySections: recruiterRound.randomiseCompetancySections,
    isRoundPublished:recruiterRound.isRoundPublished
      }));
    }
    else if(roundName == roundsData.secondRound.name) {
      setPublishInfo((prevState)=>({
        ...prevState,
        cameraOn: l1Round.cameraOn,
    randomizeCompetencyQuestions: l1Round.randomiseCompetancyQuestions,
    randomizeCompetencySections: l1Round.randomiseCompetancySections,
    isRoundPublished:l1Round.isRoundPublished
    }))
  }
  
  },[roundName]);

  
  const handleOnClickPublish = async (e) => {
    // Show the publishing modal
    setShowPublishingModal(true);
    setPublishingProgress(0);
    
    // Simulate smooth progress over 5 seconds using requestAnimationFrame
    let startTime = Date.now();
    const duration = 5000; // 5 seconds
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      setPublishingProgress(progress);
      
      if (progress < 100) {
        requestAnimationFrame(animateProgress);
      }
    };
    
    requestAnimationFrame(animateProgress);

    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/define-interviews/publish-interviewRound`,
        {
          'interviewRound': roundName,
          'jobId': currentJobId,
          'cameraOn': publishInfo.cameraOn,
          'randomiseCompetancySections': publishInfo.randomizeCompetencySections,
          'randomiseCompetancyQuestions': publishInfo.randomizeCompetencyQuestions,
          'randomiseMcqOptions': publishInfo.randomiseMcqOptions
        }
      );
      
      // Complete the progress
      
      // Wait a bit more for visual effect
      setTimeout(() => {
        setShowPublishingModal(false);
        if (data.status) {
          setPublishInfo((prevState)=>({
            ...prevState,
            isRoundPublished: data.defineInterviewRounds?.roundPublished??false
          }));
          SuccessToast("Interview published successfully");
        }
        ErrorToast(data.message);
      }, 5000);

    } catch (error) {
      setShowPublishingModal(false);
      ErrorToast(error.message);
    }
  };

  useEffect(() => {
    dispatch(getRoundDetails({ jobId: currentJobId }));
  }, [currentJobId]);

  return (
    <div className="sqa-div-2 row">
      <h6 className="center-align">
      {!publishInfo.isRoundPublished &&
          <p>
            Wow! You are almost ready to publish your questionnaire for this
            position
          </p>
      }
      </h6>
      <div className="radios col s12" >
        <div className="col l3 m6 s12 large-screen-center-small-screen-start">
          <SwitchInputFieldContainer
            switchInputFieldIdAndName="cameraOn"
            checked={publishInfo.cameraOn}
            onChange={(e) => handleOnChangeSwitchOptions(e)}
            spanText="Camera On"
            tooltipText="When turned ON, the candidate's camera will remain on while they answer all skill-based questions"
          />
        </div>
        <div className="col l4 m6 s12 large-screen-center-small-screen-start">
          <SwitchInputFieldContainer
            switchInputFieldIdAndName="randomizeCompetencyQuestions"
            checked={publishInfo.randomizeCompetencyQuestions}
            onChange={(e) => handleOnChangeSwitchOptions(e)}
            spanText="Randomize Competency Questions"
            tooltipText="When turned ON, questions within each competency section will be shuffled and delivered in a random order to different candidates"
          />
        </div>
        <div className="col l4 m6 s12 large-screen-center-small-screen-start">
          <SwitchInputFieldContainer
            switchInputFieldIdAndName="randomizeCompetencySections"
            checked={publishInfo.randomizeCompetencySections}
            onChange={(e) => handleOnChangeSwitchOptions(e)}
            spanText="Randomize Competency Sections"
            tooltipText="When turned ON, the order of competency sections will vary for each candidate"
          />
        </div>
        <div className="col l4 m6 s12 large-screen-center-small-screen-start">
          <SwitchInputFieldContainer
            switchInputFieldIdAndName="randomiseMcqOptions"
            checked={publishInfo.randomiseMcqOptions}
            onChange={(e) => handleOnChangeSwitchOptions(e)}
            spanText="Randomize MCQ Options"
            tooltipText="When turned ON, the order of MCQ options will vary for each candidate"
          />
        </div>
      </div>
      &nbsp;
      <div className="flex-center margin-top-15">
        <NormalButton
          buttonTagCssClasses={"btn-clear btn-submit btn-small"}
          buttonText={publishInfo.isRoundPublished?"Published":"Publish"}
          disabled={publishInfo.isRoundPublished?true:false}
          onClick={(e)=>{handleOnClickPublish(e)}}
          style={publishInfo.isRoundPublished ? { backgroundColor: '#666666' } : {}}
        />
        <i className="show-details infermation-ico-black ">
          i
          <Tooltip divTagCssClasses={"infbox-click"}>
          {publishInfo.isRoundPublished ?
              <p>This job is now published</p>
              :
              <p>Publishing this round will prevent you from editing these questions any further</p>
            }
          </Tooltip>
        </i>
      </div>
      <div className="publish-colaspe center-align">
        <PublishingLoader 
        uploadedPercentage={isPublished?100:70}
        />
        
        {/* <a className="waves-effect waves-light btn btn-clear btn-submit btn-small">
          Interview Published
        </a> */}
        <br />
        <div className="publish-questions-nav-section">
          <div className="publish-questions-nav-container">
            <RadioButtonInputField
              groupName={"afterPublishStep"}
              radioButtonValue={NEXT_ROUND_QUESTIONS_ACTION}
              value={chooseNextStep}
              disabled={isNextRoundQueRadioDiabled || isPublished}
              onChange={() => setChooseNextStep(NEXT_ROUND_QUESTIONS_ACTION)}
              labelText={"Create Next Round Questions"}
            />
            <RadioButtonInputField
              groupName={"afterPublishStep"}
              radioButtonValue={INVITE_CANDIDATES_ACTION}
              value={chooseNextStep}
              onChange={() => setChooseNextStep(INVITE_CANDIDATES_ACTION)}
              labelText={"Invite Candidates For This Round"}
            />
          </div>
          <NormalButton
            buttonTagCssClasses={"btn-clear btn-submit btn-small"}
            buttonText={"Submit"}
            disabled={chooseNextStep === ""}
            onClick={() => {
              const route = MAPPED_ROUTES[chooseNextStep];
              if (!route) return;
              if (!currentJobId) {
                return WarningToast("Please select a job")
              }
              if (chooseNextStep === NEXT_ROUND_QUESTIONS_ACTION) {
                // Set next round, or don't show if last round
                if (!roundName && recruiterRound) {
                  dispatch(setRoundName(roundsData.secondRound.name));
                } else if (roundName === roundsData.firstRound.name && l1Round) {
                  dispatch(setRoundName(roundsData.secondRound.name))
                } else {
                  return WarningToast("No next round!");
                }
              }
              navigate(route);
            }}
          />
        </div>

      </div>
      
      {/* Publishing Modal */}
      {showPublishingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Close button */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px'
            }}>
              <button
                onClick={() => setShowPublishingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#333'
                }}
              >
                ×
              </button>
            </div>
            
            {/* Title */}
            <h3 style={{
              margin: '0 0 20px 0',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Preparing your Publish...
            </h3>
            
            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '15px',
              overflow: 'hidden'
            }}>
              <div style={{
                // width: `${publishingProgress}%`,
                height: '100%',
                backgroundColor: '#b99251',
                borderRadius: '4px',
                width: "0%",
                animation: "fillProgress 5s linear forwards"
              }} />
            </div>
            
            {/* Estimated time */}
            <p style={{
              margin: '0 0 15px 0',
              fontSize: '14px',
              color: '#666'
            }}>
              It might take 0-5 secs
            </p>
            
            {/* Info message */}
            <p style={{
              margin: '0',
              fontSize: '12px',
              color: '#666',
              lineHeight: '1.4'
            }}>
              Don't worry, You can also get this under{" "}
              <span style={{ color: '#007bff', cursor: 'pointer' }}>
                "Recently Published Interviews"
              </span>{" "}
              for the next 48 hours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishQuestions;