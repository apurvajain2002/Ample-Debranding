import QuestionAddedSoFar from "../../../components/add-questions/new-question/question-added-so-far";
import EvuemeLoader from "../../../components/loaders/evueme-loader";

const QuestionsAddedSoFarSection = ({
  questionType = "",
  jobQuestions,
  isPublished,
  isLoadingJobQuestions,
  handleGetAllQuestions=()=>{},
}) => {
  if (isLoadingJobQuestions) {
    return <EvuemeLoader />;
  }

  return jobQuestions ? (
    jobQuestions.map((question, index) => (
      <QuestionAddedSoFar
        key={question.id}
        queSerialNum={index + 1}
        question={question}
        handleGetAllQuestions={handleGetAllQuestions}
        questionType={questionType}
        isPublished={isPublished}
      />
    ))
  ) : (
    <>No Questions Added for this round.</>
  );
};

export default QuestionsAddedSoFarSection;
