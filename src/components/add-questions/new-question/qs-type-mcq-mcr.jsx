import { useState } from "react";
import { Link } from "react-router-dom";
import QuestionOption from "./question-option";
import NewOption from "./new-option";

const QuestionTypeMcqMcr = ({ newQuestion, setNewQuestion }) => {
  const [showAddNewOption, setShowAddNewOption] = useState(false);

  return (
    !newQuestion.isProbeQuestion && (
      <div className="mcq-qs-boxwrap">
        {newQuestion?.questionOptions &&
          newQuestion.questionOptions?.map((option, index) => {
            return (
              <QuestionOption
                key={String.fromCharCode(index + 65)}
                index={index}
                type={option.type}
                optionKey={String.fromCharCode(index + 65)}
                optionValue={
                  option.type === "text"
                    ? option.optionValue
                    : option.optionPreview
                }
                checked={option.correct}
                newQuestion={newQuestion}
                setNewQuestion={setNewQuestion}
              />
            );
          })}
        {showAddNewOption ? (
          <NewOption
            setShowAddNewOption={setShowAddNewOption}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
        ) : (
          <></>
        )}
        <Link
          className="right"
          onClick={() => {
            setShowAddNewOption((prev) => !prev);
          }}
        >
          {showAddNewOption ? "Cancel" : "Add option +"}
        </Link>
      </div>
    )
  );
};

export default QuestionTypeMcqMcr;
