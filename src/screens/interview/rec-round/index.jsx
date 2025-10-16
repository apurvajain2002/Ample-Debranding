import { useCallback, useEffect, useRef, useState } from "react";
import RecruiterRoundInterviewSection from "./recruiter-round-interview-section";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../interceptors/index.js";
import AdminHeader2 from "../../../components/admin/admin-header-2/admin-header-2";
import ErrorToast from "../../../components/toasts/error-toast.jsx";
import { useSelector } from "react-redux";
import WarningToast from "../../../components/toasts/warning-toast";
import { baseUrl } from "../../../config/config";
import DeviceChecking from "../../device-checking";
import aviSmiling from "../../../resources/videos/aviSmiling.mp4";
import aviListening from "../../../resources/videos/aviListening.mp4";
import InterviewFooter from "../../../components/interview/interview-footer";
import Popup from "../../../components/errors";
import useStreamCamera from "../../../customHooks/use-stream-camera";
import { QTYPES } from "../../../resources/constant-data/question-types";
import aviSmilingImage from "../../../resources/images/aviSmiling.png";
import EvuemeTextLoader from "../../../components/loaders/evueme-text-loader";
import { useGlobalContext } from "../../../context";
import useForceFullscreen from "../../../customHooks/use-force-fullscreen";
// import useInterviewDiagnostics from "../../../customHooks/use-interview-diagnostics";
import { logClientDiagnostics } from "../../../utils/browserCompatibility";
import useApiWithDiagnostics from "../../../customHooks/use-api-with-diagnostics";

const SMILING_TIMEOUT = 1000 * 5;
const FILLER_TIMEOUT = 1000 * 2;
const subscribedStreams = new Map();
const videoParent = document.getElementById("root");
let aviSmilingImageRef = null;
const videoElementsDOM = {};

// Function to find the first available script with data
const findFirstAvailableScript = (questionData, shouldSkipOpeningScript = false) => {
  const scriptFlow = shouldSkipOpeningScript
    ? SCRIPT_FLOW.filter((script) => script !== "openingScript")
    : SCRIPT_FLOW;

  for (const scriptType of scriptFlow) {
    if (
      questionData[scriptType] &&
      Array.isArray(questionData[scriptType]) &&
      questionData[scriptType].length > 0
    ) {
      return scriptType;
    }
  }

  // If no script has data, return the first script in flow
  return scriptFlow[0] || "openingScript";
};

const SCRIPT_FLOW = [
  "openingScript",
  "practice",
  "start",
  "skillBased",
  "feedBack",
  "closingScript",
];

const COUNTED_QUESTION_TYPES = new Set(["filtration", "skillBased"]);

const LIVE_RECORDING_CONFIG = {
  urlDetails: {
    url: "https://livestream.yourvideo.live/?header=false&grid_username=no&grid_line_icon=no&max_video=yes&rtmp_mode=yes&toolbar=false&grid_view=gallery&chat_overlay=1&token=",
  },
};

