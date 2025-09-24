import { useEffect } from "react";
import EvuemeImageTag from "../../evueme-html-tags/Evueme-image-tag";
import { icon } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setNewQuestion,
  setQuestionData,
} from "../../../redux/slices/create-new-question-slice";
import {
  deleteQuestion,
  getQuestion,
  // getOpeningClosingScriptQuestion,
} from "../../../redux/actions/create-new-question-actions/create-new-question-actions";

const questionTypeAbbrevation = {
  openingScript: "OS",
  filler: "F",
  filtration: "FQ",
  skillBased: "SB",
  closingScript: "CS",
};

const responseTypeAbbrevation = {
  "": "NR",
  noResponse: "NR",
  mcq: "MCQ",
  audio: "AR",
  video: "VR",
  text: "TXT",
};

const QuestionAddedSoFar = ({
  questionType = "",
  queSerialNum,
  isPublished,
  question,
  handleGetAllQuestions = () => {},
}) => {
  const dispatch = useDispatch();
 
  const { userType } = useSelector((state) => state.signinSliceReducer);
  // const isEditable = () => {
  //   if (userType === "admin") return true;
  //   if (!question.scriptType) return true;
  //   if (
  //     question.scriptType === "openingScript" ||
  //     question.scriptType === "closingScript"
  //   )
  //     return false;
  //   return true;
  // };
  const { newQuestion, questionData, jobQuestions } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );

  const handleOnClickEditQuestion = () => {
    const currentQuestionId = question.id;
    // script types for opening and closing scripts in received getAllquestions
    // update here since some questions dont have scriptType
    const openingClosingScriptTypes = [
      "openingScript",
      "closingScript",
      "practiceQuestion",
    ];

    if (openingClosingScriptTypes.includes(questionType)) {
      const questionFound = jobQuestions.find(
        (q) => q.id === currentQuestionId
      );
      if (questionFound) {
        dispatch(setQuestionData());
        dispatch(setNewQuestion(questionFound));
      }
    } else {
      dispatch(getQuestion({ queId: currentQuestionId }));
    }
  };

  useEffect(() => {
    if (questionData) {
      const newQuestionData = {
        ...newQuestion,
        questionId: questionData?.id || "",
        questionType: questionData?.questionType || "",
        responseType: questionData?.responseType || "",
        competency: questionData?.competancy || "",
        responseTimeInMinutes: JSON.parse(
          questionData?.responseTimeInMinutes || "0"
        ),
        responseTimeInSeconds: JSON.parse(
          questionData?.responseTimeInSeconds || "0"
        ),
        originalQuestion: questionData?.questionText || "",
        questionOptions: JSON.parse(questionData?.questionOptions || "[]"),
        isProbeQuestion: questionData?.isProbeQuestion || false,
        probeQuestions: questionData?.probeQuestions?.length
          ? questionData.probeQuestions.map((q) => ({
              questionId: q.questionId ?? "",
              probeId: q.probeId ?? "",
              probe_question_sequence: q.probeQuestionSequence,
              questionText: q.questionText,
              responseTimeInMinutes: q.responseTimeInMinutes,
              responseTimeInSeconds: q.responseTimeInSeconds,
            }))
          : [],
        isEnhanced: questionData?.isEnhanced || false,
        enhancedMediaType: questionData?.enhancedQuestionFormatType || "",
        enhancedMedia: questionData?.enhancedMedia || "",
        enhancedMediaText: questionData?.enhancedMediaText || "",
        s3Url: questionData?.s3url || "",
        questionBankTranslations: JSON.parse(
          questionData?.questionBankTranslations || "[]"
        ),
        terminateInterview: questionData?.terminateInterview || false,
      };

      dispatch(setNewQuestion(newQuestionData));
    }
  }, [questionData]);

  const handleOnClickDeleteQuestion = () => {
    dispatch(deleteQuestion({ queId: question.id }));
  };

  useEffect(() => {
    document.getElementById(`queId${queSerialNum}`).innerText =
      question.questionText;
  }, []);

  return (
    <div className="row row-margin" style={{display:"flex"}}>
      <aside className="col xl11 l11 m10 s10" style={{display:"flex",alignItems:'center', flexDirection:'row'}}  >
        <div className="qno-box" >{queSerialNum}</div>
        <div className="qadded-wr" style={{marginLeft:"10px", backgroundColor: "red",width:"100%" }}>
          <div className="container">
          <p id={`queId${queSerialNum}`}>{question.questionText}</p>
            {question.isProbeQuestion && 
            <ul style={{paddingLeft:'30px', fontSize:'13px', fontWeight:'500'}}>
              {question.probingQuestionsList.map((item,index)=>{
                return <li key={index} style={{paddingTop:"7px"}}>P{index+1} : {item.questionText}</li>
              })}
            </ul>
            }
          </div>
        </div>
      </aside>
      <aside className="col xl1 l1 m2 s2" style={{display:"flex",alignItems:'center', flexDirection:'row'}}>
        <div className="qs-type-rightbox">
         { !isPublished ? (<ul className="action">
            {
              // needs to be updated since only specific questions are allowed for recruiter
              <li onClick={handleOnClickEditQuestion}>
                <a
                  href="#setBasicDetailsOfQuestion"
                  className="tooltipped"
                  data-position="top"
                  data-tooltip="Edit Position"
                >
                  <EvuemeImageTag
                    className="grayColorFilter cursor-pointer que-edit-so-far-btn"
                    imgSrc={icon.editBoxIcon}
                    altText="Edit Question"
                  />
                </a>
              </li>
            }
            {questionType === "openingScript" ||
            questionType === "closingScript" ? (
              <></>
            ) : (
              <li onClick={handleOnClickDeleteQuestion}>
                <Link
                  to=""
                  className="tooltipped"
                  data-position="top"
                  data-tooltip="Delete Question"
                >
                  <EvuemeImageTag
                    className={"cursor-pointer"}
                    imgSrc={icon.deleteIcon}
                    altText="Delete Question"
                  />
                </Link>
              </li>
            )}
          </ul>) : " "}
          <span>
            {questionTypeAbbrevation[question.questionType]}
            {questionType === "openingScript" ||
            questionType === "closingScript" ? (
              <></>
            ) : (
               ""
            )}
           {responseTypeAbbrevation[question.responseType] ? "/" + responseTypeAbbrevation[question.responseType] : ""}
          </span>
        </div>
      </aside>
    </div>
  );
};
export default QuestionAddedSoFar;
