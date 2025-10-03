import QuestionsAddedSoFarSection from "./questions-added-so-far-section";
import SetInterviewSection from "./set-interview-section";
import SetBasicDetailsOfQuestion from "./set-basic-details-of-question";
import NormalButton from "../../../components/buttons/normal-button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobQuestions,
  setNewQuestion,
  setQuestionData,
  clearCurrentQuestion,
} from "../../../redux/slices/create-new-question-slice";
import { useEffect, useState } from "react";
import {
  getAllQuestions,
  getAllOpeningScriptQuestions,
} from "../../../redux/actions/create-new-question-actions/create-new-question-actions";
import WarningToast from "../../../components/toasts/warning-toast";
import { throttle } from "lodash";
import ErrorToast from "../../../components/toasts/error-toast";
import { getInitialResponseTimes } from "../../../utils/defaultResponseTimes";

const NewQuestion = ({ jobName, roundName, entityId, jobId, hiringType }) => {
  const { userId, userType } = useSelector((state) => state.signinSliceReducer);
  const { currentJob } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { currentEntity } = useSelector((state) => state.entitySliceReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { allNotPublishedJobs,recruiterRound, l1Round } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const isPublished = roundName === 'L1 Hiring Manager Round' 
  ? l1Round?.isRoundPublished 
  : recruiterRound?.isRoundPublished;
 

  const {
    newQuestion,
    jobQuestions,
    isLoadingJobQuestions,
    isAboutCompanySet,
  } = useSelector((state) => state.createNewQuestionSliceReducer);

  const [questionType, setQuestionType] = useState("");

  const showWarningToast = throttle(() => {
    WarningToast(
      `Please select ${!jobName ? "position name" : ""} ${
        !jobName && !roundName ? "and" : ""
      } ${!roundName ? "round name" : ""}!`
    );
  }, 5000);

  // Handle Clear Questions
  const clearQuestion = () => {
    const [mins, seconds] = getInitialResponseTimes(newQuestion.responseType);
    dispatch(
      setNewQuestion({
        questionId: "",
        questionType: newQuestion.questionType,
        responseType: newQuestion.responseType,
        competency: "",
        responseTimeInMinutes: mins,
        responseTimeInSeconds: seconds,
        originalQuestion: "",
        // In case of mcq, mcr type
        questionOptions: [],

        // In case of l1 round && probe questions
        isProbeQuestion: false,
        probeQuestions: [],

        // In case of not a probe question
        isEnhanced: false,
        enhancedMediaType: "",
        enhancedMedia: "",
        enhancedMediaText: "",
        s3Url: "",

        // Question translations
        questionBankTranslations: [],
      })
    );
    // Reset fetched question data as well
    dispatch(setQuestionData());
    // dispatch(clearCurrentQuestion());
  };

  const handleOnChangeNewQuestion = (e) => {
    
    if (!jobName || !roundName) {
      return showWarningToast();
    }
    
    // Check if userType is available before proceeding
    if (!userType) {
      console.warn('userType is not available, cannot proceed with question change');
      return;
    }
    
    const { name, value, checked } = e.target;
    
    // Only call getAllOpeningScriptQuestions for specific question types
    const openingClosingScriptTypes = [
      "openingScript",
      "closingScript", 
      "practiceQuestion",
    ];


    
    if (openingClosingScriptTypes.includes(e.target.value)) {
      // Check if currentEntity and currentJob are available
      console.log("xxxx",openingClosingScriptTypes.includes(e.target.value),currentJob,roundName,currentJob.hiringType
      ,userType,jobId);

      // Additional validation before dispatching
      if (!currentJob || !currentJob.orgId) {
        console.warn('currentJob or currentJob.orgId is not available');
        return;
      }
      
      if (!userType) {
        console.warn('userType is not available');
        return;
      }

      // Use e.target.value as scriptType since questionType might not be updated yet
      const actionPayload = {
        scriptType: e.target.value,
        jobId: jobId,
        interviewRound: roundName,
        entityId: currentJob.orgId,
        hiringType: currentJob.hiringType,
        userType: userType,
        userId: userId,
      };
      
      console.log('Dispatching getAllOpeningScriptQuestions with payload:', actionPayload);
      
      dispatch(
        getAllOpeningScriptQuestions(
          actionPayload,
          { rejectWithValue: ErrorToast }
        )
      );
    }
    if (
      name === "originalQuestion" &&
      (questionType === "openingScript" ||
        questionType === "closingScript" ||
        questionType === "practiceQuestion")
    ) {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          questionText: value,
        })
      );
      return;
    }

    let updates = {};
    switch (name) {
      case "isProbeQuestion":
      case "isEnhanced":
        updates = { [name]: checked };
        break;

      case "questionType":
        if (value === "openingScript" || value === "closingScript") {
          clearQuestion();
          dispatch(setNewQuestion({ scriptType: value }));
          return;
        }
        updates = {
          questionType: value,
          responseTimeInMinutes: "00",
          responseTimeInSeconds: "00",
          responseType:
            value === "filtration"
              ? "mcr"
              : value === "skillBased" &&
                roundName === "L1 Hiring Manager Round"
              ? "video"
              : "",
        };
        break;

      case "terminateInterview":
        updates = { terminateInterview: !newQuestion.terminateInterview };
        break;

      case "responseType":
        {
          let options = newQuestion?.questionOptions;

          // commenting below logic, need to verify if necessary
          // if (newQuestion?.responseType === "mcq" && value !== "mcq") {
          //   options = [];
          // }

          updates = {
            responseType: value,
            competency: "",
            questionOptions: options,
          };
        }
        break;

      default:
        updates = { [name]: value };
    }
    dispatch(
      setNewQuestion({
        ...newQuestion,
        ...updates,
      })
    );
    if (value === "questionType") {
      dispatch(getAllQuestions({ jobId, roundName }));
    }
  };

  const getAllOpeningClosingScripts = (scriptType) => {
    // Check if currentEntity and currentJob exist before accessing their properties
    if (!currentEntity || !currentEntity.id) {
      console.warn('currentEntity is not available, cannot fetch opening/closing scripts');
      return;
    }
    
    if (!currentJob || !currentJob.hiringType) {
      console.warn('currentJob is not available, cannot fetch opening/closing scripts');
      return;
    }
    
    // Check if userType is available
    if (!userType) {
      console.warn('userType is not available, cannot fetch opening/closing scripts');
      return;
    }
    
    dispatch(
      getAllOpeningScriptQuestions(
        {
          scriptType: scriptType,
          jobId: jobId,
          entityId: currentEntity.id,
          interviewRound: roundName,
          hiringType: currentJob.hiringType,
          userType: userType,
          userId: userId,
        },
        { rejectWithValue: ErrorToast }
      )
    );
  };

  const handleGetAllQuestions = () => {
    const openingClosingScriptTypes = [
      "openingScript",
      "closingScript",
      "practiceQuestion",
    ];
    if (jobId && roundName) {
      if (openingClosingScriptTypes.includes(questionType)) {
        // Only call getAllOpeningClosingScripts if we have the required data
        if (currentEntity && currentEntity.id && currentJob && currentJob.hiringType && userType) {
          getAllOpeningClosingScripts(questionType);
        } else {
          console.warn('Missing required data for opening/closing scripts:', {
            currentEntity: !!currentEntity,
            currentJob: !!currentJob,
            userType: !!userType,
            questionType
          });
        }
      } else {
        dispatch(getAllQuestions({ jobId, roundName }));
      }
    }
  };

  useEffect(() => {
    // show the 'about company opening script' to recruiter
    if (
      (userType === "recruiter" || userType !== "admin") &&
      questionType === "openingScript" &&
      jobQuestions?.length > 0 &&
      !isAboutCompanySet
    ) {
      dispatch(setQuestionData());
      dispatch(setNewQuestion(jobQuestions[0]));
    }
  }, [jobQuestions]);

  useEffect(() => {
    clearQuestion();
      handleGetAllQuestions();
    return () => {
      dispatch(setJobQuestions([]));
    };
  }, [jobId, roundName, questionType]);

  useEffect(() => {
    clearQuestion();
    setQuestionType("");
  }, [roundName]);

  return (
    <>
      {/* <!-- Question type, competency, response time section--> */}
      <SetBasicDetailsOfQuestion
        roundName={roundName}
        newQuestion={newQuestion}
        setNewQuestion={setNewQuestion}
        handleOnChangeNewQuestion={handleOnChangeNewQuestion}
        questionType={questionType}
        setQuestionType={setQuestionType}
        userType={userType}
        clearQuestion={clearQuestion}
      />

      {/* Question Details */}
      <SetInterviewSection
        jobName={jobName}
        roundName={roundName}
        newQuestion={newQuestion}
        questionType={questionType}
        setNewQuestion={setNewQuestion}
        handleOnChangeNewQuestion={handleOnChangeNewQuestion}
        handleGetAllQuestions={handleGetAllQuestions}
        clearQuestion={clearQuestion}
        entityId={entityId}
        jobId={jobId}
        hiringType={hiringType}
        userType={userType}
        // hasNoQuestions={(jobQuestions || []).length === 0}
      />

      {/* Bottom section Questions added so far */}
      <section className="question-added-wrap">
        <div className="padding-0 row-column-align-large-screen-space-between-small-screen-center">
          <h3>Questions added so far</h3>
        </div>
        <QuestionsAddedSoFarSection
          questionType={questionType}
          jobQuestions={jobQuestions}
          isLoadingJobQuestions={isLoadingJobQuestions}
          handleGetAllQuestions={handleGetAllQuestions}
          isPublished={isPublished}
        />
        <NormalButton
          buttonTagCssClasses={"btn-clear btn-submit width-200px"}
          buttonText={"Next"}
          onClick={() => navigate("/admin/shuffle-questions/1")}
          style={{ float: "right", margin: "10px 0 0" }}
        />
      </section>
    </>
  );
};

export default NewQuestion;
