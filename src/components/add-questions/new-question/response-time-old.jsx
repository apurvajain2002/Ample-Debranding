import { useEffect, useState } from "react";
import EvuemeLabelTag from "../../evueme-html-tags/evueme-label-tag";
import EvuemeInputTag from "../../evueme-html-tags/evueme-input-tag";
import { useDispatch, useSelector } from "react-redux";
import { setNewQuestion } from "../../../redux/slices/create-new-question-slice";

const ResponseTimeOld = ({
  divTagClasses = "",
  inputDivClasses = "",
  minsInputFieldIdAndName = "",
  minsValue = "00",
  secondsInputFieldIdAndName = "",
  secondsValue = "00",
  disabled = false,
  labelText = "",
  isProbeQuestionResponseTime = false,
  newProbeQuestion = {},
  setNewProbeQuestion = () => {},
}) => {
  const { newQuestion } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );

  const newQuestionResponseType = newQuestion?.responseType;
  const [localMinsValue, setLocalMinsValue] = useState("");
  const [localSecondsValue, setLocalSecondsValue] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const setInitialTimeValues = () => {
      if (newQuestionResponseType === "mcq") {
        setLocalMinsValue("00");
        setLocalSecondsValue("20");
      } else if (newQuestionResponseType === "audio") {
        setLocalMinsValue("02");
        setLocalSecondsValue("00");
      } else if (newQuestionResponseType === "video") {
        setLocalMinsValue("03");
        setLocalSecondsValue("00");
      } else {
        setLocalMinsValue("01");
        setLocalSecondsValue("00");
      }
    };

    const setEditQuestionTimeValues = () => {
      if (newQuestion?.questionId) {
        if (minsValue) {
          setLocalMinsValue(minsValue);
        }
        if (secondsValue) {
          setLocalSecondsValue(secondsValue);
        }
      } else {
        setInitialTimeValues();
      }
    };

    if (newQuestion) {
      if (isProbeQuestionResponseTime) {
        setLocalMinsValue(minsValue);
        setLocalSecondsValue(secondsValue);
      } else {
        setEditQuestionTimeValues();
      }
    }
  }, [
    newQuestion,
    newQuestionResponseType,
    isProbeQuestionResponseTime,
    minsValue,
    secondsValue,
  ]);

  useEffect(() => {
    if (isProbeQuestionResponseTime) {
      setNewProbeQuestion(() => ({
        ...newProbeQuestion,
        ["responseTimeInMinutes"]: localMinsValue,
        ["responseTimeInSeconds"]: localSecondsValue,
      }));
    } else {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          ["responseTimeInMinutes"]: localMinsValue,
          ["responseTimeInSeconds"]: localSecondsValue,
        })
      );
    }
  }, [localMinsValue, localSecondsValue]);

  return (
    <div className={`input-field no-input-field ${divTagClasses}`}>
      <div className={`chipbox validate ${inputDivClasses}`}>
        <div className="timebox-left">
          <EvuemeInputTag
            className={`candidate-response-time ${inputDivClasses}`}
            type={"number"}
            id={minsInputFieldIdAndName}
            name={minsInputFieldIdAndName}
            value={localMinsValue}
            onChange={(e) => {
              if (Number(e.target.value) < 0 || Number(e.target.value) > 60)
                return;
              setLocalMinsValue(() => e.target.value);
            }}
            disabled={disabled}
          />
          <span>Min</span>
        </div>
        <div className="timebox-middle">:</div>
        <div className="timebox-right">
          <EvuemeInputTag
            className={`candidate-response-time ${inputDivClasses}`}
            type={"number"}
            id={secondsInputFieldIdAndName}
            name={secondsInputFieldIdAndName}
            value={localSecondsValue}
            onChange={(e) => {
              if (Number(e.target.value) < 0 || Number(e.target.value) > 60)
                return;
              setLocalSecondsValue(() => e.target.value);
            }}
            disabled={disabled}
          />{" "}
          <span>Sec</span>
        </div>
      </div>
      <EvuemeLabelTag
        className="text-color-gray"
        htmlFor="candidateResponseTime"
        labelText={labelText}
      />
    </div>
  );
};

export default ResponseTimeOld;
