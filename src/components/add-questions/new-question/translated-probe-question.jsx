import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PlayButton from "./play-button";
import WarningToast from "../../toasts/warning-toast";
import { playAudioHandler } from "../../../utils/playAudio";

const TranslatedProbeQuestion = ({
  index,
  question,
  newQuestion,
  setNewQuestion,
}) => {
  const [queText, setQueText] = useState(question.questionText);
  const audioRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <div className="playquestion-box-ln">
      <header className="q-header flex">
        <span>{question.language}</span>
      </header>
      <div style={{ padding: "0 1rem" }}>
        <textarea
          className="original-que-textarea"
          style={{ height: "auto", maxHeight: "5em", fontSize: "13px" }}
          value={queText}
          // FIXME
          onChange={(e) => {
            const updatedText = e.target.value;

            const updatedProbeQuestionTranslations =
              newQuestion.probeQuestions.map((questionTranslation, i) => {
                if (i === index) {
                  questionTranslation = {
                    ...questionTranslation,
                    ["questionText"]: updatedText,
                  };
                }
                return questionTranslation;
              });

            setQueText(updatedText);

            dispatch(
              setNewQuestion({
                ...newQuestion,
                ["probeQuestions"]: updatedProbeQuestionTranslations,
              })
            );
          }}
        />
      </div>
      <ul className="option-wr leveling" style={{ padding: "0 0.5rem" }}>
        <li style={{ padding: "0 1rem" }}>
          <PlayButton
            onClick={() => {
              if (!question?.questionText) {
                return WarningToast("Please type question first");
              }
              playAudioHandler(
                question.questionText,
                question.language,
                audioRef
              );
            }}
          />
          <audio controls hidden className="qs-audio" ref={audioRef}></audio>
        </li>
      </ul>
    </div>
  );
};

export default TranslatedProbeQuestion;
