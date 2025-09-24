import { useEffect, useRef } from "react";

const MIN_HEIGHT_TEXT_AREA = 32;

const Answer = ({ answer, audioUrl, options, type, setAnswer }) => {
  let selectedOption = options.find((option) => option.optionKey === answer);
  let imageType = selectedOption?.type === "image" ?? false;
  const textAreaRef = useRef(null);

  useEffect(() => {
    if (type === "codeSnippet" && textAreaRef.current) {
      textAreaRef.current.style.height = "inherit";
      textAreaRef.current.style.height = `${Math.max(
        textAreaRef.current.scrollHeight,
        MIN_HEIGHT_TEXT_AREA
      )}px`;
    }
  }, [answer]);

  return (
    <div className="robochart user-chatt">
      <div className="chatt-round roboround"></div>
      <div className="rochat-wrap">
        <div className="chatt-text chatt-userico">
          {(type === "mcq" || type === "mcr") && (
            <McqAnwser imageType={imageType} selectedOption={selectedOption} />
          )}
          {type === "codeSnippet" && (
            <textarea
              ref={textAreaRef}
              value={answer || ""}
              placeholder="Please enter your answer here"
              className="candidate-response-codeSnippet"
              onChange={(e) => setAnswer(e.target.value)}
              cols={50}
            />
          )}
          {type === "audio" && <>Recorded</>}
          {type === "video" && <>{answer}</>}
        </div>
      </div>
    </div>
  );
};

const McqAnwser = ({ imageType, selectedOption }) => {
  if (!selectedOption) return null;
  const { optionKey, optionPreview, optionValue } = selectedOption;

  return (
    <>
      {imageType ? (
        <div className="candidate-mcq-answer">
          <span className="left">{optionKey.toUpperCase()}</span>
          <img src={optionPreview} alt="mcq-response" />
        </div>
      ) : (
        optionValue
      )}
    </>
  );
};

export default Answer;
