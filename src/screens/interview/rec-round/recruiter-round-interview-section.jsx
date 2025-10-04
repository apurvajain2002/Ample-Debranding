import { useEffect, useState, useRef } from "react";
import CandidateVideoSection from "./candidate-video-section";
// import CountdownTimer from "../../../features/countdown-timer";
import { useTimer } from "../../../customHooks/use-timer";
import NormalButton from "../../../components/buttons/normal-button";
// import NormalInputField from "../../../components/input-fields/normal-input-field";
import MobileNumberInputField from "../../../components/input-fields/mobile-number-input-field";
import useAudioRecorder from "../../../customHooks/use-audio-recorder";
import {
  getCountryCode,
  getPhoneNumber,
} from "../../../utils/phoneNumberUtils";
import axiosInstance from "../../../interceptors";
import SuccessToast from "../../../components/toasts/success-toast";
import ErrorToast from "../../../components/toasts/error-toast";
import beepSoundMp3 from "../../../resources/audios/beep-sound.mp3";
import { useDispatch, useSelector } from "react-redux";
import { saveCandidate } from "../../../redux/actions/sign-up-actions";
import { setUserId, setUserState } from "../../../redux/slices/signin-slice";
// import { TerminationQuestion } from "../../../components/interview/termination-question";
import QuestionSection from "../../../components/interview/rec-round/question-section";
import InputSubmitComponent from "../../../components/interview/InputSubmitComponent";
import StarRating from "../../../components/interview/StarRating";
import OTPInputComponent from "../../../components/interview/OTPInputComponent";
import { baseUrl } from "../../../config/config";
import { saveCandidateResponse } from "../api";
import { useGlobalContext } from "../../../context";
import { wait200ms } from "../../../utils/functions";
import useCaptureImage from "../../../customHooks/use-capture-image";

const initialTime = 2 * 60;

const RATINGS = [
  { key: "Not Likely", value: "Not Likely" },
  { key: "Somewhat Likely", value: "Somewhat Likely" },
  { key: "Likely", value: "Likely" },
  { key: "Very Likely", value: "Very Likely" },
  { key: "100% Without Doubt", value: "100% Without Doubt" },
];