const OtherRecRound = () => {
  // useInterviewDiagnostics();
  const location = useLocation();
  const link_access_type = location?.state?.link_access_type;
  const { privateUserId, interviewSource, setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport } = useGlobalContext();
  const { saveCandidateResponse, updateCandidateInterviewStatus } = useApiWithDiagnostics();
  const jobId = useSelector((state) => state.interviewSlice.jobId);
  const roundName = useSelector((state) => state.interviewSlice.roundName);
  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const currentUser = useSelector(
    (state) => state.signinSliceReducer.currentUser
  );
  const forceCameraOn = useSelector(
    (state) => state.interviewSlice.forceCameraOn
  );
  const { isStreaming, startStreaming, stopStream, videoRef } = useStreamCamera(
    { timeBased: false }
  );
  const { preferredLanguage, userInterviewStatus: reduxUserInterviewStatus } = useSelector(
    (state) => state.interviewSlice
  );
  
  // Get status from URL parameter as fallback if Redux state is not updated yet
  const urlParams = new URLSearchParams(location.search);
  const urlStatus = urlParams.get('status');
  const userInterviewStatus = urlStatus || reduxUserInterviewStatus || 'notstarted';
  const userId = useSelector((state) => state.signinSliceReducer.userId);
  const navigate = useNavigate();
  const { dynamicErrorMessage, containerRef, startInterviewMonitoring } =
    useForceFullscreen();
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [showComponent, setShowComponent] = useState(null);
  const [currentScriptType, setCurrentScriptType] = useState("");
  const [candidateVerified, setCandidateVerified] = useState(Boolean(userId));
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mcqQuestionCounter, setMcqQuestionCounter] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [shouldSkipOpeningScript, setShouldSkipOpeningScript] = useState(false);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [isResumed, setIsResumed] = useState(false);

  // Enablex state
  const roomIdRef = useRef(null);
  const serviceIdRef = useRef(null);
  const tokenRef = useRef(null);
  const alreadyRecording = useRef(false);
  // Prevent multiple create room calls
  const creatingRoom = useRef(false);
  const repeatingTimeoutRef = useRef(null);
  const candidateVideoFeedbackRef = useRef(false);
  const questionDoneRef = useRef(false);
  const answeredSkillQuestionsRef = useRef(0);

  const [localStream, setLocalStream] = useState(null);
  const [room, setRoom] = useState(null);
  const [enxResult, setEnxResult] = useState(null);
  const [splitView, setSplitView] = useState(false);
  const payloadUserId =
    link_access_type === "privateLink" ? privateUserId : userId ?? "";

  /* console.log('rec round location ::: ', location);
  console.log('rec round payloadUserId ::: ', payloadUserId);
  console.log('rec round privateUserId ::: ', privateUserId);
  console.log('rec round userId ::: ', userId);*/
  console.log('currentQuestionIndex ::: 01', currentQuestionIndex); 
  console.log('mcqQuestionCounter ::: 01', mcqQuestionCounter); 
  const displayQuestionNumber =
    answeredSkillQuestionsRef.current + mcqQuestionCounter;

  useEffect(() => {
    if (currentScriptType === "skillBased" && forceCameraOn) {
      startStreaming();
    }

    return () => (isStreaming ? stopStream() : null);
  }, [currentScriptType]);
  useEffect(() => {
    document.title = "EvueMe | Recruiter Round";
  });

  // creates room for enableX
  const createRoom = async () => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/enablex/create-room-and-generate-token`,
        {
          participants: 2,
          duration: 30,
          interviewId,
          roomName: `${currentUser} Interview Room`,
          candidateName: currentUser || "keshav",
          userId: userId || 1331,
          tenantId: tenantId || "0",
        }
      );

      roomIdRef.current = data?.room.room_id;
      tokenRef.current = data?.token;
      creatingRoom.current = false;
    } catch (e) {
      console.error("Error creating room: ", e);
    }
  };

  // leaves enableX room
  const leaveRoom = useCallback(() => {
    if (localStream) localStream.close();
    if (room && roomIdRef.current) room.disconnect();
  }, [room, localStream]);

  // joins the room
  const joinRoom = async () => {
    if (!window.EnxRtc || !tokenRef.current) return;

    let enx = window.EnxRtc;

    enx.getDevices(async (resp) => {
      if (!resp || resp.result !== 0) {
        return WarningToast("Unable to get devices.");
      }
      let camList = resp.devices.cam;
      let micList = resp.devices.mic;
      if (!camList.length || !micList.length) {
        return WarningToast("Unable to get devices.");
      }

      let cam = camList.at(0);
      let mic = micList.at(0);

      let config = {
        video: cam.default ? true : { deviceId: cam.deviceId },
        audio: mic.default ? true : { deviceId: mic.deviceId },
        data: true,
        videoSize: [],
      };

      // Tries to get default devices, and then join the room for you
      // Fails if you don't have default camera and other devices
      let res = await enx.joinRoom(
        tokenRef.current,
        config,
        function (result, error) {
          if (error && error !== null) {
            console.error(error);
            ErrorToast(`Room connection error: ${error.message}`);
            return;
          }

          if (!result) return;

          setEnxResult(result);
          setRoom(result.room);
          // Local room, since set state hasn't been processed yet
          let room = result.room;

          let ownerId = result.publishId;
          for (let i = 0; i < result.streams.length; ++i) {
            room.subscribe(result.streams[i]);
          }

          // General room events
          room.addEventListener("room-connected", () =>
            console.log("Room connected")
          );
          room.addEventListener("room-error", () =>
            console.error("Error connecting to room")
          );
          room.addEventListener("user-connected", () =>
            console.log("User connected to room")
          );
          room.addEventListener("user-disconnected", () =>
            console.warn("User disconnected from room")
          );
          room.addEventListener("room-disconnected", () =>
            console.warn("Room disconnected")
          );
          room.addEventListener("room-live-recording-failed", () =>
            console.error("Failed to start live recording")
          );
          // Network reasons
          room.addEventListener("network-disconnected", () =>
            console.warn("User network disconnected")
          );
          room.addEventListener("network-reconnected", () =>
            console.log("User network reconnected")
          );
          room.addEventListener("network-reconnect-timeout", () =>
            console.warn("Failed to reconnect within specified time")
          );
          room.addEventListener("network-reconnect-failed", () =>
            console.error("Failed to reconnect due to other reasons")
          );
          room.addEventListener("room-live-recording-on", (event) => {
            console.log(
              "🚀 ~ room.addEventListener ~ live-recording-on ~ event:",
              event
            );
          });
          room.addEventListener("room-live-recording-off", (event) => {
            console.log(
              "🚀 ~ room.addEventListener ~ live-recording-off ~ event:",
              event
            );
          });

          room.addEventListener("stream-subscribed", function (streamEvent) {
            if (streamEvent.stream.getID() !== ownerId) {
              subscribedStreams.set(
                streamEvent.stream.getID(),
                streamEvent.stream
              );
            }
          });
        }
      );
      setLocalStream(res);
    });
  };

  // on device check finish
  const onFinishDeviceCheck = () => {
    console.log("Device check done");
    if (aviSmilingImageRef) {
      aviSmilingImageRef.style.visibility = "visible";
    }
    setShowComponent(null);

    // if interview is resumed, move to the next script after practice
    // if (isResumed) return handleNextScriptType("practice");
    moveToNextQuestion(currentQuestion.nextQuestionIfYes, currentScriptType);
  };

  const handleStartRecording = () => {
    try {
      room.startLiveRecording(LIVE_RECORDING_CONFIG, function (resp) {
        if (resp.result !== 0) console.error("Error starting recording:", resp);
        else {
          alreadyRecording.current = true;
          console.warn("Live recording initiated");
        }
      });
    } catch (e) {
      console.error("Error start recording:", e);
    }
  };

  // handles start recording
  const startRecordingOnTimeUpdate = async (e) => {
    let timeLeft = e.target.duration - e.target.currentTime;
    if (timeLeft > 5 || alreadyRecording.current || !room) return;
    handleStartRecording();
  };

  const handleStopRecording = () => {
    if (room && alreadyRecording.current) {
      try {
        room.stopLiveRecording(async function (resp) {
          if (resp.result !== 0)
            console.error("Error stopping recording:", resp);
          else if (alreadyRecording.current) {
            alreadyRecording.current = false;
            console.warn("Live recording stop initiated");

            await saveCandidateResponse(
              interviewId,
              {
                questionId: currentQuestion.questionId,
                questionType: currentQuestion.questionType,
                responseType: "video",
              },
              payloadUserId,
              "",
              null,
              currentScriptType,
              serviceIdRef.current,
              enxResult?.roomData?.conf_num,
              roomIdRef.current,
              null,
              tenantId
            );
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  // change current video play
  const playCurrentVideo = (
    videoId = `${currentScriptType}_${currentQuestion.questionId}`
  ) => {
    try {
      const currentVideo = videoElementsDOM[videoId];
      currentVideo.style.display = "initial";
      if (aviSmilingImageRef) {
        aviSmilingImageRef.style.width = currentVideo.style.width;
      }

      // Pause and hide all other videos
      Object.keys(videoElementsDOM).forEach((key) => {
        if (key !== videoId) {
          videoElementsDOM[key].pause();
          videoElementsDOM[key].style.display = "none";
        }
      });

      if (videoId !== "aviSmiling" && videoId !== "aviListening")
        setIsVideoEnded(false);

      // Check if video has valid source before playing
      if (!currentVideo.src || currentVideo.src === '' || currentVideo.src === window.location.href) {
        console.warn(`Video ${videoId} has no valid source, skipping play`);
        if (loading) setLoading(false);
        return;
      }

      currentVideo.play();
      if (loading) setLoading(false);

      // only for videos not looping
      if (!currentVideo.loop) {
        currentVideo.onended = () => {
          if (repeatingTimeoutRef.current) {
            clearTimeout(repeatingTimeoutRef.current);
          }
          repeatingTimeoutRef.current = null;
          setIsVideoEnded(true);
        };
      }

      let practiceVideoQn =
        currentQuestion?.questionType === "video" &&
        currentScriptType === "practice" &&
        !currentVideo.loop;
      let skillBasedVideoQn =
        currentQuestion?.responseType === "video" &&
        currentScriptType === "skillBased" &&
        !currentVideo.loop;
      let feedbackVideoQn =
        currentQuestion?.questionType === "video" &&
        currentScriptType === "feedBack" &&
        !currentVideo.loop;

      if (practiceVideoQn || skillBasedVideoQn || feedbackVideoQn) {
        currentVideo.ontimeupdate = startRecordingOnTimeUpdate;
      }
    } catch (error) {
      console.error("Error playing the video. videoId: ", videoId);
      console.error(error);
    }
  };

  // stop videos
  const stopAllVideos = () => {
    // Pause and hide all other videos
    Object.keys(videoElementsDOM).forEach((key) => {
      videoElementsDOM[key].pause();
      videoElementsDOM[key].style.display = "none";
    });
  };

  // remove preloaded videos
  const removePreloadedVideos = () => {
    const videoParent = document.getElementById("root");
    const videos = videoParent.querySelectorAll(".preloaded-videos");

    videos.forEach((video) => {
      if (videoParent.contains(video)) videoParent.removeChild(video);
    });
  };

  // get videos loaded
  const loadVideosFromArray = (videoArray = [], scriptType = "") => {
    return new Promise((resolve, reject) => {
      const videoLoadPromises = [];

      videoArray.forEach((question) => {
        const videoLink =
          question.questionVideoLink || question.lipSyncVideoLink;
        // If video doesn't exist for this question, skip
        if (!videoLink || videoLink.trim() === '' || videoLink === window.location.href) {
          console.warn(`Skipping video with invalid source: ${videoLink}`);
          return;
        }

        const video = document.createElement("video");
        video.classList.add("preloaded-videos");
        video.src = videoLink;

        // Add looping for specific video scriptTypes
        if (scriptType === "aviSmiling" || scriptType === "aviListening") {
          video.loop = true;
        }


        // Styles
        video.style.display = "none";

        // Append the video to the parent
        videoParent.appendChild(video);
        if (question.questionId) {
          videoElementsDOM[`${scriptType}_${question.questionId}`] = video;
        } else {
          videoElementsDOM[scriptType] = video;
        }

        // Create a promise for video loading
        const videoLoadPromise = new Promise((resolve, reject) => {
          video.addEventListener("error", (e) => {
            console.warn(`Video loading error for ${scriptType}_${question.questionId}:`, e);
            reject(`${scriptType}_${question.questionId}`);
          });
          video.addEventListener("canplaythrough", () => {
            resolve();
          });
        });
        // Load the video
        video.load();

        // Add the video load promise to the array
        videoLoadPromises.push(videoLoadPromise);
      });

      // Wait for all videos to load (use allSettled to handle individual failures gracefully)
      Promise.allSettled(videoLoadPromises)
        .then((results) => {
          const failedVideos = results
            .filter(result => result.status === 'rejected')
            .map(result => result.reason);
          
          if (failedVideos.length > 0) {
            console.warn('Some videos failed to load:', failedVideos);
          }
          
          // Resolve even if some videos failed to load
          resolve();
        });
    });
  };

  // moves to next question
  const moveToNextQuestion = (
    questionId = currentQuestion.nextQuestionIfYes ||
      currentQuestion.nextQuestionIfNo,
    scriptType = currentScriptType
  ) => {
    let nextQuestion;

    // different handler for skill based
    if (currentScriptType === "skillBased") {
      // Answered the first question (index 0)
      if (currentQuestionIndex === 1) {
        // fire and forget in the background
        updateCandidateInterviewStatus(
          jobId,
          payloadUserId,
          "Recruiter Round",
          "Started",
          preferredLanguage || "English Indian",
          tenantId || "0"
        );
      }
      // when index reaches the end of the array
      if (currentQuestionIndex >= questionData[scriptType]?.length) {
        updateCandidateInterviewStatus(
          jobId,
          payloadUserId,
          "Recruiter Round",
          "Completed",
          preferredLanguage || "English Indian",
          tenantId || "0"
        );
        handleNextScriptType();
        return;
      }
      // increase the index counter for every question
      nextQuestion = questionData[scriptType][currentQuestionIndex];
      setCurrentQuestionIndex((prev) => {
        return prev + 1;
      });
    } else {
      // when questionId is 0, switch the scriptType
      if (Number(questionId) === 0) {
        handleNextScriptType();
        return;
      }
      // get the next question from questionData
      nextQuestion = questionData[scriptType].find(
        (question) => Number(question.questionId) === Number(questionId)
      );
    }

    if (nextQuestion) {
      if (
        currentQuestion.questionType === "video" ||
        currentQuestion.responseType === "video" ||
        candidateVideoFeedbackRef.current
      ) {
        questionDoneRef.current = true;
        playCurrentVideo("aviSmiling");
        setShowComponent(null);
        setTimeout(() => {
          questionDoneRef.current = false;
          candidateVideoFeedbackRef.current = false;
          setCurrentQuestion(nextQuestion);
          // skip incrementing mcq question counter for audioFirst & videoFirst
          if (nextQuestion.responseType === QTYPES.VIDEO_FIRST) {
            if (!roomIdRef.current && !creatingRoom.current) {
              creatingRoom.current = true;
              createRoom().then(() => joinRoom());
            }
          }
          if (COUNTED_QUESTION_TYPES.has(nextQuestion.questionType)) {
            setMcqQuestionCounter((prev) => prev + 1);
          }
        }, SMILING_TIMEOUT);
      } else {
        questionDoneRef.current = false;
        setCurrentQuestion(nextQuestion);
        // skip incrementing mcq question counter for audioFirst & videoFirst
        if (nextQuestion.responseType === QTYPES.VIDEO_FIRST) {
          if (!roomIdRef.current && !creatingRoom.current) {
            creatingRoom.current = true;
            createRoom().then(() => joinRoom());
          }
        }
        if (COUNTED_QUESTION_TYPES.has(nextQuestion.questionType)) {
          setMcqQuestionCounter((prev) => prev + 1);
        }
      }
    }
  };

  // end interview
  const terminateInterview = () => {
    stopAllVideos();
    removePreloadedVideos();
    leaveRoom();
    removeAvisImage();
    if (candidateVerified) navigate("/interview/complete", { replace: true });
    else navigate("/signin", { replace: true });
  };

  // move to next script type
  const handleNextScriptType = async (prevScriptType = currentScriptType) => {
    const scriptFlow = shouldSkipOpeningScript
      ? SCRIPT_FLOW.filter((script) => script !== "openingScript")
      : SCRIPT_FLOW;
    let nextScriptType = "";
    let nextScriptTypeIndex = null;

    for (let i = 0; i < scriptFlow.length; i++) {
      if (prevScriptType === scriptFlow[i]) {
        // Start looking from the next index
        for (let j = i + 1; j < scriptFlow.length; j++) {
          const potentialNextScript = scriptFlow[j];

          // Check if the next script data is null or an empty array
          if (
            !questionData[potentialNextScript] ||
            (Array.isArray(questionData[potentialNextScript]) &&
              questionData[potentialNextScript].length === 0)
          ) {
            // Continue to the next script type if current one is empty
            continue;
          }

          // If we find a script type with valid data, set it and break
          nextScriptType = potentialNextScript;
          nextScriptTypeIndex = j;
          break;
        }

        break;
      }
    }

    // If no next script found, try to find any available script with data
    if (!nextScriptType) {
      nextScriptType = findFirstAvailableScript(questionData, shouldSkipOpeningScript);
    }

    // Only update if a valid next script type was found
    if (nextScriptType) {
      setCurrentScriptType(nextScriptType);
    } else {
      console.log("Next script not found ! Terminating ..");
      terminateInterview();
    }
  };

  // for skill based filler
  const infoAndFillerHandler = (question) => {
    // when the current script's questions get over
    if (Number(question.nextQuestionIfYes) === 0) {
      handleNextScriptType();
    }

    const qText = question.questionText.toLowerCase();
    if (
      currentScriptType === "openingScript" &&
      qText.includes("help you with a practice question so")
    ) {
      // Skip to practice if resume status indicates opening script should be skipped, otherwise use normal logic
      if (shouldSkipOpeningScript) {
        moveToNextQuestion(12, "practice");
      } else {
        moveToNextQuestion(
          candidateVerified ? 12 : question.nextQuestionIfYes,
          currentScriptType
        );
      }
    } else {
      moveToNextQuestion(question.nextQuestionIfYes, currentScriptType);
    }
  };

  // response type handler for question types
  const questionTypeHandler = async (
    type = currentQuestion.questionType,
    question = currentQuestion
  ) => {
    switch (type) {
      case QTYPES.MCR:
      case QTYPES.MCQ:
        playCurrentVideo("aviSmiling");
        if (currentScriptType !== "skillBased") {
          setShowComponent("Yes/No");
        }
        break;
      case QTYPES.NAME:
        playCurrentVideo("aviSmiling");
        setShowComponent("FullNameInput");
        break;
      case QTYPES.MOBILE_NUMBER:
        playCurrentVideo("aviSmiling");
        setShowComponent("MobileNumberInput");
        break;
      case QTYPES.OTP:
        playCurrentVideo("aviSmiling");
        setShowComponent("OTPInput");
        break;
      case QTYPES.HYGIENE_CHECK:
        if (aviSmilingImageRef) {
          aviSmilingImageRef.style.visibility = "hidden";
        }
        stopAllVideos();
        setShowComponent("deviceCheck");
        break;
      case QTYPES.STARS:
        playCurrentVideo("aviSmiling");
        setShowComponent("Stars");
        break;
      case QTYPES.AUDIO_FIRST:
      case QTYPES.VIDEO_FIRST:
      case QTYPES.INFORMATIVE:
      case QTYPES.FILLER: {
        if (question && Number(question.nextQuestionIfNo) === -1) {
          playCurrentVideo("aviSmiling");
          setShowComponent("repeat");

          repeatingTimeoutRef.current = setTimeout(() => {
            setShowComponent(null);
            infoAndFillerHandler(question);
          }, SMILING_TIMEOUT);
        } else if (type !== QTYPES.INFORMATIVE) {
          playCurrentVideo("aviSmiling");
          setShowComponent(null);
          setTimeout(() => {
            infoAndFillerHandler(question);
          }, FILLER_TIMEOUT);
        } else {
          infoAndFillerHandler(question);
        }
        break;
      }

      case QTYPES.VIDEO:
        playCurrentVideo("aviListening");
        setShowComponent("Video");
        break;

      case QTYPES.FILTRATION:
      case QTYPES.SKILL_BASED:
        if (currentQuestion.responseType !== "audio") {
          playCurrentVideo("aviSmiling");
          setShowComponent("mcr");
        }
        break;
      case QTYPES.FEEDBACK:
        playCurrentVideo("aviSmiling");
        setShowComponent("feedback");
        break;

      case QTYPES.RATING:
        playCurrentVideo("aviSmiling");
        setShowComponent("Rating");
        break;

      case QTYPES.AUDIO:
        setShowComponent("audio");
        playCurrentVideo("aviSmiling");
        break;

      default:
        playCurrentVideo("aviSmiling");
    }
  };

  const addAvisImage = (imageUrl = aviSmilingImage) => {
    aviSmilingImageRef = document.createElement("img");
    aviSmilingImageRef.classList.add("preloaded-videos");
    aviSmilingImageRef.style.zIndex = "0";
    aviSmilingImageRef.src = imageUrl;
    videoParent.appendChild(aviSmilingImageRef);
  };

  const removeAvisImage = () => {
    if (aviSmilingImageRef && videoParent.contains(aviSmilingImageRef)) {
      videoParent.removeChild(aviSmilingImageRef);
    }
  };

  // when current video ends
  useEffect(() => {
    if (isVideoEnded) {
      if (currentQuestion.termination) {
        if (
          currentScriptType === "openingScript" &&
          currentQuestion.questionType === QTYPES.NOT_INTERESTED
        ) {
          playCurrentVideo("aviSmiling");
          setShowComponent("reason");
        } else {
          terminateInterview();
        }
      } else {
        if (currentScriptType === "skillBased") {
          questionTypeHandler(currentQuestion.responseType, currentQuestion);
        } else {
          questionTypeHandler(currentQuestion.questionType, currentQuestion);
        }
      }
    }
  }, [isVideoEnded]);

  // changes current question
  useEffect(() => {
    setShowComponent(null);
    setIsVideoEnded(false);
    let videoToPlay = "";

    if (currentQuestion.questionId) {
      const videoLink =
        currentQuestion.questionVideoLink || currentQuestion.lipSyncVideoLink;
      if (!videoLink) {
        // Use practice script as fallback if opening script should be skipped, otherwise use opening script
        const fallbackScript = shouldSkipOpeningScript
          ? "practice"
          : "openingScript";
        const fallbackQuestion = questionData[fallbackScript]?.[0];
        if (fallbackQuestion?.questionVideoLink) {
          videoToPlay = `${fallbackScript}_${fallbackQuestion.questionVideoLink}`;
        } else {
          videoToPlay = "aviSmiling"; // Ultimate fallback
        }
      } else {
        videoToPlay = `${currentScriptType}_${currentQuestion.questionId}`;
      }
      playCurrentVideo(videoToPlay);
    }
  }, [currentQuestion]);

  // when script type changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setMcqQuestionCounter(0);
    if (questionData.status && currentScriptType) {
      const currentScriptQuestions = questionData[currentScriptType] || [];
      let currentScriptQuestionsCount =
        questionData[currentScriptType]?.length || 0;

      if (currentScriptType === "skillBased") {
        const remainingCount = currentScriptQuestions.filter(
          ({ questionType }) => COUNTED_QUESTION_TYPES.has(questionType)
        ).length;
        currentScriptQuestionsCount =
          remainingCount + answeredSkillQuestionsRef.current;
      }

      // set total questions count
      setTotalQuestions(currentScriptQuestionsCount);
      const nextQuestionId = currentScriptQuestions[0]?.questionId;
      moveToNextQuestion(nextQuestionId || 1, currentScriptType);
    }
  }, [currentScriptType]);

  // after all the questions are fetched
  useEffect(() => {
    if (questionData.status) {
      // Find the first available script with data, skipping empty ones
      const initialScript = findFirstAvailableScript(
        questionData,
        shouldSkipOpeningScript
      );
      setCurrentScriptType(initialScript);
    }
  }, [questionData, shouldSkipOpeningScript]);

  // when splitview updates
  useEffect(() => {
    Object.keys(videoElementsDOM).forEach((key) => {
      videoElementsDOM[key].pause();
      if (currentScriptType === "skillBased") {
        if (aviSmilingImageRef) {
          aviSmilingImageRef.classList.add("recruiter-videos-skillBased");
        }
        videoElementsDOM[key].classList.add("recruiter-videos-skillBased");
      } else {
        if (aviSmilingImageRef) {
          aviSmilingImageRef.classList.remove("recruiter-videos-skillBased");
        }
        videoElementsDOM[key].classList.remove("recruiter-videos-skillBased");
      }
    });
  }, [currentScriptType]);

  // orientation handled centrally by useForceFullscreen hook
  useEffect(() => {
    return () => {
      if (room) leaveRoom();
      if (document.fullscreenElement) {
        document.body.style.overflow = "revert";
      }
    };
  }, []);

  // get all questions & pre-render all the videos
  useEffect(() => {
    // gets all the questions for this interview
    const fetchAllQuestions = async () => {
      try {
        const { data } = await axiosInstance.post(
          `${baseUrl}/job-posting/opening-closing-script/get-all-questions`,
          {
            jobId: jobId,
            interviewRound: roundName,
            language: preferredLanguage || "English Indian",
            tenantId: tenantId || "0",
          }
        );

        // Add 2minute response time for each question
        data.practice?.forEach((qn) => {
          if (qn.questionType === "video") {
            qn.responseTimeInMinutes = 2;
            qn.responseTimeInSeconds = 0;
          }
        });
        data.feedBack?.forEach((qn) => {
          if (qn.questionType === "video" || qn.questionType === "feedback") {
            qn.responseTimeInMinutes = 2;
            qn.responseTimeInSeconds = 0;
          }
        });

        // Filter skillBased array based on IDs from another API
        let filteredSkillBased = data.skillBased || [];
        let filterIds = []; // Initialize as empty array
        console.log(
          "before rec round",
          userInterviewStatus,
          filteredSkillBased
        );
        console.log("Current interview status:", userInterviewStatus);

        try {
          // Call your API to get the array of IDs
          const myUserId = localStorage.getItem("myUserId");
          console.log("local storage data", myUserId);
          const { data: checkResumeStatusData } = await axiosInstance.post(
            `${baseUrl}/job-posting/candidate-interviews/get-resume-status`,
            {
                interviewId: interviewId,
                userId: myUserId,
            }
          );
          
          // Set the resume status to determine if opening script should be skipped
          setShouldSkipOpeningScript(checkResumeStatusData.resume || false);
          
          if (checkResumeStatusData.resume) {
            const { data: apiFilterIds } = await axiosInstance.get(
              `${baseUrl}/job-posting/api/enablex/interview-questions`,
              {
                params: {
                  interviewId: interviewId,
                  userId: myUserId,
                },
              }
            );
            filterIds = apiFilterIds || []; // Ensure it's always an array
          } else {
            filterIds = [];
          }
          console.log("filterIds", filterIds);
          console.log("before rec round", filteredSkillBased);

          // Filter skillBased array to only include questions with matching IDs
          if (filterIds && Array.isArray(filterIds)) {
            filteredSkillBased = data.skillBased.filter(
              (question) => !filterIds.includes(question.id)
            );
          }
        } catch (filterError) {
          console.warn(
            "Failed to fetch filter IDs, using all skillBased questions:",
            filterError
          );
          filterIds = []; // Ensure it's empty array on error
          // Continue with original data if filtering fails
        }
        console.log("after", filteredSkillBased);
        
        // Log client diagnostics (optional - don't block main functionality if it fails)
        try {
          await logClientDiagnostics({ setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport });
        } catch (diagnosticsError) {
          console.warn("Client diagnostics failed, continuing with interview:", diagnosticsError);
        }
        
        await loadVideosFromArray(data.openingScript, "openingScript");
        await loadVideosFromArray(data.practice, "practice");
        await loadVideosFromArray(data.start, "start");
        await loadVideosFromArray(filteredSkillBased, "skillBased");
        await loadVideosFromArray(data.feedBack, "feedBack");
        await loadVideosFromArray(data.closingScript, "closingScript");
        addAvisImage();
        setQuestionData({ ...data, skillBased: filteredSkillBased });

        const originalCountedQuestions = data.skillBased.filter(
          (question) => COUNTED_QUESTION_TYPES.has(question.questionType)
        ).length;
        const filteredCountedQuestions = filteredSkillBased.filter((question) =>
          COUNTED_QUESTION_TYPES.has(question.questionType)
        ).length;
        const answeredCount = Math.max(
          originalCountedQuestions - filteredCountedQuestions,
          0
        );
        answeredSkillQuestionsRef.current = answeredCount;
        const resumedOffset = answeredCount + 1;

        setMcqQuestionCounter(0);
        setCurrentQuestionIndex(resumedOffset);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setVideoLoadError(true);
      }
    };

    loadVideosFromArray(
      [
        {
          questionId: "",
          questionVideoLink: aviSmiling,
        },
      ],
      "aviSmiling"
    );
    loadVideosFromArray(
      [
        {
          questionId: "",
          questionVideoLink: aviListening,
        },
      ],
      "aviListening"
    );

    fetchAllQuestions();
  }, []);

  return (
    <>
      <AdminHeader2 />
      {loading ? (
        <>
          <EvuemeTextLoader
            text={"Getting ready to start"}
            loaderClassName="interview"
          />
          <video autoPlay loop className="preloaded-videos">
            <source src={aviSmiling} type="video/mp4" />
          </video>
        </>
      ) : !videoLoadError ? (
        <>
          {showComponent === "deviceCheck" ? (
            <DeviceChecking
              onFinish={(isPassed) => {
                if (isPassed) onFinishDeviceCheck();
                else terminateInterview();
              }}
            />
          ) : (
            <div
              ref={containerRef}
              className={!splitView ? "parent" : undefined}
            >
              <RecruiterRoundInterviewSection
                forceCamera={
                  forceCameraOn && currentScriptType === "skillBased"
                }
                currentQuestion={currentQuestion}
                moveToNextQuestion={moveToNextQuestion}
                room={room}
                showComponent={showComponent}
                localStream={localStream}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                enxResult={enxResult}
                splitView={splitView}
                setSplitView={setSplitView}
                leaveRoom={leaveRoom}
                setCandidateVerified={setCandidateVerified}
                candidateVerified={candidateVerified}
                terminateInterview={terminateInterview}
                currentScriptType={currentScriptType}
                playCurrentVideo={playCurrentVideo}
                setShowComponent={setShowComponent}
                mcqQuestionCounter={displayQuestionNumber}
                totalQuestions={totalQuestions}
                isVideoEnded={isVideoEnded}
                repeatingTimeoutRef={repeatingTimeoutRef}
                userInterviewStatus={userInterviewStatus}
                localCameraRef={videoRef}
                startStreaming={startStreaming}
                roomIdRef={roomIdRef}
                candidateVideoFeedbackRef={candidateVideoFeedbackRef}
                questionDoneRef={questionDoneRef}
                setQuestionData={setQuestionData}
                setIsResumed={setIsResumed}
                setTotalQuestions={setTotalQuestions}
                questionData={questionData}
                link_access_type={link_access_type}
                dynamicErrorMessage={dynamicErrorMessage}
                startInterviewMonitoring={startInterviewMonitoring}
                currentQuestionIndex={currentQuestionIndex}
              />
            </div>
          )}
        </>
      ) : (
        <Popup style={{ height: "90vh", width: "100%", textAlign: "center" }} />
      )}
      {currentScriptType === "skillBased" && <InterviewFooter />}
    </>
  );
};

export default OtherRecRound;
