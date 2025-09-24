import { useRef } from "react";
import { ResponseTime } from "./response-time";
import getUniqueId from "../../../utils/getUniqueId";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { icon } from "../../assets/assets";
import CodeSnippetTextInput from "./code-snippet-text-input";
import PlayButton from "./play-button";
import WarningToast from "../../toasts/warning-toast";
import { playAudioHandler } from "../../../utils/playAudio";

export default function QuestionTypeProbe({ probeQuestion, onDeleteProbe }) {
  const audioRef = useRef(null);

  return (
    <div key={getUniqueId()} style={{}}>
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
            minsInputFieldIdAndName={`responseTimeInMinutes`}
            secondsInputFieldIdAndName={`responseTimeInSeconds`}
            question={probeQuestion}
            disabled={true}
          />
        </div>
        <div>
          <EvuemeImageTag
            className={"primaryColorFilter cursor-pointer"}
            imgSrc={icon.closeLineIcon}
            style={{ marginRight: "6px" }}
            // onClick={() => handleRemoveProbeQuestion(index)}
            onClick={onDeleteProbe}
          />
        </div>
      </div>
      <CodeSnippetTextInput
        textareaIdAndName={"questionText"}
        value={probeQuestion.questionText}
        onChange={() => {}}
        disabled={true}
      />
      <div style={{marginBottom: "20px"}}>
        <PlayButton
          onClick={() => {
            if (!probeQuestion.questionText) {
              return WarningToast("Please type question first");
            }
            playAudioHandler(probeQuestion.questionText, "English", audioRef);
          }}
        />
        <audio controls className="qs-audio" ref={audioRef}></audio>
      </div>
      
    </div>
  );
}
