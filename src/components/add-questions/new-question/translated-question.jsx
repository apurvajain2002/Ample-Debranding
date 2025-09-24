import PlayButton from "./play-button";
import EvuemeInputTag from "../../evueme-html-tags/evueme-input-tag";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import WarningToast from "../../toasts/warning-toast";
import { playAudioHandler } from "../../../utils/playAudio";

const TranslatedQuestionOption = ({
  translationQuestionIndex,
  optionIndex,
  optionKey,
  optionValue,
  newQuestion,
  setNewQuestion,
}) => {
  const [optionText, setOptionText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setOptionText(() => optionValue);
  }, []);

  useEffect(() => {
    const updatedQuestionTranslationOptions = JSON.parse(
      newQuestion?.questionBankTranslations[translationQuestionIndex]
        ?.questionOptions
    ).map((questionOption, index) => {
      if (index === optionIndex) {
        // questionOption = { ...questionOption, ["optionValue"]: optionText };
        return optionText;
      }
      return questionOption;
    });

    let updatedNewQuestion = JSON.parse(JSON.stringify(newQuestion));
    updatedNewQuestion.questionBankTranslations[
      translationQuestionIndex
    ].questionOptions = JSON.stringify(updatedQuestionTranslationOptions);

    dispatch(setNewQuestion(updatedNewQuestion));
  }, [optionText]);

  return (
    <li>
      <span>{optionKey.toUpperCase()}</span>{" "}
      <EvuemeInputTag
        type="text"
        value={optionText}
        onChange={(e) => setOptionText(e.target.value)}
      />
    </li>
  );
};

const TranslatedQuestion = ({
  index,
  translateToLanguage,
  questionText,
  options,
  newQuestion,
  setNewQuestion,
}) => {
  const [queText, setQueText] = useState("");
  const audioRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (questionText) setQueText(() => questionText);
  }, [questionText]);

  useEffect(() => {
    const updatedQuestionBankTranslations =
      newQuestion?.questionBankTranslations?.map((questionTranslation, i) => {
        if (i === index) {
          questionTranslation = {
            ...questionTranslation,
            questionText: queText,
          };
        }
        return questionTranslation;
      });

    dispatch(
      setNewQuestion({
        ...newQuestion,
        ["questionBankTranslations"]: updatedQuestionBankTranslations,
      })
    );
  }, [queText]);

  return (
    <div className="playquestion-box-ln">
      <header className="q-header flex">
        <span>{translateToLanguage}</span>
      </header>
      <div style={{ padding: "0 1rem" }}>
        <textarea
          className="original-que-textarea"
          style={{ height: "auto", maxHeight: "5em", fontSize: "13px" }}
          value={queText}
          onChange={e => setQueText(e.target.value)}
          rows="3"
        />
      </div>
      <ul className="option-wr leveling" style={{ padding: "0 0.5rem" }}>
        {options?.map((curOption, optionIndex) => (
          <TranslatedQuestionOption
            key={optionIndex}
            translationQuestionIndex={index}
            optionIndex={optionIndex}
            optionKey={curOption.optionKey}
            optionValue={curOption.optionValue}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
        ))}
        <li style={{ padding: "0 1rem" }}>
          <PlayButton onClick={() => {
            if (!newQuestion?.originalQuestion && !newQuestion?.questionText ) {
              return WarningToast("Please type question first");
            }
            let language = newQuestion?.questionBankTranslations[index]?.language;
            playAudioHandler(queText, language, audioRef);
          }} />
          <audio
            controls
            hidden
            className="qs-audio"
            ref={audioRef}
          ></audio>
        </li>
      </ul>
    </div>
  );
};

export default TranslatedQuestion;
