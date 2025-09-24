import { playAudioHandler } from "../../../utils/playAudio";
import WarningToast from "../../toasts/warning-toast";
import CodeSnippetTextInput from "./code-snippet-text-input";
import PlayButton from "./play-button";
import { ResponseTime } from "./response-time";
import { useRef } from "react";

const NewProbeQuestion = ({ probeQuestion, setProbeQuestion, onChange }) => {
  const audioRef = useRef(null)

  return (
    <div >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div style={{ marginTop: "50px" , width: "300px"}}>
          <ResponseTime
            labelText="Candidate Response Time"
            minsInputFieldIdAndName={"responseTimeInMinutes"}
            secondsInputFieldIdAndName={"responseTimeInSeconds"}
            question={probeQuestion}
            updateQuestion={setProbeQuestion}
          />
        </div>
      </div>
      <CodeSnippetTextInput
        textareaIdAndName={"questionText"}
        value={probeQuestion.questionText}
        onChange={onChange}
      />
      <div style={{marginBottom: "20px"}}>
        <PlayButton onClick={() => {
          if (!probeQuestion.questionText) {
            return WarningToast("Please type question first");
          }
          playAudioHandler(probeQuestion.questionText, "English", audioRef);
        }} />
        <audio
          controls
          className="qs-audio"
          ref={audioRef}
        ></audio>
      </div>
      
    </div>
  )
}

export default NewProbeQuestion;
