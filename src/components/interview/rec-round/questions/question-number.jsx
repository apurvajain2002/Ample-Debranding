const QuestionNumber = ({ currentQuestionIndex, totalQuestions }) => {
  console.log('currentQuestionIndex ::: 04', currentQuestionIndex); 
  // console.log('mcqQuestionCounter ::: 02', mcqQuestionCounter); 
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
