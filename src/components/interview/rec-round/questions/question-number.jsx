const QuestionNumber = ({ currentQuestionIndex, totalQuestions }) => {
  return (
    <header style={{ display: "flex", justifyContent: "start", flexDirection:"row" }}>
      {/* <p>{totalQuestions} Questions</p> */}
      <div className="qsno-robo">
        <span>{`Question ${currentQuestionIndex}`}</span>{` of ${totalQuestions}`}
      </div>
    </header>
  );
};

export default QuestionNumber;