const RecruiterRoundInterviewSection = ({
  setSplitView = () => { },
  splitView = false,
  currentQuestion = {},
  moveToNextQuestion = () => { },
  enxResult,
  localStream,
  showComponent,
  setCandidateVerified = () => { },
  playCurrentVideo = () => { },
  terminateInterview = () => { },
  currentScriptType = "",
  handleStopRecording = () => { },
  handleStartRecording = () => { },
  setShowComponent = () => { },
  currentQuestionIndex = 0,
  totalQuestions = 0,
  isVideoEnded = false,
  repeatingTimeoutRef,
  localCameraRef,
  forceCamera,
  startStreaming = () => { },
  roomIdRef,
  mcqQuestionCounter,
  candidateVideoFeedbackRef,
  questionDoneRef,
  setIsResumed = () => { },
  setQuestionData = () => { },
  questionData = {},
  link_access_type = 'publicLink',
  dynamicErrorMessage = {},
  startInterviewMonitoring = () => { },
}) => {
  const { privateUserId, setPrivateUserId } = useGlobalContext();

  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const userId = useSelector((state) => state.signinSliceReducer.userId);

  const [text, setText] = useState("");
  // const [rating, setRating] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  // const [terminateAns, setTerminateAns] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionAsked, setQuestionAsked] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileNumberEnabled, setMobileNumberEnabled] = useState(false);
  const [doneRec, setDoneRec] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [time, setTime] = useState(initialTime);
  const { timer, setTimer } = useTimer(20);
  const [recordingStart, setRecordingStart] = useState(false);
  const [showCandidateVideo, setShowCandidateVideo] = useState(false);
  const beepPlayerRef = useRef(null);
  const payloadUserId = link_access_type === "privateLink" ? privateUserId : userId;

  const {
    audioUrl,
    audioBlob,
    isRecording: isAudioRec,
    startRecording: startAudioRec,
    stopRecording: stopAudioRec,
  } = useAudioRecorder();

  console.log('currentQuestionIndex ::: 02', currentQuestionIndex); 
  console.log('mcqQuestionCounter ::: 02', mcqQuestionCounter); 

  const dispatch = useDispatch();

  const { clickPicture } = useCaptureImage();

  // Function to make periodic API calls for skill-based questions
  const makePeriodicApiCall = async () => {
    if (currentScriptType === "skillBased"
      && (currentQuestion.responseType === "mcq" || currentQuestion.responseType === "mcr")
    ) {
      try {
        const snapshotImage = await clickPicture();

        const timeoutId = setTimeout(async () => {
          try {
            await saveCandidateResponse(
              interviewId,
              currentQuestion,
              payloadUserId,
              null,
              null,
              currentScriptType,
              null,
              null,
              null,
              snapshotImage,
              tenantId
            );
          } catch (error) {
            console.error("Error in periodic API call:", error);
            // Don't show error toast for periodic calls to avoid interrupting the interview
          }
        }, 5000);

        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Error capturing image for periodic API call:", error);
        // Don't show error toast for periodic calls to avoid interrupting the interview
      }
    }
  };

  const handleNameSubmit = async () => {
    const names = fullName.split(" ", 2);
    const firstName = names.at(0) || "";
    const lastName = names.at(1) || "";
    const countryCode = getCountryCode(mobileNumber);
    const nationalNumber = getPhoneNumber(mobileNumber);

    let data = null;
    await wait200ms();
    if (link_access_type === "privateLink") {
      try {
        const response = await axiosInstance.post(
          `${baseUrl}/common/user/fetch`,
          {
            firstName,
            lastName,
            mobileNumber1: nationalNumber,
            primaryEmailId: "",
            interviewId,
          }
        );
        data = response.data;
      } catch (error) {
        console.error("Error fetching user data via private link", error);
        return;
      }
    } else {
      const result = await dispatch(
        saveCandidate({
          firstName,
          lastName,
          mobileNumber1: nationalNumber,
          mobileNumber1CountryCode: `+${countryCode}`,
          mobileNumber1Verified: true,
          interviewId,
          tenantId: tenantId || '0',
        })
      );
      data = result.payload;
    }

    if (data?.interviewGiven) {
      return terminateInterview();
    }

    const skipQuestionsList = data?.questionIds;
    if (skipQuestionsList) {
      const updateQuestionData = (questionData, skipList) => {
        const updatedData = {};

        Object.keys(questionData).forEach((key) => {
          if (Array.isArray(questionData[key])) {
            updatedData[key] = questionData[key].filter(
              (question) => !skipList.includes(question.questionId)
            );
          } else {
            updatedData[key] = questionData[key];
          }
        });

        updatedData.questionsCount =
          questionData.questionsCount - skipList.length;
        return updatedData;
      };

      setIsResumed(true);
      setQuestionData((prev) => updateQuestionData(prev, skipQuestionsList));
    }

    const user =
      data?.user ||
      (["Duplicate User", "Resume Interview"].includes(data?.message)
        ? data?.list?.at(0)
        : null);

    if (user) {
      dispatch(
        setUserState({
          userName: user?.firstName,
          userType: "candidate",
          tncStatus: user?.tncStatus ?? false,
          userId: user?.id,
        })
      );
    }

    startInterviewMonitoring(); // Start monitoring after name submission
    moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
  };

  // Handle mobile number submission
  const handleSubmitMobile = () => {
    // setShowMobileInput(false);
  };

  // sends OTP
  const handleSendOTP = async (e, proceed = false) => {
    e.preventDefault();
    setTime(initialTime);
    await wait200ms();
    if (link_access_type === "privateLink") {
      const nationalNumber = getPhoneNumber(mobileNumber);
      try {
        const response = await axiosInstance.post(
          `${baseUrl}/common/user/fetch`,
          {
            "firstName": "",
            "lastName": "",
            "mobileNumber1": nationalNumber,
            "primaryEmailId": "",
            "interviewId": interviewId
          }
        );

        const data = response.data;
        if (
          data.success ||
          response.status === 200 ||
          response.statusText === "OK" || data?.list?.length > 0
        ) {

          const user = data?.list?.at(0);
          // if user already exists
          if (user) {
            setPrivateUserId(user?.id ?? "");
            localStorage.setItem("userId", user?.id)
            setFullName(user?.firstName?.concat(' ', user?.lastName));
            const nextQuestionId = currentQuestion.nextQuestionIfYes;
            const { nextQuestionIfYes } = questionData.openingScript.find(
              (q) => Number(q.questionId) === Number(nextQuestionId)
            );
            startInterviewMonitoring(); // Start monitoring after verification
            moveToNextQuestion(nextQuestionIfYes, currentScriptType);
          }
        }
      } catch (error) {
        ErrorToast(error.message || "Error to fetch data");
      }
      return;
    }

    try {
      const countryCode = getCountryCode(mobileNumber);
      const nationalNumber = getPhoneNumber(mobileNumber);

      const response = await axiosInstance.post(
        `${baseUrl}/common/otp/generate-otp`,
        { phoneCode: `+${countryCode}`, mobileNo: nationalNumber }
      );

      const data = response.data;
      if (
        data.success ||
        response.status === 200 ||
        response.statusText === "OK"
      ) {
        // if user already exists
        if (data.user) {
          const user = data.user;
          localStorage.setItem("myUserId", user.id);
          dispatch(setUserId(user.id));
          const nextQuestionId = currentQuestion.nextQuestionIfYes;
          const { nextQuestionIfYes } = questionData.openingScript.find(
            (q) => Number(q.questionId) === Number(nextQuestionId)
          );
          startInterviewMonitoring(); // Start monitoring after verification
          moveToNextQuestion(nextQuestionIfYes, currentScriptType);
        } else {
          SuccessToast(data.message || "verification code sent successfully!");
          setOtpValue(String(data.otp));
          if (data?.user) {
            setFullName(data?.user?.firstName?.concat(' ', data?.user?.lastName));
          }
          setIsOtpSent(true);
          if (proceed) {
            startInterviewMonitoring(); // Start monitoring after verification
            moveToNextQuestion(
              currentQuestion.nextQuestionIfYes,
              currentScriptType
            );
          }
        }
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the verification code!");
    }
    handleSubmitMobile();
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    handleSendOTP(e, false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp !== otpValue) {
      return ErrorToast("Invalid verification code");
    } else {
      startInterviewMonitoring(); // Start monitoring after OTP verification
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
      setCandidateVerified(true);
    }
    setOtp("");
  };

  const handleQuestionVideoEnded = () => {
    setTimeout(() => setShowNext(true), 10_000);
    if (!questionAsked) {
      setQuestionAsked(true);
      setTimer(
        currentQuestion.responseTimeInMinutes * 60 +
        currentQuestion.responseTimeInSeconds
      );
    }
  };

  // submit feedback after interview
  const submitFeedback = async () => {
    try {
      await saveCandidateResponse(
        interviewId,
        {
          questionId: currentQuestion?.questionId,
          questionType: "feedback",
          responseType: "textbox",
        },
        payloadUserId,
        text,
        null,
        currentScriptType,
        null,
        null,
        null,
        null,
        tenantId
      );
      // on success
      // moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      ErrorToast("Failed to submit feedback. Please try again.");
    }
  };

  const handleEnterYesNo = (respYesNo) => {
    if (respYesNo === "No") {
      moveToNextQuestion(currentQuestion.nextQuestionIfNo, currentScriptType);
    } else if (respYesNo === "Yes") {
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    }
  };

  const handleTermination = async () => {
    terminateInterview();
  };

  // api to save reason when not interested
  const submitNotInterestedReason = async () => {
    setText("");
    handleTermination();
  };

  // api to save rating in feedback
  const submitRating = async (rating) => {
    try {
      // setRating("");
      await saveCandidateResponse(
        interviewId,
        { ...currentQuestion, responseType: currentQuestion.questionType },
        payloadUserId,
        rating,
        null,
        currentScriptType,
        null,
        null,
        null,
        null,
        tenantId
      );
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    } catch (error) {
      console.error("Error submitting rating:", error);
      ErrorToast("Failed to submit rating. Please try again.");
    }
  };

  // api to save stars in feedback
  const starSubmitHandler = async (starCount) => {
    try {
      await saveCandidateResponse(
        interviewId,
        { ...currentQuestion, responseType: currentQuestion.questionType },
        payloadUserId,
        starCount,
        null,
        currentScriptType,
        null,
        null,
        null,
        null,
        tenantId
      );
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    } catch (error) {
      console.error("Error submitting star rating:", error);
      ErrorToast("Failed to submit star rating. Please try again.");
    }
  };

  useEffect(() => {
    // Start countdown if OTP is sent
    if (isOtpSent && time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) return prevTime - 1;
          clearInterval(timerId); // Stop timer when it reaches 0
          return 0;
        });
      }, 1000);

      // Clear interval when component unmounts or time is 0
      return () => clearInterval(timerId);
    }
  }, [isOtpSent, time]);


  useEffect(() => {
    if (time === 0) {
      // Handle timeout behavior (e.g., play beep sound)
      // beepPlayerRef.current?.play();
      // ErrorToast("OTP time expired!");
      setIsOtpSent(false); // Reset OTP sent state
    }
  }, [time]);

  useEffect(() => {
    if (!questionAsked) return;
    switch (timer) {
      case 50: {
        setShowWarning(true);
        setTimeout(() => {
          setShowWarning(false);
        }, 3000);
        break;
      }
      case 20: {
        setShowWarning(true);
        break;
      }
      case 0: {
        // beepPlayerRef?.current?.play();
        if (questionDoneRef.current) return;
        if (
          currentScriptType === "feedBack" &&
          showComponent === "Video" &&
          !roomIdRef.current &&
          isAudioRec
        ) {
          stopAudioRec((blob, url) => {
            saveCandidateResponse(
              interviewId,
              { ...currentQuestion, responseType: "audio" },
              payloadUserId,
              null,
              blob,
              currentScriptType,
              null,
              null,
              null,
              null,
              tenantId
            ).catch(error => {
              console.error("Error saving audio response:", error);
              // Don't show error toast for audio responses to avoid interrupting the interview
            });
          });
        }
        if (
          currentQuestion.questionType !== "filler" &&
          currentQuestion.responseType !== "filler"
        ) {
          moveToNextQuestion(
            currentQuestion.nextQuestionIfYes,
            currentScriptType
          );
        }
        break;
      }
      default:
        break;
    }
  }, [timer]);

  useEffect(() => {
    setShowCandidateVideo(
      (localStream && showComponent === "Video") ||
      (forceCamera && currentScriptType === "skillBased") ||
      (currentScriptType === "feedBack" && showComponent === "Video")
    );
  }, [localStream, showComponent, currentScriptType, forceCamera]);

  useEffect(() => {
    if (showComponent === "Video") {
      handleQuestionVideoEnded();
      setDoneRec(false);
      setRecordingStart(true);
      setSplitView(false);
    }

    if (showComponent === "mcr") {
      setQuestionAsked(true);
      setTimer(
        currentQuestion.responseTimeInMinutes * 60 +
        currentQuestion.responseTimeInSeconds
      );
    }
    if (showComponent === "audio" && !isAudioRec) {
      // Play beep, then start recording after beep ends
      if (beepPlayerRef.current) {
        beepPlayerRef.current.currentTime = 0;
        beepPlayerRef.current.play();
        beepPlayerRef.current.onended = () => {
          setRecordingStart(true);
          setDoneRec(false);
          startAudioRec();
        };
      } else {
        // fallback: start recording if beep ref not ready
        setRecordingStart(true);
        setDoneRec(false);
        startAudioRec();
      }
      setTimer(
        currentQuestion.responseTimeInMinutes * 60 +
        currentQuestion.responseTimeInSeconds
      );
    }
  }, [showComponent]);

  useEffect(() => {
    if (currentScriptType !== "skillBased") return;
    setQuestionAsked(true);
    setTimer(
      currentQuestion.responseTimeInMinutes * 60 +
      currentQuestion.responseTimeInSeconds
    );
  }, [isVideoEnded]);

  useEffect(() => {
    if (currentScriptType === "skillBased"
      && (currentQuestion.responseType === "mcq" || currentQuestion.responseType === "mcr")
    ) {
      makePeriodicApiCall();
    }
  }, [currentQuestion]);

  useEffect(() => {
    setQuestionAsked(false);
    setShowWarning(false);
    // setTimer(0);
    setShowNext(false);
    // setShowTerminationWarning(false);
    setShowQuestion(false);
  }, [currentQuestion]);

  return (
    <div
      className={
        currentScriptType !== "skillBased"
          ? "container l1-interview-round-section"
          : "container vide-robo-wrapper here"
      }
      style={
        currentScriptType === "skillBased"
          ? { height: "calc(100% - 72px)" }
          : {}
      }
    >
      <div className="row height-100">
        <aside
          className={
            currentScriptType !== "skillBased"
              ? "col s12 padding-0 height-100"
              : "col xl8 l8 m6 s12 height-100"
          }
          style={{ width: "100%", padding: "0" }}
        >
          <div className="robo-chattoutwrapper robo-video height-100">
            <div
              className={splitView ? "split-container" : ""}
              style={{ height: "100%", width: "100%" }}
            >
              <div
                className="robo-actiontop"
                style={!splitView ? undefined : { padding: 0 }}
              >
                {showComponent === "Video" ||
                  showComponent === "mcr" ||
                  showComponent === "audio" ||
                  (currentScriptType === "skillBased" &&
                    currentQuestion.questionType !== "filler" &&
                    currentQuestion.responseType !== "filler" &&
                    isVideoEnded) ? ( // for skill based, timer is always there
                  <div
                    className={splitView ? "split-section" : undefined}
                    style={!splitView ? { width: "fit-content" } : {}}
                  >
                    <div className="time-container">
                      {timer <= 100 ? (
                        <>
                          <div className="time-circle-bg">
                            <div className="time-circle-out">
                              <span>{timer}</span> Sec
                            </div>
                          </div>
                          {showWarning ? (
                            <div className="time-warning-bg">
                              <p>Auto-submit</p>
                              <p>will happen</p>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <div className="time-allow">
                          Time allowed
                          <br />
                          {currentQuestion.responseTimeInMinutes ?? 0} Min :{" "}
                          {currentQuestion.responseTimeInSeconds ?? 0} Sec
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {showCandidateVideo && (
                  <div
                    className={
                      currentScriptType === "skillBased"
                        ? "split-section recruiter-round-skillBased "
                        : ""
                    }
                  >
                    <CandidateVideoSection
                      videoSource={localStream?.stream}
                      enxResult={enxResult}
                      splitView={splitView}
                      setSplitView={setSplitView}
                      handleStopRecording={() => {
                        if (currentScriptType !== "skillBased") {
                          handleStopRecording();
                        }
                      }}
                      showViewOptions={false}
                      localCameraRef={localCameraRef}
                      forceCamera={
                        forceCamera ||
                        (currentScriptType === "feedBack" && !roomIdRef.current)
                      }
                      showRecordingBlink={forceCamera || !doneRec}
                    />
                  </div>
                )}

                <audio hidden ref={beepPlayerRef} src={beepSoundMp3}></audio>
              </div>
              {dynamicErrorMessage.isError && (
                <div className="error-screen">
                  {dynamicErrorMessage.errorMessages[dynamicErrorMessage.currentErrorType]}
                </div>
              )}
              {showComponent === "Video" &&
                currentScriptType !== "skillBased" && (
                  <VideoResponse
                    setShowComponent={setShowComponent}
                    currentQuestion={currentQuestion}
                    moveToNextQuestion={moveToNextQuestion}
                    currentScriptType={currentScriptType}
                    showQuestion={showQuestion}
                    setShowQuestion={setShowQuestion}
                    showNext={showNext}
                    roomIdRef={roomIdRef}
                    isAudioRec={isAudioRec}
                    stopAudioRec={() => {
                      stopAudioRec((blob, url) => {
                        saveCandidateResponse(
                          interviewId,
                          { ...currentQuestion, responseType: "audio" },
                          payloadUserId,
                          null,
                          blob,
                          currentScriptType,
                          null,
                          null,
                          null,
                          null,
                          tenantId
                        ).catch(error => {
                          console.error("Error saving audio response:", error);
                          // Don't show error toast for audio responses to avoid interrupting the interview
                        });
                      });
                    }}
                  />
                )}

              {showComponent === "MobileNumberInput" && (
                <>
                  <div className="overlay-content">
                    <div className="otp-container">
                      <div
                        className="container footercontainer input-overlay"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <MobileNumberInputField
                          divTagCssClasses="bg-white"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e)}
                          showVerification={false}
                          isVerified={mobileVerified}
                          setIsVerified={setMobileVerified}
                          // style={{ width: "25rem" }}
                          className="mobile-input"
                          setMobileNumberEnabled={setMobileNumberEnabled}
                          showDropdownBelow={false}
                        />
                        <NormalButton
                          buttonTagCssClasses={"btn-large otp-btn"}
                          buttonText={"Continue"}
                          disabled={!mobileNumberEnabled}
                          onClick={(e) => handleSendOTP(e, true)}
                          style={{ borderRadius: "0" }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {showComponent === "OTPInput" && (
                <OTPInputComponent
                  time={time}
                  handleResendOtp={handleResendOtp}
                  handleVerifyOTP={handleVerifyOTP}
                  isOtpSent={isOtpSent}
                  otp={otp}
                  setOtp={setOtp}
                  setTime={setTime}
                  setIsOtpSent={setIsOtpSent}
                />
              )}

              {showComponent === "FullNameInput" && (
                <InputSubmitComponent
                  state={fullName}
                  setState={setFullName}
                  submitValue={handleNameSubmit}
                  minValueLength={2}
                  placeholder="Enter your full name"
                />
              )}

              {showComponent === "Yes/No" && (
                <>
                  {
                    <div className="overlay-content">
                      <div className="yes-no">
                        <button
                          className="no-button"
                          style={{ marginRight: 10 }}
                          onClick={() => handleEnterYesNo("No")}
                        >
                          {currentQuestion.noText}
                        </button>
                        <button
                          className="yes-button"
                          onClick={() => handleEnterYesNo("Yes")}
                        >
                          {currentQuestion.yesText}
                        </button>
                      </div>
                    </div>
                  }
                </>
              )}

              {showComponent === "reason" && (
                <InputSubmitComponent
                  inputType="text"
                  submitValue={async () => {
                    if (currentScriptType === "openingScript") {
                      await submitNotInterestedReason();
                    } else {
                      await submitFeedback();
                      setText("");
                      moveToNextQuestion(currentQuestion.nextQuestionIfYes);
                    }
                  }}
                  state={text}
                  setState={setText}
                  placeholder={
                    currentScriptType === "openingScript"
                      ? "please enter your reason"
                      : "please enter text here"
                  }
                />
              )}

              {showComponent === "feedback" && (
                <WrapperComponent>
                  {[
                    {
                      key: "text",
                      value: currentQuestion.yesText,
                      onClick: () => {
                        setShowComponent("reason");
                      },
                    },
                    {
                      key: "video",
                      value: currentQuestion.noText,
                      onClick: () => {
                        candidateVideoFeedbackRef.current = true;
                        setDoneRec(false);
                        if (!roomIdRef.current) {
                          startStreaming();
                          setRecordingStart(true);
                          startAudioRec();
                        } else {
                          handleStartRecording();
                        }
                        playCurrentVideo("aviListening");
                        setShowComponent("Video");
                      },
                    },
                  ].map((op) => {
                    return (
                      <a
                        key={op.key}
                        href="#"
                        className="speakbtn"
                        onClick={op.onClick}
                      >
                        {op.value}
                      </a>
                    );
                  })}
                </WrapperComponent>
              )}

              {currentScriptType === "skillBased" && (
                <aside
                  className="col xl4 offset-xl8 l4 m6 s12"
                  id="recruiter-MCR-section"
                >
                  <QuestionSection
                    question={currentQuestion}
                    currentQuestion={currentQuestion}
                    moveToNextQuestion={moveToNextQuestion}
                    recordingStart={recordingStart}
                    audioUrl={audioUrl}
                    audioBlob={audioBlob}
                    stopAudioRecording={() => {
                      if (isAudioRec)
                        stopAudioRec((blob, url) => {
                          saveCandidateResponse(
                            interviewId,
                            { ...currentQuestion, responseType: "audio" },
                            payloadUserId,
                            null,
                            blob,
                            currentScriptType,
                            null,
                            null,
                            null,
                            null,
                            tenantId
                          ).catch(error => {
                            console.error("Error saving audio response:", error);
                            // Don't show error toast for audio responses to avoid interrupting the interview
                          });
                        });
                    }}
                    stopVideoStream={handleStopRecording}
                    terminateInterview={terminateInterview}
                    currentQuestionIndex={currentQuestionIndex}
                    mcqQuestionCounter={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                    enableCandidateActionButton={isVideoEnded}
                    timer={timer}
                    currentScriptType={currentScriptType}
                    confNum={enxResult?.roomData?.conf_num}
                    roomId={roomIdRef.current}
                    doneRec={doneRec}
                    setDoneRec={setDoneRec}
                  />
                </aside>
              )}

              {showComponent === "Stars" && (
                <WrapperComponent>
                  <StarRating onClick={starSubmitHandler} />
                </WrapperComponent>
              )}

              {showComponent === "Rating" && (
                <WrapperComponent>
                  {RATINGS.map((rating) => (
                    <a
                      key={rating.key}
                      href="#"
                      className="speakbtn"
                      onClick={async () => {
                        await submitRating(rating.key);
                        moveToNextQuestion(
                          currentQuestion.nextQuestionIfYes,
                          currentScriptType
                        );
                      }}
                    >
                      {rating.value}
                    </a>
                  ))}
                </WrapperComponent>
              )}

              {showComponent === "repeat" && (
                <>
                  <div className="robo-actionwr">
                    <footer className="upload-footer footerabsolute">
                      <div className="container footercontainer">
                        <div className="row footercontainer-inner">
                          <aside className="col s6 m5 l4 xl2">
                            <a
                              className="waves-effect waves-light btn btn-success-int"
                              onClick={() => {
                                setShowComponent(null);
                                // clear the timeout so it doesn't trigger while repeating
                                if (repeatingTimeoutRef.current) {
                                  clearTimeout(repeatingTimeoutRef.current);
                                }
                                // Repeats the current if no args provided
                                playCurrentVideo();
                              }}
                            >
                              Repeat Information
                            </a>
                          </aside>
                          {/* Dummy for width */}
                          <aside className="col s6 m7 l8 xl10"></aside>
                        </div>
                      </div>
                    </footer>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RecruiterRoundInterviewSection;

const WrapperComponent = ({ children }) => {
  return (
    <>
      <div className="robo-actionwr">
        <footer className="upload-footer footerabsolute">
          <div
            style={{
              display: "flex",
              gap: 5,
              justifyContent: "center",
            }}
          >
            {children}
          </div>
        </footer>
      </div>
    </>
  );
};

const VideoResponse = ({
  currentQuestion = {},
  moveToNextQuestion = () => { },
  currentScriptType = "",
  showQuestion = false,
  setShowQuestion = () => { },
  showNext = false,
  roomIdRef,
  isAudioRec,
  stopAudioRec = () => { },
}) => {
  return (
    <>
      <div className="robo-actionwr">
        <footer className="upload-footer footerabsolute">
          <div className="container footercontainer">
            <div className="row footercontainer-inner">
              <aside className="col xl2 l2 m2 s2">
                <a
                  className="waves-effect waves-light btn btn-success-int"
                  onClick={() => {
                    setShowQuestion((prev) => !prev);
                  }}
                >
                  {showQuestion ? "Hide Question Text" : "Show Question Text"}
                </a>
              </aside>
              {showQuestion && (
                <aside className={`col xl8 l8 m8 s8`}>
                  <div className="discuss-box">
                    <p>{currentQuestion.questionText}</p>
                  </div>
                </aside>
              )}
              <aside
                className={
                  showQuestion ? `col xl2 l2 m2 s2` : `col offset-s8 s2`
                }
              >
                {showNext ? (
                  <button
                    className="waves-effect waves-light btn btn-clear btn-submit nextbtn"
                    onClick={() => {
                      if (
                        currentScriptType === "feedBack" &&
                        !roomIdRef.current
                      ) {
                        if (isAudioRec) {
                          stopAudioRec();
                        }
                      }
                      moveToNextQuestion(
                        currentQuestion.nextQuestionIfYes ||
                        currentQuestion.nextQuestionIfNo,
                        currentScriptType
                      );
                    }}
                  >
                    DONE
                  </button>
                ) : null}
              </aside>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
