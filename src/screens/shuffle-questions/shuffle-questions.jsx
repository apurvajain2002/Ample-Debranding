import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { icon } from "../../components/assets/assets";
import { CSS } from "@dnd-kit/utilities";
import SetInterviewSection from "../add-questions/new-question/set-interview-section";
import SetBasicDetailsOfQuestion from "../add-questions/new-question/set-basic-details-of-question";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteQuestion,
  saveShuffleOrder,
  getAllQuestions,
} from "../../redux/actions/create-new-question-actions/create-new-question-actions";
import { setNewQuestion } from "../../redux/slices/create-new-question-slice";
import EvuemeLoader from "../../components/loaders/evueme-loader";

const ShuffleQuestionsRow = ({
  index,
  id,
  question,
  questionType,
  questionCompetency,
  questionText,
  jobId,
}) => {
  // Below code for Drag and drop
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const [loading,setLoading]= useState(false);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // Code for editing
  const { roundName } = useSelector((state) => state.createNewJobSliceReducer);
  const recruiterRound = useSelector(state => state.defineInterviewSliceReducer.recruiterRound);
  const l1Round = useSelector(state => state.defineInterviewSliceReducer.l1Round);
  const isPublished = roundName === 'L1 Hiring Manager Round' 
  ? l1Round?.isRoundPublished 
  : recruiterRound?.isRoundPublished;


  const { newQuestion, questionData } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );
  const dispatch = useDispatch();

  const handleOnChangeNewQuestion = async (e) => {

    if(!isPublished){
    if (e.target.name === "isProbeQuestion") {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          [e.target.name]:
            e.target.name === "isProbeQuestion"
              ? e.target.checked
              : e.target.value,
        })
      );
    } else if (e.target.name === "isEnhanced" && !newQuestion.isProbeQuestion) {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          [e.target.name]:
            e.target.name === "isEnhanced" ? e.target.checked : e.target.value,
        })
      );
    }

    dispatch(
      setNewQuestion({
        ...newQuestion,
        [e.target.name]: e.target.value,
      })
    );}
  };

  const [showEditQuestion, setShowEditQuestion] = useState(false);

  const handleOnClickDeleteQuestion = async () => {
    setLoading(true);
    await dispatch(deleteQuestion({ queId: question.id }));

    // Re-fetch questions after deletion
    await dispatch(getAllQuestions({ jobId, roundName }));
    setLoading(false);

  };

  useEffect(() => {
    document.getElementById(`queId${id}`).innerText = questionText;
  }, []);

  return (
    <div className="row">
    {loading&&<EvuemeLoader/>}
    <div className={isPublished ? "added-q-body" : "added-q-body drag-drop-ico"}
        ref={setNodeRef}
        {...(isPublished ? attributes : {})}
        style={style}
      >
        <div className="row valign-wrapper">
          <aside className="col xl2 l2 m2 s12 valign-wrapper">
            <div className="white slno">{index}</div>
            <div className="white slno">
              <div className="action-1">
                {/* Edit Not requried in shuffle page */}
                {/* <EvuemeImageTag
                  className={"grayColorFilter shuffle-question-icon "}
                  imgSrc={icon.editBoxIcon}
                  altText={"Edit question"}
                  onClick={() => {
                    handleOnClickEditQuestion();
                    setShowEditQuestion((prev) => !prev);
                  }}
                /> */}
                { isPublished?"":(
                  <EvuemeImageTag
                  className={" shuffle-question-icon"}
                  imgSrc={icon.deleteIcon}
                  altText={"Delete question"}
                  onClick={handleOnClickDeleteQuestion}
                />
                )
                }
                
              </div>
            </div>
          </aside>
          <aside
            className="col xl10 l10 m10 s12"
            style={{ backgroundColor: "white" }}
          >
            <div className="row valign-wrapper" {...(!isPublished?listeners:{})}>
              <div className="col xl2 l2 m2 s6 valign-wrapper">
              { isPublished?"":(<EvuemeImageTag
                  className={"move-questions-icon"}
                  imgSrc={icon.moveArrowsIcon}
                  altText="Click and drag the question to change its order"
                />)}
                {getShortNameForQuestion(question)}
              </div>
              <div className="col xl2 l2 m2 s6">{questionCompetency}</div>
              <div className="col xl8 l8 m8 s12 que-title" id={`queId${id}`}>
                {questionText}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* <!-- Toggle Edit Question start--> */}
      {showEditQuestion ? (
        <>
          <br />
          <div className="white">
            <div
              style={{
                height: "25px",
                boxSizing: "border-box",
                backgroundColor: "white",
                display: "flex",
                justifyContent: "flex-end",
                padding: "7px 7px",
              }}
            >
              <EvuemeImageTag
                className={"cursor-pointer"}
                imgSrc={icon.crossIcon}
                altText={"Close edit mcq popup"}
                onClick={() => setShowEditQuestion(() => false)}
              />
            </div>
            <SetBasicDetailsOfQuestion
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              handleOnChangeNewQuestion={handleOnChangeNewQuestion}
            />
            <SetInterviewSection
              roundName={roundName}
              newQuestion={newQuestion}
              setNewQuestion={setNewQuestion}
              handleOnChangeNewQuestion={handleOnChangeNewQuestion}
            />
          </div>
        </>
      ) : (
        <></>
      )}
      {/* <!-- Toggle Edit Question end--> */}
    </div>
  );
};

const ShuffleQuestionsComponent = ({ jobId, isPublished, roundName, questions = [] }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("inside use effect");
    console.log(isPublished)
    if (questions && questions.length !== 0) {
      const shuffleOrder = questions.map((que) => que.id);
      dispatch(
        saveShuffleOrder({
          jobId: jobId,
          roundName: roundName,
          shuffleQuesList: shuffleOrder,
        })
      );
    }
  }, [questions]);

  return (
    <>{isPublished?
      (<div>
      {questions.map((question, index) => (
        <ShuffleQuestionsRow
          key={question.id}
          index={index + 1}
          question={question}
          id={question.id}
          questionType={question.questionType}
          questionCompetency={question.competancy}
          questionText={question.questionText}
          jobId={jobId}
          roundName={roundName}
        />
      ))}
      </div>):(<SortableContext items={questions} strategy={verticalListSortingStrategy}>
      {questions.map((question, index) => (
        <ShuffleQuestionsRow
          key={question.id}
          index={index + 1}
          question={question}
          id={question.id}
          questionType={question.questionType}
          questionCompetency={question.competancy}
          questionText={question.questionText}
          jobId={jobId}
          roundName={roundName}
        />
      ))}
    </SortableContext>)} </>   
  );
};

function getShortNameForQuestion(question) {
  let name = ""
  switch (question.questionType) {
    case "openingScript":
      name = "OS";
      break;
    case "closingScript":
      name = "CS";
      break;
    case "filtration":
      name = "FQ";
      break;
    case "filler":
      name = "F/NR";
      break;
    case "skillBased": {
      switch (question.responseType) {
        case "audio":
          name = "SB/AR";
          break;
        case "video":
          name = "SB/VR";
          break;
        default:
          name = "SB/MCQ";
          break;
      }
      break;
    }
  }
  return name;
}

export default ShuffleQuestionsComponent;
