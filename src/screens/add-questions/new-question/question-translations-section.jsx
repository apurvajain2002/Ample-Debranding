import TranslatedQuestion from "../../../components/add-questions/new-question/translated-question";
import { useSelector } from "react-redux";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import TranslatedProbeQuestion from "../../../components/add-questions/new-question/translated-probe-question";
import getUniqueId from "../../../utils/getUniqueId";

const QuestionTranslationsSection = ({
  newQuestion,
  setNewQuestion,
  handleOnChangeNewQuestion,
}) => {
  const { isTranslating } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );

  return isTranslating ? (
    <EvuemeLoader />
  ) : (
    <div className="question-slide-wrap">
      {!newQuestion.isProbeQuestion &&
        newQuestion.questionBankTranslations?.length !== 0 &&
        newQuestion?.questionBankTranslations?.map((question, index) => {
          let options =
            question?.questionOptions && question?.questionOptions !== "null"
              ? JSON.parse(question?.questionOptions)
              : [];

          if (!Array.isArray(options)) {
            options = [];
          }

          // For older interviews, for translated options we get array of strings.
          // For newer interviews, for translated options we get proper objects with { optionKey: "", optionValue: "" }
          if (options.length > 0 && typeof options[0] === "string") {
            options = options.map((option, index) => ({
              optionKey: String.fromCharCode(65 + index),
              optionValue: option
            }))
          }

          return (
            <TranslatedQuestion
              key={index}
              index={index}
              translateToLanguage={question.language}
              questionText={question.questionText}
              options={options}
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              handleOnChangeNewQuestion={handleOnChangeNewQuestion}
            />
          );
        })}
      {newQuestion.isProbeQuestion &&
        newQuestion.questionBankTranslations?.length !== 0 &&
        newQuestion.questionBankTranslations?.map((question, index) => (
          <TranslatedProbeQuestion
            key={getUniqueId()}
            index={index}
            question={question}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
          />
        ))}
      {newQuestion.probeQuestions?.length === 0 &&
        newQuestion.questionBankTranslations?.length === 0 && (
          <div>Click on translate button on the left to get translations</div>
        )}
    </div>
  );
};

export default QuestionTranslationsSection;
