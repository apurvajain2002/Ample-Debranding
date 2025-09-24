import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNewQuestion } from "../../../redux/slices/create-new-question-slice";
import NewProbeQuestion from "../../../components/add-questions/new-question/new-probe-question";
import QuestionTypeProbe from "../../../components/add-questions/new-question/qs-type-probe";

const probeQuestionInitialState = {
  probe_question_sequence: "",
  questionText: "",
  responseTimeInMinutes: "01",
  responseTimeInSeconds: "00",
};

const QuestionTypeProbeSection = () => {
  const { newQuestion } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );
  const dispatch = useDispatch();
  const [showAddNewProbeQuestion, setShowAddNewProbeQuestion] = useState(false);
  const [newProbeQuestion, setNewProbeQuestion] = useState(
    probeQuestionInitialState
  );

  const handleOnChangeNewProbeQuestion = (e) => {
    if (
      e.target.name === "responseTimeInMinutes" ||
      e.target.name === "responseTimeInSeconds"
    ) {
      if (Number(e.target.value) < 0 || Number(e.target.value) > 60) {
        return;
      }
    }

    setNewProbeQuestion({
      ...newProbeQuestion,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewProbeQuestion = () => {
    const newProbeQuestionsArray = [...newQuestion.probeQuestions];
    newProbeQuestionsArray.push({
      ...newProbeQuestion,
      probe_question_sequence: newProbeQuestionsArray.length,
    });
    dispatch(
      setNewQuestion({
        ...newQuestion,
        ["probeQuestions"]: newProbeQuestionsArray,
      })
    );
    setShowAddNewProbeQuestion(false);
    setNewProbeQuestion(() => probeQuestionInitialState);
  };

  const handleRemoveProbeQuestion = (indexOfQuestionToBeRemoved) => {
    const newProbeQuestionsArray = newQuestion.probeQuestions.filter(
      (_, index) => {
        return index !== indexOfQuestionToBeRemoved;
      }
    );
    dispatch(
      setNewQuestion({
        ...newQuestion,
        ["probeQuestions"]: newProbeQuestionsArray,
      })
    );
  };

  const toggleAddProbe = () => {
    setNewProbeQuestion(probeQuestionInitialState);
    setShowAddNewProbeQuestion(prev => !prev);
  }

  return (
    <div>
      {newQuestion?.probeQuestions &&
        newQuestion.probeQuestions.length > 0 &&
        newQuestion.probeQuestions.map((probeQuestion, index) => (
          <QuestionTypeProbe
            probeQuestion={probeQuestion}
            onDeleteProbe={() => handleRemoveProbeQuestion(index)}
          />
        ))}
      {showAddNewProbeQuestion ? (
        <NewProbeQuestion
          probeQuestion={newProbeQuestion}
          setProbeQuestion={setNewProbeQuestion}
          onChange={e => handleOnChangeNewProbeQuestion(e)}
        />
      ) : null}
      {newQuestion.probeQuestions?.length < 3 ? (
        showAddNewProbeQuestion ?
          <div>
            <Link className="right text-color-primary" onClick={toggleAddProbe}>
              Cancel
            </Link>
            <Link className="right text-color-primary margin-right-10" onClick={handleAddNewProbeQuestion}>
              Add
            </Link>
          </div> : <Link className="right text-color-primary" onClick={toggleAddProbe}>+ Add Probing Question</Link>
      ) : null}
    </div>
  );
}

export default QuestionTypeProbeSection;
