const TERMINATION_QUESTION = {
  questionId: "",
  questionType: "terminationCheck",
  responseType: "mcq",
  questionText: "Are you sure? This may terminate your interview.",
};
const TERMINATION_OPTIONS = [
  {optionKey: "yes", optionValue: "Yes"},
  {optionKey: "no", optionValue: "No"},
];

export const TerminationQuestion = ({onYes, onNo, centered = true}) => {
  return (
    <div className="robochart" style={centered ? {display: "flex", justifyContent: "center"} : {}}>
      <div className="chatt-round roboavi"></div>
      <div className={centered ? "" : "rochat-wrap"} style={centered ? {display: "flex", flexDirection: "column"} : {}}>
        <div className="chatt-text">{TERMINATION_QUESTION.questionText}</div>
        <div className="btn-wr" style={centered ? {marginInline: "auto", width: "fit-content"} : {}}>
          {TERMINATION_OPTIONS.map((option) => (
            <a
              className="waves-effect waves-light btn-large left btn-mcw-robo"
              onClick={(e) => {
                e.preventDefault();
                if (option.optionKey === "yes") {
                  onYes();
                } else {
                  onNo();
                }
              }}
              key={option.optionKey}
            >
              {option.optionValue}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
