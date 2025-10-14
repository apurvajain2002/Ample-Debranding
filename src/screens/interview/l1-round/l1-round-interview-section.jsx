import { useEffect, useRef, useState } from "react";
import CandidateVideoSection from "./candidate-video-section";
import CountdownTimer from "../../../features/countdown-timer";
import { useTimer } from "../../../customHooks/use-timer";
import NormalButton from "../../../components/buttons/normal-button";
import NormalInputField from "../../../components/input-fields/normal-input-field";
import MobileNumberInputField from "../../../components/input-fields/mobile-number-input-field";
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
import useApiWithDiagnostics from "../../../customHooks/use-api-with-diagnostics";
import { TerminationQuestion } from "../../../components/interview/termination-question";
import { baseUrl } from "../../../config/config";
import { VIEWS } from "./index";
import { useGlobalContext } from "../../../context";
import { fullscreenAPI, getDeviceInfo } from "../../../utils/browserCompatibility";
import BrowserCompatibilityWarning from "../../../components/miscellaneous/browser-compatibility-warning";
import OTPInputComponent from "../../../components/interview/OTPInputComponent";
import InputSubmitComponent from "../../../components/interview/InputSubmitComponent";
import StarRating from "../../../components/interview/StarRating";
import useInterviewDiagnostics from "../../../customHooks/use-interview-diagnostics";


const initialTime = 2 * 60;

const RATINGS = [
  { key: "Not Likely", value: "Not Likely" },
  { key: "Somewhat Likely", value: "Somewhat Likely" },
  { key: "Likely", value: "Likely" },
  { key: "Very Likely", value: "Very Likely" },
  { key: "100% Without Doubt", value: "100% Without Doubt" },
];

const COUNTED_QUESTION_TYPES = new Set(["filtration", "skillBased"]);

