import { useEffect, useRef, useState } from "react";
import L1RoundInterviewSection from "./l1-round-interview-section";
import axiosInstance from "../../../interceptors/index.js";
import AdminHeader2 from "../../../components/admin/admin-header-2/admin-header-2";
import ErrorToast from "../../../components/toasts/error-toast.jsx";
import { useSelector } from "react-redux";
import WarningToast from "../../../components/toasts/warning-toast";
import { baseUrl } from "../../../config/config";
import DeviceChecking from "../../device-checking";
import aviSmiling from "../../../resources/videos/aviSmiling.mp4";
import aviListening from "../../../resources/videos/aviListening.mp4";
import { useLocation, useNavigate } from "react-router-dom";
import { saveCandidateResponse, updateCandidateInterviewStatus } from "../api";
import { QTYPES } from "../../../resources/constant-data/question-types";
import Popup from "../../../components/errors";
import aviSmilingImage from "../../../resources/images/aviSmiling.png";
import EvuemeTextLoader from "../../../components/loaders/evueme-text-loader";
import { useGlobalContext } from "../../../context";
import useForceFullscreen from "../../../customHooks/use-force-fullscreen";
import useStreamCamera from "../../../customHooks/use-stream-camera";
const SMILING_TIMEOUT = 1000 * 5;
const FILLER_TIMEOUT = 1000 * 2;
const subscribedStreams = new Map();
const videoParent = document.getElementById("root");
const videoElementsDOM = {};
let aviSmilingImageRef = null;

// Sources that skip opening script and start from practice
const SKIP_OPENING_SCRIPT_SOURCES = ["login"];

const SCRIPT_FLOW = [
  "openingScript",
  "practice",
  "start",
  "skillBased",
  "feedBack",
  "closingScript",
];

// Dynamic first script based on interview source
const getFirstScript = (source) => {
  return SKIP_OPENING_SCRIPT_SOURCES.includes(source)
    ? "practice"
    : "openingScript";
};

