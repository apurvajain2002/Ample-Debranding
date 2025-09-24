import React from "react";
import EvuemeModal from "../modals/evueme-modal";
import { audio, icon } from "../assets/assets";
import useAudioRecorder from "../../customHooks/use-audio-recorder";
import { useEffect } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { useState, useRef } from "react";
import M from "materialize-css";
import { useDispatch } from "react-redux";
import { saveInterviewerVoiceNote } from "../../redux/actions/create-job-actions";

const RecorderModal = React.memo(({ jobId, userId, selectedRoundId }) => {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioRecorder = useAudioRecorder();
  const visualizerRef = useRef(null);
  const dispatch = useDispatch();
  // const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioRecorder.isRecording && audioRecorder.streamRef?.current) {
      const nativeMediaRec = new MediaRecorder(audioRecorder.streamRef.current);
      setMediaRecorder(nativeMediaRec);
    } else {
      if (mediaRecorder) {
        mediaRecorder.stop();
        setMediaRecorder(null);
      }
    }
  }, [audioRecorder.isRecording]);

  useEffect(() => {
    if (mediaRecorder) {
      if (audioRecorder.isRecording) {
        mediaRecorder.start();
      }
    }
  }, [mediaRecorder]);

  useEffect(() => {
    const modalElement = document.getElementById("interviewerAudioNote");
    if (modalElement) {
      const modalInstance = M.Modal.init(modalElement);
      return () => {
        if (modalInstance) {
          modalInstance.destroy();
        }
      };
    }
  }, []);

  const handleOnClickPauseResume = () => {
    if (audioRecorder.isPause) {
      audioRecorder.resumeRecording();
      mediaRecorder.resume();
    } else {
      audioRecorder.pauseRecording();
      mediaRecorder.pause();
    }
  };

  const handleSaveInterviewerVoiceNote = async() => {
    if(audioRecorder.isRecording){
      audioRecorder.stopRecording();
    }
    let roundname;
    if (selectedRoundId === "Recruiter Round") {
      roundname = "recruiterNoteAudio";
    }
    if (selectedRoundId === "L1 Hiring Manager Round") {
      roundname = "l1RoundRecruiterNoteAudio";
    }
    // convert to mp3 to send it in backend
    const file = new File([audioRecorder.audioBlob], "audio.mp3", {
      type: "audio/mpeg",
    });
   await dispatch(
      saveInterviewerVoiceNote({
        jobId,
        userId,
        file,
        roundname,
      })
    );
    audioRecorder.discardAudio();
    onClose();
  };

  const onClose = () =>{
    const modalElement = document.getElementById("interviewerAudioNote");
       const modalInstance = M.Modal.getInstance(modalElement);
       if (modalInstance) {
         modalInstance.close();
       }
 };
  return (
    <EvuemeModal
      modalId={"interviewerAudioNote"}
      divTagClasses="audioModalDivTagClass"
      modalClasses="audioModal"
    >
      <div
        style={{
          display: "flex",
          border: "3px solid #d9d9d9",
          flexDirection: "column",
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: "600",
            height: "10%",
            borderBottom: "2px solid #d9d9d9",
            paddingLeft: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img src={icon.micIcon} style={{ paddingRight: "5px" }} /> Add
          Interviewer Voice Note
        </div>

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "4px 10px 4px 10px",
            height: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "13%",
            }}
          >
            <button
              id="audio-modal-btn-id1"
              onClick={
                audioRecorder.isRecording
                  ? audioRecorder.stopRecording
                  : audioRecorder.startRecording
              }
              // disabled={audioRecorder.isRecording}
            >
              {audioRecorder.isRecording ? "Stop Record" : "Record Now"}
            </button>
          </div>
          <div
            style={{
              height: "85%",
              backgroundColor: "#f3f2ee",
              padding: "5px",
            }}
          >
            <div
              style={{
                backgroundColor: "#3a0531",
                height: "45%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {audioRecorder.isRecording && mediaRecorder && (
                  <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    backgroundColor={"transparent"}
                    barColor={"white"}
                    barWidth={1}
                    height={"100%"}
                    width={"auto"}
                  />
                )}

                {!audioRecorder.isRecording && audioRecorder.audioBlob && (
                  <AudioVisualizer
                    ref={visualizerRef}
                    blob={audioRecorder.audioBlob}
                    width={"auto"}
                    height={"100%"}
                    barWidth={1}
                    gap={0}
                    barColor={"#f76565"}
                  />
                )}
              </div>
            </div>
            <div style={{ backgroundColor: "#f3f2ee", height: "55%" }}>
              <div
                style={{
                  height: "35%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                  color: "#3a0531",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: "100%", height: "100%" }}>
                  {audioRecorder.isRecording && <span>"Recording...."</span>}
                  {audioRecorder.audioUrl && (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <audio
                        id="audioPlayer"
                        controls
                        src={audioRecorder.audioUrl}
                        style={{ width: "90%", height: "82%" }}
                      ></audio>
                      <img
                        src={icon.deleteIcon}
                        style={{ width: "10%", height: "18px" }}
                        onClick={audioRecorder.discardAudio}
                      />
                    </div>
                  )}
                </div>

                {/* record */}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "65%",
                  gap: "20px",
                  flexDirection: "row",
                  color: "white",
                  justifyContent: "center",
                }}
              >
                <button
                  className="audioModalButton2"
                  id="audio-modal-btn-id2"
                  disabled={!audioRecorder.isRecording}
                  onClick={handleOnClickPauseResume}
                >
                  {!audioRecorder.isPause ? "Pause" : "Resume"}
                </button>
                <button
                  className="audioModalButton2"
                  id="audio-modal-btn-id2"
                  disabled={
                    !audioRecorder.isRecording && !audioRecorder.audioUrl
                  }
                  onClick={handleSaveInterviewerVoiceNote}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              padding: "5px",
              height: "18%",
              display: "flex",
              width: "100%",
            }}
            className="centered"
          >
          </div>
        </div>
      </div>
    </EvuemeModal>
  );
});

export default RecorderModal;