const L1RoundInterviewSection = ({
  setView = () => { },
  view = VIEWS.SPLIT,
  currentQuestion = {},
  moveToNextQuestion = () => { },
  enxResult,
  localStream,
  showComponent,
  setCandidateVerified = () => { },
  playCurrentVideo = () => { },
  terminateInterview = () => { },
  currentScriptType = "",
  handleStartRecording = () => { },
  handleStopRecording = () => { },
  setShowComponent = () => { },
  repeatingTimeoutRef,
  totalQuestions = 0,
  questionDoneRef,
  candidateVideoFeedbackRef,
  practiceLink,
  currentIndex,
  currentSkillIndex,
  savedIdRef = { current: [] },
  setQuestionData = () => { },
  setIsResumed = () => { },
  questionData = {},
  link_access_type = 'publicLink',
  dynamicErrorMessage = {},
  startInterviewMonitoring = () => { },
  startStreaming = () => { },
  stopStream = () => { },
  isStreaming = false,
  videoRef = null,
}) => {
  // useInterviewDiagnostics();
  // console.log('l1 round interview section dynamicErrorMessage ::: 121212', dynamicErrorMessage);
  const { privateUserId } = useGlobalContext();
  const { saveCandidateResponse } = useApiWithDiagnostics();
  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const userId = useSelector((state) => state.signinSliceReducer.userId);

  const [text, setText] = useState("");
  const [terminateAns, setTerminateAns] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionAsked, setQuestionAsked] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [mobileNumberEnabled, setMobileNumberEnabled] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [time, setTime] = useState(initialTime);
  const { timer, setTimer } = useTimer(0);
  const [showTerminationWarning, setShowTerminationWarning] = useState(false);
  const [showRotateOverlay, setShowRotateOverlay] = useState(false);

  const payloadUserId = link_access_type === "privateLink" ? privateUserId : userId ?? '';

  const shouldShowQuestionNumber =
    currentScriptType === "skillBased" &&
    COUNTED_QUESTION_TYPES.has(currentQuestion?.questionType);

  /* console.log('l1 round interview section payloadUserId ::: ', payloadUserId);
  console.log('l1 round interview section privateUserId ::: ', privateUserId);
  console.log('l1 round interview section userId ::: ', userId);
  console.log('l1 round interview section link_access_type ::: ', link_access_type); */

  const dispatch = useDispatch();

  // Orientation overlay for iPhone
  useEffect(() => {
    const deviceInfo = getDeviceInfo();
    const handleOrientation = () => {
      if (deviceInfo.isIos && window.innerHeight > window.innerWidth) {
        setShowRotateOverlay(true);
      } else {
        setShowRotateOverlay(false);
      }
    };
    window.addEventListener('resize', handleOrientation);
    handleOrientation();
    return () => window.removeEventListener('resize', handleOrientation);
  }, []);

  // Fullscreen logic at start of interview
  useEffect(() => {
    async function goFullScreen() {
      try {
        await fullscreenAPI.request(document.documentElement);
        document.body.classList.add("simulate-fullscreen");
      } catch (error) {
        console.warn('Fullscreen not supported or denied, continuing without fullscreen');
        // Continue without fullscreen if not supported
      }
    }
    goFullScreen();
    return () => {
      document.body.classList.remove("simulate-fullscreen");
    };
  }, []);

  // Logic to handle name submission
  const handleNameSubmit = async () => {
    // setIsNameEntered(true);

    const names = fullName.split(" ", 2);
    const firstName = names.at(0) || "";
    const lastName = names.at(1) || "";
    const countryCode = getCountryCode(mobileNumber);
    const nationalNumber = getPhoneNumber(mobileNumber);

    const { payload: data } = await dispatch(
      saveCandidate({
        firstName,
        lastName,
        mobileNumber1: nationalNumber,
        mobileNumber1CountryCode: `+${countryCode}`,
        mobileNumber1Verified: true,
        interviewId: interviewId,
        tenantId: tenantId || '0',
      })
    );

    // Interview completed for candidate
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

        return updatedData;
      };
      setIsResumed(true);
      setQuestionData((prev) => updateQuestionData(prev, skipQuestionsList));
    }

    if (data?.success || data?.status) {
      const user = data.user;
      dispatch(
        setUserState({
          userName: user?.firstName,
          userType: "candidate",
          tncStatus: user?.tncStatus || false,
          userId: user?.id,
        })
      );
    } else if (data?.message === "Duplicate User" || data?.message === "Resume Interview") {
      const user = data?.list?.at(0);
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
    }

    startInterviewMonitoring();
    moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
  };

  const beepPlayerRef = useRef(null);

  // Handle mobile number submission
  const handleSubmitMobile = () => {
    // setShowMobileInput(false);
  };

  // sends OTP
  const handleSendOTP = async (e, proceed = false) => {
    e.preventDefault();
    setTime(initialTime);

    try {
      // setLoading(true);
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
          const nextQuestionId = currentQuestion.nextQuestionIfYes;
          const { nextQuestionIfYes } =
            questionData.openingScript.find(
              (q) => Number(q.questionId) === Number(nextQuestionId)
            );
          startInterviewMonitoring();
          moveToNextQuestion(nextQuestionIfYes, currentScriptType);
          dispatch(setUserId(data.user.id));
        } else {
          SuccessToast(data.message || "verification code sent successfully!");
          setOtpValue(String(data.otp));
          setIsOtpSent(true);
          if (proceed) {
            startInterviewMonitoring();
            moveToNextQuestion(
              currentQuestion.nextQuestionIfYes,
              currentScriptType
            );
          }
        }
      }
    } catch (error) {
      ErrorToast(error.message || "Error sending the verification code!");
    } finally {
      // setLoading(false);
    }
    handleSubmitMobile();
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
      beepPlayerRef.current?.play();
      // ErrorToast("OTP time expired!");
      setIsOtpSent(false); // Reset OTP sent state
      setIsOtpSent(false); // Reset OTP sent state
    }
  }, [time]);

  const handleResendOtp = async (e) => {
    e.preventDefault();
    handleSendOTP(e, false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp !== otpValue) {
      return ErrorToast("Invalid verification code");
    } else {
      startInterviewMonitoring();
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
    let id = currentQuestion?.questionId;
    if (id && savedIdRef.current.findIndex((qid) => qid === id) === -1) {
      savedIdRef.current.push(id);
      try {
        await saveCandidateResponse(
          interviewId,
          {
            questionId: id,
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
      } catch (error) {
        console.error("Error submitting feedback:", error);
        ErrorToast("Failed to submit feedback. Please try again.");
      }
    }
  };

  const handleEnterYesNo = (respYesNo) => {
    // console.log('l1 round interview section handleEnterYesNo ::: ', respYesNo);
    if (respYesNo === "No") {
      moveToNextQuestion(currentQuestion.nextQuestionIfNo, currentScriptType);
    } else if (respYesNo === "Yes") {
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    }
  };

  const handleTermination = terminateInterview;

  // api to save reason when not interested
  const submitNotInterestedReason = async () => {
    setText("");
    // console.log("Reason submission");
    handleTermination();
  };

  // api to save rating in feedback
  const submitRating = async (rating) => {
    let id = currentQuestion.questionId;
    if (id && savedIdRef.current.findIndex((qid) => qid === id) === -1) {
      savedIdRef.current.push(id);
      try {
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
    } else {
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    }
  };

  //
  const starSubmitHandler = async (starCount) => {
    let id = currentQuestion.questionId;
    if (id && savedIdRef.current.findIndex((qid) => qid === id) === -1) {
      savedIdRef.current.push(id);
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
    } else {
      moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
    }
  };

  const saveMCRResponse = async (optionKey) => {
    let id = currentQuestion.questionId;
    if (id && savedIdRef.current.findIndex((qid) => qid === id) === -1) {
      savedIdRef.current.push(id);
      try {
        await saveCandidateResponse(
          interviewId,
          currentQuestion,
          payloadUserId,
          optionKey,
          null,
          currentScriptType,
          null,
          null,
          null,
          null,
          tenantId
        );
      } catch (error) {
        console.error("Error saving MCR response:", error);
        ErrorToast("Failed to save your response. Please try again.");
      }
    }
  };

  useEffect(() => {
    const effect = async () => {
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
          // Save empty and go to next question, don't stop the interview
          if (questionDoneRef.current) return;
          if (showComponent === "mcr") await saveMCRResponse("");
          // beepPlayerRef?.current?.play();
          moveToNextQuestion(
            currentQuestion.nextQuestionIfYes,
            currentScriptType
          );
          break;
        }
        default:
          break;
      }
    };

    effect();
  }, [timer]);

  useEffect(() => {
    // need to check and update
    if (showComponent === "Video") {
      handleQuestionVideoEnded();
    }

    if (showComponent === "playback") {
      setTimeout(() => setShowNext(true), 10_000);
    }

    if (showComponent === "mcr") {
      setQuestionAsked(true);
      setTimer(
        currentQuestion.responseTimeInMinutes * 60 +
        currentQuestion.responseTimeInSeconds
      );
    }
  }, [showComponent]);

  useEffect(() => {
    setQuestionAsked(false);
    setShowWarning(false);
    setTimer(0);
    setShowNext(false);
    setShowTerminationWarning(false);
    setShowQuestion(false);
    setText("");
  }, [currentQuestion]);

  return (
    <>
      <BrowserCompatibilityWarning />
      {showRotateOverlay && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.9)", color: "#fff", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"
        }}>
          <h2>Please rotate your device</h2>
          <p>This interview works best in landscape mode.</p>
        </div>
      )}
      <div
        className="container l1-interview-round-section"
        style={{
          ...(view === VIEWS.SPLIT ? { top: "70px", position: "absolute" } : {}),
        }}
      >
        <div className="row height-100">
          <aside className="col xl12 l12 m12 s12 padding-0 height-100">
            <div className="robo-chattoutwrapper robo-video height-100">
              <div
                className={view === VIEWS.SPLIT ? "split-container" : ""}
                style={{ height: "100%", width: "100%" }}
              >
                <div
                  className="robo-actiontop"
                  style={view !== VIEWS.SPLIT ? undefined : { padding: 0 }}
                >
                  {showComponent === "Video" || showComponent === "mcr" ? (
                    <div
                      className={
                        view === VIEWS.SPLIT ? "split-section" : undefined
                      }
                      style={
                        view !== VIEWS.SPLIT
                          ? { width: "fit-content" }
                          : undefined
                      }
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

                  {localStream && showComponent === "Video" ? (
                    <div className={view === VIEWS.SPLIT ? "split-section" : ""}>
                      <CandidateVideoSection
                        videoSource={localStream.stream}
                        enxResult={enxResult}
                        view={view}
                        setView={setView}
                        handleStopRecording={handleStopRecording}
                        showRecordingBlink={!!localStream}
                      />
                    </div>
                  ) : null}

                  <audio hidden ref={beepPlayerRef} src={beepSoundMp3}></audio>
                </div>
                {dynamicErrorMessage.isError && (
                  <div className="error-screen">
                    {dynamicErrorMessage.errorMessages[dynamicErrorMessage.currentErrorType]}
                  </div>
                )}
                {showComponent === "Video" && (
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
                                {showQuestion
                                  ? "Hide Question Text"
                                  : "Show Question Text"}
                              </a>
                            </aside>
                            {showQuestion && (
                              <aside className={`col xl8 l8 m8 s8`}>
                                <div className="discuss-box" style={{ textAlign: "justify" }}>
                                  <p style={{ textAlign: "justify", padding: 0 }}>
                                    <span style={{ color: "black", fontWeight: "bold", padding: 0 }}>
                                      {shouldShowQuestionNumber
                                        ? `Q${currentIndex}/${totalQuestions}.`
                                        : null}{" "}
                                    </span>
                                    {currentQuestion.questionText}
                                  </p>
                                </div>
                              </aside>
                            )}
                            <aside
                              className={
                                showQuestion
                                  ? `col xl2 l2 m2 s2`
                                  : `col offset-s8 s2`
                              }
                            >
                              {showNext ? (
                                <button
                                  className="waves-effect waves-light btn btn-clear btn-submit nextbtn"
                                  onClick={() =>
                                    moveToNextQuestion(
                                      currentQuestion.nextQuestionIfYes ||
                                      currentQuestion.nextQuestionIfNo,
                                      currentScriptType
                                    )
                                  }
                                >
                                  {currentQuestion?.isProbeQuestion
                                    ? "NEXT"
                                    : "DONE"}
                                </button>
                              ) : null}
                            </aside>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </>
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
                    gap="0px"
                    placeholder="Enter your full name"
                  />
                )}

                {showComponent === "Yes/No" && (
                  <div className="overlay-content">
                    <div className="yes-no yes-no-sticky">
                      <button
                        className="no-button"
                        onClick={() => handleEnterYesNo("No")}
                        style={{ marginRight: 10 }}
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
                )}

                {showComponent === "repeat" && (
                  <>
                    <div className="robo-actionwr">
                      <footer className="upload-footer footerabsolute">
                        <div className="container footercontainer">
                          <div className="row footercontainer-inner">
                            <aside className="col s2">
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
                            <aside className="col s10"></aside>
                          </div>
                        </div>
                      </footer>
                    </div>
                  </>
                )}

                {showComponent === "reason" && (
                  <InputSubmitComponent
                    inputType="text"
                    gap="0px"
                    submitValue={async () => {
                      if (currentScriptType === "openingScript") {
                        submitNotInterestedReason();
                      } else {
                        submitFeedback();
                        setText("");
                        moveToNextQuestion(currentQuestion.nextQuestionIfYes);
                      }
                    }}
                    state={text}
                    setState={setText}
                    placeholder={
                      currentScriptType === "openingScript"
                        ? "Please enter your reason"
                        : "Please enter text here"
                    }
                  />
                )}

                {showComponent === "mcr" && (
                  <>
                    <div className="robo-actionwr">
                      <footer className="upload-footer footerabsolute">
                        {showTerminationWarning ? (
                          <TerminationQuestion
                            onYes={async () => {
                              saveMCRResponse(terminateAns);
                              return handleTermination();
                            }}
                            onNo={() => {
                              setShowTerminationWarning(false);
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              gap: 5,
                              justifyContent: "center",
                            }}
                          >
                            {JSON.parse(
                              currentQuestion.questionOptions || "[]"
                            )?.map((op) => {
                              return (
                                <a
                                  key={op.optionKey}
                                  href="#"
                                  className="speakbtn"
                                  onClick={async () => {
                                    if (
                                      !currentQuestion.terminateInterview ||
                                      op.correct
                                    ) {
                                      await saveMCRResponse(op.optionKey);
                                      moveToNextQuestion(null, currentScriptType);
                                    } else {
                                      setTerminateAns(op.optionKey);
                                      setShowTerminationWarning(true);
                                    }
                                  }}
                                >
                                  {op.optionValue}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </footer>
                    </div>
                  </>
                )}

                {showComponent === "feedback" && (
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
                          {[
                            { key: "text", value: currentQuestion.yesText },
                            { key: "video", value: currentQuestion.noText },
                          ].map((op) => {
                            return (
                              <a
                                key={op.key}
                                href="#"
                                className="speakbtn"
                                onClick={() => {
                                  switch (op.key) {
                                    case "text": {
                                      setShowComponent("reason");
                                      break;
                                    }
                                    case "video": {
                                      candidateVideoFeedbackRef.current = true;
                                      playCurrentVideo("aviListening");
                                      setShowComponent("Video");
                                      handleStartRecording();
                                      break;
                                    }
                                    default:
                                      break;
                                  }
                                }}
                              >
                                {op.value}
                              </a>
                            );
                          })}
                        </div>
                      </footer>
                    </div>
                  </>
                )}

                {showComponent === "Stars" && (
                  <div className="robo-actionwr">
                    <footer className="upload-footer footerabsolute">
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          justifyContent: "center",
                        }}
                      >
                        <StarRating onClick={starSubmitHandler} />
                      </div>
                    </footer>
                  </div>
                )}

                {showComponent === "Rating" && (
                  <div className="robo-actionwr">
                    <footer className="upload-footer footerabsolute">
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          justifyContent: "center",
                        }}
                      >
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
                      </div>
                    </footer>
                  </div>
                )}

                {showComponent === "playback" &&
                  (practiceLink !== null && practiceLink?.trim() !== "" ? (
                    <>
                      <video
                        src={practiceLink}
                        controls
                        autoPlay
                        height={"100%"}
                        width={"100%"}
                        style={{
                          position: "absolute",
                          zIndex: 2,
                          objectFit: "cover",
                          objectPosition: "top",
                        }}
                      ></video>
                      <div className="robo-actionwr">
                        <footer
                          className="upload-footer footerabsolute"
                          style={{ bottom: 80 }}
                        >
                          <div className="container footercontainer">
                            <div className="row footercontainer-inner">
                              <aside className="col s10"></aside>
                              <aside className={"col s2"}>
                                {showNext ? (
                                  <button
                                    className="waves-effect waves-light btn btn-clear btn-submit nextbtn"
                                    onClick={() => {
                                      setShowComponent(null);
                                      moveToNextQuestion(
                                        currentQuestion.nextQuestionIfYes ||
                                        currentQuestion.nextQuestionIfNo,
                                        currentScriptType
                                      );
                                    }}
                                  >
                                    NEXT
                                  </button>
                                ) : null}
                              </aside>
                            </div>
                          </div>
                        </footer>
                      </div>
                    </>
                  ) : (
                    <p>No video link for practice question: {practiceLink}</p>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default L1RoundInterviewSection;

