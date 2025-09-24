import { useEffect, useRef, useState } from "react";
import Answer from "./questions/answer";
import Question from "./questions/question";
import QuestionNumber from "./questions/question-number";
import DoneButton from "./questions/done-button";
import WarningToast from "../../toasts/warning-toast";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { TerminationQuestion } from "../termination-question";
import { saveCandidateResponse } from "../../../screens/interview/api";
import useCaptureImage from "../../../customHooks/use-capture-image";
import ErrorToast from "../../toasts/error-toast";

const QuestionSection = ({
  question,
  currentQuestion,
  moveToNextQuestion,
  recordingStart,
  audioUrl,
  audioBlob,
  stopAudioRecording,
  stopVideoStream,
  terminateInterview = () => { },
  // currentQuestionIndex = 0,
  totalQuestions = 0,
  enableCandidateActionButton = false,
  timer,
  mcqQuestionCounter,
  currentScriptType,
  confNum,
  roomId,
  doneRec,
  setDoneRec,
}) => {
  const userId = useSelector((state) => state.signinSliceReducer.userId);
  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const submitAudioThroughDoneRef = useRef(false);

  const [answer, setAnswer] = useState(undefined);
  const [showTerminationWarning, setShowTerminationWarning] = useState(false);
  const [terminate, setTerminate] = useState(undefined);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [recordingStopped, setRecordingStopped] = useState(false);
  let respType = question.responseType;
  let questionType = question.questionType;

  let options = [];
  if (respType === "mcq" || respType === "mcr") {
    options = JSON.parse(question.questionOptions);
  }

  const { clickPicture } = useCaptureImage();

  const saveAndReset = async () => {
    if (
      currentScriptType === "skillBased" &&
      (respType !== "video" && respType !== "audio") && (respType === "mcq" || respType === "mcr")
    ) {
      const snapshotImage = await clickPicture();
      try {
        await saveCandidateResponse(
          interviewId,
          question,
          userId,
          answer ?? "",
          audioBlob,
          currentScriptType,
          null,
          confNum,
          roomId,
          snapshotImage,
          tenantId
        );
        setTerminate(undefined);
        setShowTerminationWarning(false);
        setAnswer(undefined);
        setDoneRec(true);
      } catch (error) {
        console.error("Error saving candidate response:", error);
        // Show user-friendly error message
        ErrorToast("Failed to save your response. Please try again or contact support if the issue persists.");
        // Don't throw error, continue with the flow
        setTerminate(undefined);
        setShowTerminationWarning(false);
        setAnswer(undefined);
        setDoneRec(true);
      }
      return;
    }

    try {
      if (
        currentScriptType === "skillBased" &&
        respType !== "video" &&
        respType !== "audio"
      ) {
        await saveCandidateResponse(
          interviewId,
          question,
          userId,
          answer ?? "",
          audioBlob,
          currentScriptType,
          null,
          confNum,
          roomId,
          tenantId
        );
      }
      setTerminate(undefined);
      setShowTerminationWarning(false);
      setAnswer(undefined);
      setDoneRec(true);
    } catch (error) {
      console.error("Error saving candidate response:", error);
      // Show user-friendly error message
      ErrorToast("Failed to save your response. Please try again or contact support if the issue persists.");
      // Don't throw error, continue with the flow
      setTerminate(undefined);
      setShowTerminationWarning(false);
      setAnswer(undefined);
      setDoneRec(true);
    }
  };

  const onClickNext = async () => {
    if (questionType === "filtration" && question?.terminateInterview) {
      let selectedOption = options.find(
        (option) => option.optionKey === answer
      );
      if (!selectedOption) return WarningToast("Please select an option");
      if (!selectedOption.correct) return setShowTerminationWarning(true);
    }
    if (
      questionType === "skillBased" &&
      respType === "audio" &&
      !submitAudioThroughDoneRef.current
    ) {
      setAnswer(undefined);
      setDoneRec(true);
      await stopAudioRecording();
    }
    if (questionType === "skillBased" && respType === "video") {
      setAnswer(undefined);
      setDoneRec(false);
      await stopVideoStream();
    }
    try {
      await saveAndReset();
    } catch (error) {
      console.log("Error in Saving response : ", error.message || error);
      // Error is already handled in saveAndReset, so we don't need to show another toast here
    }
    submitAudioThroughDoneRef.current = false;
    moveToNextQuestion();
  };

  const onClickSkip = async () => {
    try {
      // Skip without saving any response
      setAnswer(undefined);
      setDoneRec(true);
      moveToNextQuestion();
    } catch (error) {
      console.log("Error in Skipping question : ", error.message || error);
    }
  };

  useEffect(() => {
    async function action() {
      if (Number(timer) === 0) {
        if (questionType === "skillBased" && respType === "audio") {
          setAnswer(undefined);
          setDoneRec(true);
          await stopAudioRecording();
        }

        if (questionType === "skillBased" && respType === "video") {
          setAnswer(undefined);
          setDoneRec(true);
          await stopVideoStream();
        }

        await saveAndReset();
      }
    }

    action();
  }, [timer]);

  useEffect(() => {
    // For audio questions, show DoneButton only when recording is active and not stopped
    if (respType === "audio" && questionType === "skillBased") {
      setShowDoneButton(
        recordingStart && enableCandidateActionButton && !recordingStopped
      );
    } else {
      // For video questions, keep the original logic
      setShowDoneButton(
        (respType === "video" || respType === "audio") &&
        recordingStart &&
        !doneRec &&
        enableCandidateActionButton &&
        questionType === "skillBased"
      );
    }
  }, [
    respType,
    recordingStart,
    doneRec,
    enableCandidateActionButton,
    questionType,
    recordingStopped,
  ]);

  // Show Skip button based on question type and state
  useEffect(() => {
    if (respType === "mcq" || respType === "mcr") {
      // For MCQ/MCR: show skip until an option is selected
      setShowSkipButton(!showNextButton);
    } else if (respType === "video") {
      // For video: show skip until done is clicked
      setShowSkipButton(!doneRec);
    } else if (respType === "audio") {
      // For audio: show skip until recording is stopped
      setShowSkipButton(!recordingStopped);
    } else {
      // For other question types: show skip until next button appears
      setShowSkipButton(!showNextButton);
    }
  }, [showNextButton, doneRec, recordingStopped, respType]);

  // Reset states when question changes
  useEffect(() => {
    setShowNextButton(false);
    setShowSkipButton(true); // Start with skip button visible
  }, [question]);

  useEffect(() => {
    if (showTerminationWarning && terminate === "no") {
      setShowTerminationWarning(false);
      setAnswer(undefined);
      setTerminate(undefined);
    }
  }, [terminate, showTerminationWarning]);

  // Only show upper DoneButton for audio/video questions
  const isMediaQuestion = respType === "audio" || respType === "video";

  // Show Next button when an option is selected or when video/audio recording is done
  useEffect(() => {
    const shouldShowNext = (answer !== undefined && answer !== "") ||
      (isMediaQuestion && doneRec && (answer === "Recorded" || answer === "Recorded."));
    setShowNextButton(shouldShowNext);
  }, [answer, doneRec, isMediaQuestion, respType]);

  return (
    <div className="chatt-box">
      <QuestionNumber
        currentQuestionIndex={mcqQuestionCounter}
        totalQuestions={totalQuestions}
      />
      <Question
        question={question}
        setAnswer={setAnswer}
        options={options}
        type={respType}
      />
      {/* Only show upper DoneButton for audio/video questions */}
      {showDoneButton && isMediaQuestion ? (
        <DoneButton
          type={respType}
          recordingStopped={recordingStopped}
          stopAudioRecording={() => {
            submitAudioThroughDoneRef.current = true;
            stopAudioRecording();
            setDoneRec(true);
            setAnswer("Recorded");
            setRecordingStopped(true);
          }}
          stopVideoRecording={() => {
            stopVideoStream();
            setDoneRec(true);
            setAnswer("Recorded.");
          }}
        />
      ) : null}
      {answer || respType === "codeSnippet" ? (
        <Answer
          answer={answer}
          setAnswer={setAnswer}
          options={options}
          type={respType}
        />
      ) : null}
      {showTerminationWarning ? (
        <TerminationQuestion
          onYes={() => {
            terminateInterview();
          }}
          onNo={() => {
            setShowTerminationWarning(false);
            setAnswer(undefined);
          }}
          centered={false}
        />
      ) : null}
      {/* Show Next button for questions with options or completed media recordings */}
      {questionType !== "filler" &&
        respType !== "filler" &&
        enableCandidateActionButton &&
        !showTerminationWarning &&
        !showDoneButton &&
        showNextButton && (
          <div className="btn-wr btnwr-next" style={{ textAlign: 'center', marginTop: '20px' }}>
            <a
              className="waves-effect waves-light btn btn-clear btn-submit btn-small"
              href="#"
              onClick={onClickNext}
            >
              NEXT
            </a>
          </div>
        )}

      {/* Show Skip button independently based on question type */}
      {questionType !== "filler" &&
        respType !== "filler" &&
        enableCandidateActionButton &&
        !showTerminationWarning &&
        showSkipButton && (
          <div className="btn-wr btnwr-next" style={{ textAlign: 'center', marginTop: '10px' }}>
            <a
              className="waves-effect waves-light btn btn-clear btn-small"
              href="#"
              onClick={onClickSkip}
              style={{
                backgroundColor: '#ff9800',
                color: 'white',
                border: '1px solid #ff9800'
              }}
            >
              SKIP
            </a>
          </div>
        )}
    </div>
  );
};

export default QuestionSection;