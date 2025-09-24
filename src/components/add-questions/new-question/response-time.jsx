import EvuemeInputTag from "../../evueme-html-tags/evueme-input-tag";
import EvuemeLabelTag from "../../evueme-html-tags/evueme-label-tag";
import { useEffect } from "react";
import { getInitialResponseTimes } from "../../../utils/defaultResponseTimes";

export const ResponseTime =
  ({
    minsInputFieldIdAndName, secondsInputFieldIdAndName,
    divTagClasses = "",
    inputDivClasses = "",
    disabled = false,
    labelText = "Response Time",
    question,
    updateQuestion = () => { }
  }) => {
    useEffect(() => {
      const [mins, seconds] = getInitialResponseTimes(question?.responseType || "probe");
      updateQuestion({
        ...question,
        responseTimeInMinutes: mins,
        responseTimeInSeconds: seconds
      })
    }, [question?.responseType, question?.questionType])

    return (
      <div className={`input-field no-input-field ${divTagClasses}`}>
        <div className={`chipbox validate ${inputDivClasses}`}>
          <div className="timebox-left">
            <EvuemeInputTag
              className={`candidate-response-time ${inputDivClasses}`}
              value={question?.responseTimeInMinutes}
              onChange={e => {
                const updated = e.target.value;
                if (Number(updated) < 0 || Number(updated) > 60) return;
                updateQuestion({
                    ...question,
                    responseTimeInMinutes: updated
                })
              }}
              onBlur={() => {
                if (question?.responseTimeInMinutes !== "") return;
                updateQuestion({
                  ...question,
                  responseTimeInMinutes: "00"
                })
              }}
              type={"number"}
              id={minsInputFieldIdAndName}
              name={minsInputFieldIdAndName}
              disabled={disabled}
            />
            <span>Min</span>
          </div>
          <div className="timebox-middle">:</div>
          <div className="timebox-right">
            <EvuemeInputTag
              className={`candidate-response-time ${inputDivClasses}`}
              value={question?.responseTimeInSeconds}
              onChange={e => {
                const updated = e.target.value;
                if (Number(updated) < 0 || Number(updated) > 59) return;
                updateQuestion({
                  ...question,
                  responseTimeInSeconds: updated
                })
              }}
              onBlur={() => {
                if (question?.responseTimeInSeconds !== "") return;
                updateQuestion({
                  ...question,
                  responseTimeInSeconds: "00"
                })
              }}
              type={"number"}
              id={secondsInputFieldIdAndName}
              name={secondsInputFieldIdAndName}
              disabled={disabled}
            />
            <span>Sec</span>
          </div>
        </div>
        <EvuemeLabelTag
          htmlFor="candidateResponseTime"
          labelText={labelText}
        />
      </div>
    );
  }
