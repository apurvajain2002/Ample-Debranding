import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectInputField from "../../../components/input-fields/select-input-field";
import { ResponseTime } from "../../../components/add-questions/new-question/response-time";
import { getRoundDetails } from "../../../redux/actions/define-interview-actions/define-interview-actions";
import { arrayToKeyValue } from "../../../utils/arrayToKeyValue";
import { roundsData } from "../../../resources/constant-data/roundsData";
import {
  chooseAQuestionType,
  chooseAResponseType,
  chooseVideoType,
  filtrationQuestionResponseTypes,
  openingClosingScriptResponseTypes,
  probingQuestionResponseType,
  questionTypes,
  skillBasedResponseTypes,
  practiseQuestionResponseTypes,
} from "../../../resources/constant-data/add-new-question";
import { setIsTranslated } from "../../../redux/slices/create-new-question-slice";

const SetBasicDetailsOfQuestion = ({
  newQuestion,
  setNewQuestion,
  handleOnChangeNewQuestion,
  questionType = "",
  setQuestionType = () => {},
  userType = "recruiter",
  clearQuestion = () => {},
}) => {
  const dispatch = useDispatch();

  const { jobId, roundName } = useSelector(
    (state) => state.createNewJobSliceReducer
  );

  const { recruiterRound, l1Round } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );

  // Memoize filtered question types
  const questionTypesFiltered = useMemo(() => {
    let questionTypesNew = [...questionTypes];

    // Add select option at the beginning for admin users
    if (userType === "admin") {
      questionTypesNew = [
        ...questionTypesNew,
        { optionKey: "Practice Question", optionValue: "practiceQuestion" },
      ];
    }

    // Apply the existing recruiter filter
    return questionTypesNew.filter(
      (qt) => !(userType === "recruiter" && qt.optionValue === "closingScript")
    ).filter(
      (qt) => !(roundName === "L1 Hiring Manager Round" && qt.optionValue === "filtration")
    );
  }, [userType, roundName]);

  // Memoize skills data processing
  const { domainSkills, mixedSkills } = useMemo(() => {
    const processSkills = (round) => ({
      domainSkills: round?.domainSkills?.length
        ? arrayToKeyValue([...round.domainSkills], "Select Competency")
        : [],
      mixedSkills:
        round?.domainSkills?.length || round?.softSkills?.length
          ? arrayToKeyValue(
              [...round.domainSkills, ...round.softSkills],
              "Select Competency"
            )
          : [],
    });

    return roundName === roundsData.firstRound.name
      ? processSkills(recruiterRound)
      : processSkills(l1Round);
  }, [roundName, recruiterRound, l1Round]);

  // Memoize response type options logic
  const getResponseTypeOptions = useCallback(
    (questionType, roundName, isProbeQuestion) => {
      switch (true) {
        case ["openingScript", "closingScript"].includes(questionType):
          return openingClosingScriptResponseTypes;
        case questionType === "filtration":
          return filtrationQuestionResponseTypes;
        case questionType === "practiceQuestion":
          return practiseQuestionResponseTypes;
        case isProbeQuestion:
          return probingQuestionResponseType;
        case questionType === "skillBased":
          return roundName === roundsData.secondRound.name
            ? chooseVideoType
            : skillBasedResponseTypes;
        default:
          return chooseAQuestionType;
      }
    },
    []
  );

  useEffect(() => {
    if (jobId) {
      dispatch(getRoundDetails({ jobId }));
    }
  }, [jobId, dispatch]);

  const renderSkillBasedFields = () => {
    if (questionType !== "skillBased") return null;

    const competencyOptions =
      newQuestion.responseType === "mcq" ||
      newQuestion.responseType === "codeSnippet"
        ? domainSkills
        : ["video", "audio"].includes(newQuestion.responseType)
        ? mixedSkills
        : chooseAResponseType;

    return (
      <SelectInputField
        divTagCssClasses="input-field col xl3 l4 m4 s12"
        selectTagIdAndName="competency"
        options={competencyOptions}
        value={newQuestion.competency}
        onChange={handleOnChangeNewQuestion}
        labelText="Competency"
      />
    );
  };

  const shouldShowResponseType = ![
    "filtration",
    "filler",
    "openingScript",
    "closingScript",
  ].includes(questionType);

  return (
    <section id="setBasicDetailsOfQuestion" className="body-box-body body-bg">
      <div className="row">
        <SelectInputField
          divTagCssClasses="input-field col xl3 l4 m4 s12"
          selectTagIdAndName="questionType"
          options={questionTypesFiltered}
          value={questionType}
          onChange={(e) => {
            clearQuestion();
            setQuestionType(e.target.value);
            handleOnChangeNewQuestion(e);
            dispatch(setIsTranslated(false));
          }}
          labelText="Question Type"
        />

        {shouldShowResponseType &&
          questionType !== "filler" &&
          !(
            roundName === "L1 Hiring Manager Round" && questionType === "skillBased"
          ) && (
            <SelectInputField
              divTagCssClasses="input-field col xl3 l4 m4 s12"
              selectTagIdAndName="responseType"
              options={getResponseTypeOptions(
                questionType,
                roundName,
                newQuestion.isProbeQuestion
              )}
              value={newQuestion.responseType}
              onChange={handleOnChangeNewQuestion}
              labelText="Response Type"
            />
          )}

        {renderSkillBasedFields()}

        {!["filler"].includes(questionType) &&
          (userType !== "admin" &&
          ["openingScript", "closingScript"].includes(questionType) ? null : (
            <ResponseTime
              labelText="Candidate Response Time"
              divTagClasses="col xl3 l4 m4 s12"
              minsInputFieldIdAndName="responseTimeInMinutes"
              secondsInputFieldIdAndName="responseTimeInSeconds"
              question={newQuestion}
              updateQuestion={(q) => dispatch(setNewQuestion(q))}
              disabled={
                userType === "admin" &&
                ["openingScript", "closingScript"].includes(questionType)
              }
            />
          ))}
      </div>
    </section>
  );
};

export default SetBasicDetailsOfQuestion;