// Function to find the first available script with data
const findFirstAvailableScript = (questionData, interviewSource) => {
  const scriptFlow = SKIP_OPENING_SCRIPT_SOURCES.includes(interviewSource)
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

const LIVE_RECORDING_CONFIG = {
  urlDetails: {
    url: "https://livestream.yourvideo.live/?header=false&grid_username=no&grid_line_icon=no&max_video=yes&rtmp_mode=yes&toolbar=false&grid_view=gallery&chat_overlay=1&token=",
  },
};

export const VIEWS = {
  INTER: "INTER",
  CANDIDATE: "CANDIDATE",
  SPLIT: "SPLIT",
};

const L1Round = () => {
  const location = useLocation();
  const link_access_type = location?.state?.link_access_type;
  const { privateUserId, interviewSource } = useGlobalContext();
  const jobId = useSelector((state) => state.interviewSlice.jobId);
  const interviewId = useSelector((state) => state.interviewSlice.interviewId);
  const tenantId = useSelector((state) => state.interviewSlice.tenantId);
  const currentUser = useSelector(
    (state) => state.signinSliceReducer.currentUser
  );
  const { preferredLanguage, userInterviewStatus: reduxUserInterviewStatus } = useSelector(
    (state) => state.interviewSlice
  );
  
  // Get status from URL parameter as fallback if Redux state is not updated yet
  const urlParams = new URLSearchParams(location.search);
  const urlStatus = urlParams.get('status');
  const userInterviewStatus = urlStatus || reduxUserInterviewStatus || 'notstarted';
  const userId = useSelector((state) => state.signinSliceReducer.userId);
  const forceCameraOn = useSelector(
    (state) => state.interviewSlice.forceCameraOn
  );
  const navigate = useNavigate();
  const { dynamicErrorMessage, containerRef, startInterviewMonitoring } =
    useForceFullscreen();
  const { isStreaming, startStreaming, stopStream, videoRef } = useStreamCamera(
    { timeBased: false }
  );
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [questionData, setQuestionData] = useState({});
  const [showComponent, setShowComponent] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentScriptType, setCurrentScriptType] = useState("");
  const [candidateVerified, setCandidateVerified] = useState(Boolean(userId));
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isResumed, setIsResumed] = useState(false);

  // Enablex state
  const roomIdRef = useRef(null);
  const serviceIdRef = useRef(null);
  const tokenRef = useRef(null);
  const alreadyRecording = useRef(false);
  // Prevent multiple create room calls
  const creatingRoomRef = useRef(false);
  const repeatingTimeoutRef = useRef(null);
  const questionDoneRef = useRef(false);
  const candidateVideoFeedbackRef = useRef(false);
  const savedIdRef = useRef([]);
  const firstQuestionSetRef = useRef(false);

  const [localStream, setLocalStream] = useState(null);
  const [room, setRoom] = useState(null);
  const [enxResult, setEnxResult] = useState(null);
  const [view, setView] = useState(null);
  const [practiceLink, setPracticeLink] = useState(null);
  const [videoLoadError, setVideoLoadError] = useState(false);

  const payloadUserId =
    link_access_type === "privateLink" ? privateUserId : userId ?? "";
  // console.log("Current interview status:", link_access_type);
  console.log('currentQuestionIndex ::: ', currentQuestionIndex); 
  // Camera activation logic - only turn on camera for skillBased script type
  useEffect(() => {
    if (currentScriptType === "skillBased" && forceCameraOn) {
      startStreaming();
    }

    return () => (isStreaming ? stopStream() : null);
  }, [currentScriptType]);

  useEffect(() => {
    document.title = "EvueMe | L1 Round";
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
      serviceIdRef.current = data?.room.service_id;
      tokenRef.current = data?.token;
      creatingRoomRef.current = false;
    } catch (e) {
      console.error("Error creating room:", e);
    }
  };

  // leaves enableX room
  const leaveRoom = async () => {
    if (localStream) localStream.close();
    if (room && roomIdRef.current) room.disconnect();
  };

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
            console.log("live-recording-on:", event);
          });
          room.addEventListener("room-live-recording-off", (event) => {
            console.log("live-recording-off:", event);
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
  const onFinishDeviceCheck = async () => {
    if (!roomIdRef.current && !creatingRoomRef.current) {
      creatingRoomRef.current = true;
      await createRoom();
      await joinRoom();
    }
    playCurrentVideo("aviSmiling");
    aviSmilingImageRef.style.visibility = "visible";
    setShowComponent(null);
    // Added so that we have enough time after create room call to actually be able to join the room
    setTimeout(() => {
      // if interview is resumed, move to the next script after practice
      if (isResumed) return handleNextScriptType("practice");
      // Only move to next question if we have a valid current question and it's not the first question
      if (
        currentQuestion &&
        currentQuestion.questionId &&
        currentQuestion.nextQuestionIfYes
      ) {
        moveToNextQuestion(
          currentQuestion.nextQuestionIfYes,
          currentScriptType
        );
      }
    }, SMILING_TIMEOUT);
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
    if (room) {
      try {
        room.stopLiveRecording(async function (resp) {
          if (resp.result !== 0)
            console.error("Error stopping recording:", resp);
          else if (alreadyRecording.current) {
            // Only stop and do everything if the alreadyRecording.current was set to true
            alreadyRecording.current = false;
            console.warn("Live recording stop initiated");

            if (
              savedIdRef.current.findIndex(
                (qid) => qid === currentQuestion.questionId
              ) === -1
            ) {
              savedIdRef.current.push(currentQuestion.questionId);
              const practiceLink = await saveCandidateResponse(
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

              setPracticeLink(practiceLink);
            }
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

      setIsVideoEnded(false);
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
        currentQuestion?.questionType === QTYPES.VIDEO &&
        currentScriptType === "practice" &&
        !currentVideo.loop;
      let skillBasedVideoQn =
        currentQuestion?.responseType === QTYPES.VIDEO &&
        currentScriptType === "skillBased" &&
        !currentVideo.loop;
      let feedbackVideoQn =
        currentQuestion?.questionType === QTYPES.VIDEO &&
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
      videoParent.removeChild(video);
    });
  };

  // get videos loaded
  const loadVideosFromArray = (videoArray = [], scriptType = "") => {
    return new Promise((resolve, reject) => {
      const videoLoadPromises = [];

      videoArray.forEach((question) => {
        // If video doesn't exist for this question, skip
        let hasVideoLink =
          scriptType !== "skillBased" && !!question.questionVideoLink;
        let hasLipSyncLink =
          scriptType === "skillBased" && !!question.lipSyncVideoLink;
        if (!hasVideoLink && !hasLipSyncLink) return;

        const video = document.createElement("video");
        video.classList.add("preloaded-videos");
        if (scriptType === "skillBased") video.src = question.lipSyncVideoLink;
        else video.src = question.questionVideoLink;

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
        const videoLoadPromise = new Promise((resolve) => {
          video.addEventListener("error", (e) => {
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

      // Wait for all videos to load
      Promise.all(videoLoadPromises)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // moves to next question
  const moveToNextQuestion = (
    questionId = currentQuestion.nextQuestionIfNo,
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
          userId,
          "L1 Hiring Manager Round",
          "Started",
          preferredLanguage || "English Indian",
          tenantId || "0"
        );
      }
      // when index reaches the end of the array
      if (currentQuestionIndex >= questionData[scriptType]?.length) {
        updateCandidateInterviewStatus(
          jobId,
          userId,
          "L1 Hiring Manager Round",
          "Completed",
          preferredLanguage || "English Indian",
          tenantId || "0"
        );
        handleNextScriptType();
        return;
      }
      // increase the index counter for every question
      nextQuestion = questionData[scriptType][currentQuestionIndex];
      setCurrentQuestionIndex(currentQuestionIndex + 1);
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
        }, SMILING_TIMEOUT);
      } else {
        questionDoneRef.current = false;
        setCurrentQuestion(nextQuestion);
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
    const scriptFlow = SKIP_OPENING_SCRIPT_SOURCES.includes(interviewSource)
      ? SCRIPT_FLOW.filter((script) => script !== "openingScript")
      : SCRIPT_FLOW;
    let nextScriptType = "";

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
          break;
        }

        break;
      }
    }

    // If no next script found, try to find any available script with data
    if (!nextScriptType) {
      nextScriptType = findFirstAvailableScript(questionData, interviewSource);
    }

    // Only update if a valid next script type was found
    if (nextScriptType) {
      setCurrentScriptType(nextScriptType);
    }
  };

  const infoAndFillerHandler = (question) => {
    // when the current script's questions get over
    if (question.nextQuestionIfYes === "0") {
      handleNextScriptType();
      return;
    }
    // need to update this check as when do we skip the candidate verification part
    // ideally a key should be there 'askCadidateDetail' as true in the current question
    const qText = question.questionText.toLowerCase();
    if (
      currentScriptType === "openingScript" &&
      qText.includes("help you with a practice question so")
    ) {
      // Skip to practice for sources that skip opening script, otherwise use normal logic
      if (SKIP_OPENING_SCRIPT_SOURCES.includes(interviewSource)) {
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

  // state updates on questionType
  const questionTypeHandler = (
    type = currentQuestion.questionType,
    question = currentQuestion
  ) => {
    switch (type) {
      case QTYPES.MCQ:
        playCurrentVideo("aviSmiling");
        setShowComponent("Yes/No");
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
      case QTYPES.STARS:
        playCurrentVideo("aviSmiling");
        setShowComponent("Stars");
        break;
      case QTYPES.TEXTBOX:
        setShowComponent(null);
        break;
      case QTYPES.VIDEO:
        playCurrentVideo("aviListening");
        setShowComponent("Video");
        break;
      case QTYPES.FILTRATION:
        playCurrentVideo("aviSmiling");
        setShowComponent("mcr");
        break;
      case QTYPES.FEEDBACK:
        playCurrentVideo("aviSmiling");
        setShowComponent("feedback");
        break;
      case QTYPES.RATING:
        playCurrentVideo("aviSmiling");
        setShowComponent("Rating");
        break;
      case QTYPES.HYGIENE_CHECK:
        aviSmilingImageRef.style.visibility = "hidden";
        stopAllVideos();
        setShowComponent("deviceCheck");
        break;
      case QTYPES.PLAYBACK: {
        if (practiceLink !== null && practiceLink?.trim() !== "") {
          stopAllVideos();
          setShowComponent("playback");
        }
        break;
      }
      case QTYPES.INFORMATIVE:
      case QTYPES.FILLER: {
        if (question && Number(question.nextQuestionIfNo) === -1) {
          playCurrentVideo("aviSmiling");
          setShowComponent("repeat");

          repeatingTimeoutRef.current = setTimeout(async () => {
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
      default:
        setShowComponent(null);
        break;
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
        if (
          currentScriptType === "skillBased" &&
          currentQuestion.questionType === QTYPES.SKILL_BASED
        ) {
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

    let videoToPlay = "";

    if (currentQuestion.questionId) {
      let hasVideoLink =
        currentScriptType !== "skillBased" &&
        !!currentQuestion.questionVideoLink;
      let hasLipSyncLink =
        currentScriptType === "skillBased" &&
        !!currentQuestion.lipSyncVideoLink;

      if (!hasVideoLink && !hasLipSyncLink) {
        // Use practice script as fallback for sources that skip opening script, otherwise use opening script
        const fallbackScript = SKIP_OPENING_SCRIPT_SOURCES.includes(
          interviewSource
        )
          ? "practice"
          : "openingScript";
        const fallbackQuestion = questionData[fallbackScript]?.[0];
        if (
          fallbackQuestion?.questionVideoLink ||
          fallbackQuestion?.lipSyncVideoLink
        ) {
          videoToPlay = `${fallbackScript}_${fallbackQuestion.questionId}`;
        } else {
          videoToPlay = "aviSmiling"; // Ultimate fallback
        }
      } else {
        // Play smiling video
        videoToPlay = `${currentScriptType}_${currentQuestion.questionId}`;
      }

      playCurrentVideo(videoToPlay);
    }
  }, [currentQuestion]);

  // when script type changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    // Reset the first question flag when script type changes
    firstQuestionSetRef.current = false;
    if (questionData.status && currentScriptType) {
      // const currentScriptQuestions = questionData[currentScriptType];
      const currentScriptQuestionsCount =
        currentScriptType === "skillBased"
          ? questionData.questionsCount
          : questionData[currentScriptType]?.length;
      setTotalQuestions(currentScriptQuestionsCount);
      const nextQuestionId = questionData[currentScriptType][0]?.questionId;
      // Set the first question for this script type
      moveToNextQuestion(nextQuestionId || 1, currentScriptType);
      firstQuestionSetRef.current = true;
    } else {
    }
  }, [currentScriptType]);

  // after all the questions are fetched
  useEffect(() => {
    if (questionData.status) {
      // Find the first available script with data, skipping empty ones
      const initialScript = findFirstAvailableScript(
        questionData,
        interviewSource
      );
      setCurrentScriptType(initialScript);
    }
  }, [questionData, interviewSource]);

  // when splitview updates
  useEffect(() => {
    const currentVideoId =
      "aviListening" || `${currentScriptType}_${currentQuestion.questionId}`;
    if (videoElementsDOM.hasOwnProperty(currentVideoId)) {
      videoElementsDOM[currentVideoId].style.cssText = "";
      switch (view) {
        case VIEWS.SPLIT:
          videoElementsDOM[currentVideoId].style.width = "50%";
          videoElementsDOM[currentVideoId].style.left = "0";
          videoElementsDOM[currentVideoId].style.top = "70px";
          aviSmilingImageRef.style.width = "50%";
          aviSmilingImageRef.style.left = "0";
          aviSmilingImageRef.style.top = "70px";
          break;

        case VIEWS.INTER:
          videoElementsDOM[currentVideoId].style.width = "100%";
          videoElementsDOM[currentVideoId].style.left = "0";
          videoElementsDOM[currentVideoId].style.top = "70px";
          aviSmilingImageRef.style.width = "100%";
          aviSmilingImageRef.style.left = "0";
          aviSmilingImageRef.style.top = "70px";
          break;

        case VIEWS.CANDIDATE:
          // aviSmilingImageRef.style.display = "none";
          videoElementsDOM[currentVideoId].style.display = "none";
          break;
        default:
          break;
      }
    }
  }, [view]);

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
            interviewRound: "L1 Hiring Manager Round",
            language: preferredLanguage || "English Indian",
            userId: userId,
            tenantId: tenantId || "0",
          }
        );

        // Add 2minute response time for each question
        data.practice?.forEach((qn) => {
          if (qn.questionType === QTYPES.VIDEO) {
            qn.responseTimeInMinutes = 2;
            qn.responseTimeInSeconds = 0;
          }
        });
        data.feedBack?.forEach((qn) => {
          if (
            qn.questionType === QTYPES.VIDEO ||
            qn.questionType === QTYPES.FEEDBACK
          ) {
            qn.responseTimeInMinutes = 2;
            qn.responseTimeInSeconds = 0;
          }
        });

        // Filter skillBased array based on IDs from another API
        let filteredSkillBased = data.skillBased || [];
        let filterIds = []; // Initialize as empty array
        console.log("before l1 round", userInterviewStatus);
        try {
          // Call your API to get the array of IDs
          const myUserId = localStorage.getItem("myUserId");
          console.log("local storage data", myUserId);

          if (myUserId) {
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
          console.log("before l1 round", filteredSkillBased);

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

        await loadVideosFromArray(data.openingScript, "openingScript");
        await loadVideosFromArray(data.practice, "practice");
        await loadVideosFromArray(data.start, "start");
        await loadVideosFromArray(filteredSkillBased, "skillBased");
        await loadVideosFromArray(data.feedBack, "feedBack");
        await loadVideosFromArray(data.closingScript, "closingScript");
        addAvisImage();

        // Update the data with filtered skillBased
        setQuestionData({
          ...data,
          skillBased: filteredSkillBased,
        });
        setCurrentQuestionIndex(
          data.skillBased.length - filteredSkillBased.length + 1
        );
        setView(VIEWS.SPLIT);
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

  // Set initial script based on interview source
  useEffect(() => {
    if (Object.keys(questionData).length > 0) {
      const initialScript = findFirstAvailableScript(
        questionData,
        interviewSource
      );
      setCurrentScriptType(initialScript);
    }
  }, [questionData, interviewSource]);

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
              className={view !== VIEWS.SPLIT ? "parent" : undefined}
            >
              <L1RoundInterviewSection
                currentQuestion={currentQuestion}
                moveToNextQuestion={moveToNextQuestion}
                showComponent={showComponent}
                localStream={localStream}
                handleStartRecording={handleStartRecording}
                handleStopRecording={handleStopRecording}
                enxResult={enxResult}
                view={view}
                setView={setView}
                leaveRoom={leaveRoom}
                setCandidateVerified={setCandidateVerified}
                candidateVerified={candidateVerified}
                terminateInterview={terminateInterview}
                totalQuestions={totalQuestions}
                currentScriptType={currentScriptType}
                playCurrentVideo={playCurrentVideo}
                setShowComponent={setShowComponent}
                repeatingTimeoutRef={repeatingTimeoutRef}
                questionDoneRef={questionDoneRef}
                candidateVideoFeedbackRef={candidateVideoFeedbackRef}
                practiceLink={practiceLink}
                currentIndex={currentQuestionIndex}
                savedIdRef={savedIdRef}
                setQuestionData={setQuestionData}
                setIsResumed={setIsResumed}
                setTotalQuestions={setTotalQuestions}
                questionData={questionData}
                link_access_type={link_access_type}
                dynamicErrorMessage={dynamicErrorMessage}
                startInterviewMonitoring={startInterviewMonitoring}
                startStreaming={startStreaming}
                stopStream={stopStream}
                isStreaming={isStreaming}
                videoRef={videoRef}
              />
            </div>
          )}
        </>
      ) : (
        <Popup style={{ height: "90vh", width: "100%", textAlign: "center" }} />
      )}
    </>
  );
};

export default L1Round;
