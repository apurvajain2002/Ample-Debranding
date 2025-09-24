import { useEffect, useState, useRef } from "react";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import PlayButton from "../../../components/add-questions/new-question/play-button";
import NormalButton from "../../../components/buttons/normal-button";
import CheckboxInputField from "../../../components/input-fields/checkbox-input-field";
import QuestionTypeProbeSection from "./qs-type-probe-section";
import QuestionTypeMcqMcr from "../../../components/add-questions/new-question/qs-type-mcq-mcr";
import EnhanceSectionIcon from "../../../components/add-questions/new-question/enhance-section-icon";
import UploadMedia from "../../../components/add-questions/new-question/upload-media";
import QuestionTranslationsSection from "./question-translations-section";
import { icon } from "../../../components/assets/assets";
import { useDispatch, useSelector } from "react-redux";
import {
  createQuestion,
  editQuestion,
  translateQuestion,
  editOpeningClosingScriptQuestion,
} from "../../../redux/actions/create-new-question-actions/create-new-question-actions";
import { setMessagesEmpty } from "../../../redux/slices/create-new-question-slice";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import SuccessToast from "../../../components/toasts/success-toast";
import WarningToast from "../../../components/toasts/warning-toast";
import ErrorToast from "../../../components/toasts/error-toast";
import getUniqueId from "../../../utils/getUniqueId";
import { roundsData } from "../../../resources/constant-data/roundsData";
import Tooltip from "../../../components/miscellaneous/tooltip";
import { playAudioHandler } from "../../../utils/playAudio";
const attachQuestionMediaData = [
  {
    iconSrc: icon.audioIcon,
    iconClassName: "enhance-audio secondaryColorFilter",
    altText: "Upload audio",
    pText: "Upload Audio",
    mediaType: "audio",
  },
  {
    iconSrc: icon.videoIcon,
    iconClassName: "",
    altText: "Upload video",
    pText: "Upload Video",
    mediaType: "video",
  },
  {
    iconSrc: icon.uploadImageIcon,
    iconClassName: "enhance-upload-image secondaryColorFilter",
    altText: "Upload image",
    pText: "Upload Picture",
    mediaType: "image",
  },
  {
    iconSrc: icon.pdfFileIcon,
    iconClassName: "secondaryColorFilter",
    altText: "Upload file/document",
    pText: "Upload Document",
    mediaType: "document",
  },
  {
    iconSrc: icon.codeSnipetIcon,
    iconClassName: "",
    altText: "Upload code snippet",
    pText: "Code Snippet",
    mediaType: "codeSnippet",
  },
  {
    iconSrc: icon.textIcon,
    iconClassName: "enhance-text",
    altText: "Upload text",
    pText: "Text",
    mediaType: "text",
  },
];

const SetInterviewSection = ({
  roundName = "",
  jobId = "",
  hiringType = "",
  entityId,
  newQuestion,
  setNewQuestion,
  questionType = "",
  userType = "",
  handleOnChangeNewQuestion = () => { },
  handleGetAllQuestions = () => { },
  clearQuestion = () => { },
}) => {
  const { recruiterRound, l1Round } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const [attachQuestionMediaType, setAttachQuestionMediaType] = useState(""); //audio, video, picture, document, code snippet, text
  const [mediaFile, setMediaFile] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const { isLoading, successMessage, failMessage, isAboutCompanySet, isTranslated } =
    useSelector((state) => state.createNewQuestionSliceReducer);
  const audioRef = useRef(null);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);

  const isPublished = roundName === 'L1 Hiring Manager Round'
    ? l1Round?.isRoundPublished
    : recruiterRound?.isRoundPublished;

  // Handle question submit
  const handleSubmit = async () => {
    // Check for jobId and roundName
    if (!roundName || !jobId) {
      return WarningToast("Please select Position name and Round name");
    }

    // Check for question text
    if (!newQuestion.originalQuestion && !newQuestion.questionText) {
      return WarningToast("Write a question text");
    }

    if (questionType === "openingScript") {
      if ((roundName === roundsData.secondRound.name &&
        questionType !== "" && !(hiringType === 'Campus Hiring' && questionType === "openingScript") &&
        l1Round?.interviewTranslationLanguages?.length) || (roundName === roundsData.firstRound.name &&
          questionType !== "" &&
          recruiterRound?.interviewTranslationLanguages?.length)) {
        if (!newQuestion.questionText) {
          return WarningToast("Do translation first");
        }
      }
    }

    // if closing or opening script
    if (
      questionType === "openingScript" ||
      questionType === "closingScript" ||
      questionType === "practiceQuestion"
    ) {
      dispatch(
        editOpeningClosingScriptQuestion(
          {
            newQuestion,
            entityId,
            interviewRound: roundName,
            jobId,
            hiringType,
            userType,
            ...(questionType === "practiceQuestion" && {
              responseType: newQuestion.responseType,
              responseTime: newQuestion.responseTime,
            }),
          },
          ErrorToast
        )
      );
      return;
    }

    // check for termination
    if (questionType === "filtration") {
      if (newQuestion.questionOptions?.length < 1) {
        return WarningToast("Add at least 1 filtration option");
      }

      if (
        newQuestion.terminateInterview &&
        !newQuestion.questionOptions?.some((op) => op.correct === true)
      ) {
        return WarningToast(
          "Please select at least one option as correct option"
        );
      }
    }

    // Check for question type
    if (!questionType) return WarningToast("Select Question Type!");

    // Check for response type
    if (questionType !== "filler" && !newQuestion.responseType)
      return WarningToast("Select Response Type!");

    // Check for competency removing as asked by client to make it nonmandatory
    // if (questionType === "skillBased" && !newQuestion.competency)
    //   return WarningToast("Select Competency!");

    if (questionType === "skillBased" && !newQuestion.competency) {
      return WarningToast("Select Competency!");
    }

    // Checking for translation in Recruiter round
    if (
      roundName === roundsData.firstRound.name &&
      recruiterRound?.interviewTranslationLanguages?.length &&
      newQuestion?.questionBankTranslations?.length === 0 &&
      !newQuestion.questionText
    ) {
      return WarningToast("Do translation first");
    }
    // Checking for translation in L1 round
    if (
      roundName === roundsData.secondRound.name &&
      l1Round?.interviewTranslationLanguages?.length &&
      newQuestion?.questionBankTranslations?.length === 0 &&
      !newQuestion.questionText
    ) {
      return WarningToast("Do translation first");
    }

    if (
      !newQuestion.questionId &&
      newQuestion.isEnhanced &&
      newQuestion.enhancedMediaType === "text" &&
      !newQuestion.enhancedMediaText
    ) {
      return WarningToast("Enter the enhanced text");
    }

    if (
      !newQuestion.questionId &&
      newQuestion.isEnhanced &&
      newQuestion.enhancedMediaType === "codeSnippet" &&
      !newQuestion.enhancedMediaText
    ) {
      return WarningToast("Enter the code");
    }

    if (
      !newQuestion.questionId &&
      newQuestion.isEnhanced &&
      newQuestion.enhancedMediaType !== "text" &&
      newQuestion.enhancedMediaType !== "codeSnippet" &&
      !newQuestion.enhancedMedia
    ) {
      return WarningToast("Upload the enhanced media");
    }

    if (
      (newQuestion?.responseType === "mcq" ||
        (newQuestion?.responseType === "mcr" &&
          questionType !== "filtration")) &&
      newQuestion?.questionOptions?.length < 2
    ) {
      WarningToast("Add atleast 2 MCQ options");
      return;
    }

    if (
      (newQuestion?.responseType === "mcq" ||
        (newQuestion?.responseType === "mcr" &&
          newQuestion?.questionType !== "filtration")) &&
      !newQuestion?.questionOptions?.some((option) => option.correct === true)
    ) {
      WarningToast("Mark atleast 1 option as correct");
      return;
    }

    if (
      newQuestion?.responseType === "mcq" &&
      newQuestion?.questionOptions?.length > 1
    ) {
      let count = 0;
      const options = newQuestion?.questionOptions;
      for (const option of options) {
        if (option.correct === true) {
          ++count;
        }
        if (count > 1) {
          WarningToast("MCQ can only have 1 correct option.");
          return;
        }
      }
    }

    if (newQuestion.isProbeQuestion) {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          questionOptions: [],
          isEnhanced: false,
          enhancedMedia: "",
        })
      );
    } else {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          probeQuestions: [],
        })
      );
    }

    if (newQuestion.questionId) {
      dispatch(editQuestion({ jobId, roundName, newQuestion }));
    } else {
      if (
        questionType === "openingScript" ||
        questionType === "closingScript"
      ) {
        // dispatch(
        //   createOpeningScriptQuestion(
        //     { jobId, roundName, entityName, newQuestion },
        //     { ErrorToast }
        //   )
        // );
      } else {
        dispatch(createQuestion({ jobId, roundName, newQuestion }));
      }
    }

    // Reset audio
    audioRef.current.src = "";
    // Gets all the questions
    return;
    handleGetAllQuestions();
  };

  // Handle question translations
  const handleTranslateQUestion = async () => {
    if (!jobId) {
      return WarningToast("Select a Job");
    }
    if (!newQuestion.originalQuestion && !newQuestion?.questionText) {
      return WarningToast("Write a question text");
    }
    if (newQuestion.isProbeQuestion) {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          questionOptions: [],
        })
      );
    } else {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          probeQuestions: [],
        })
      );
    }
    dispatch(translateQuestion({ jobId, roundName, newQuestion }));
  };

  useEffect(() => {
    if (jobId) clearQuestion();
  }, [jobId]);

  useEffect(() => {
    if (newQuestion.enhancedMediaType)
      setAttachQuestionMediaType(newQuestion.enhancedMediaType);
    if (newQuestion.s3Url || newQuestion.enhancedMediaText)
      setMediaPreview(newQuestion.s3Url || newQuestion.enhancedMediaText);
  }, [newQuestion]);

  useEffect(() => {
    // turns of terminate interview on no correct option selection
    if (
      newQuestion.questionOptions &&
      newQuestion.questionOptions.every((op) => op.correct === false)
    ) {
      dispatch(
        setNewQuestion({
          ...newQuestion,
          terminateInterview: false,
        })
      );
    }
  }, [newQuestion.questionOptions]);

  useEffect(() => {
    if (
      successMessage &&
      successMessage !== "Question fetched successfully!" &&
      successMessage !== "Question translated successfully!" &&
      successMessage !==
      "No questions found for this job ID and interview round."
    ) {
      SuccessToast(successMessage);

      clearQuestion();
      handleGetAllQuestions();
      setMediaFile("");
      setMediaPreview("");
      setAttachQuestionMediaType("");
      let goTo = document.getElementById("root");
      goTo.scrollIntoView({ behavior: "smooth" });
    } else if (failMessage && failMessage !== `For input string: ""`) {
      ErrorToast(failMessage);
    }
    dispatch(setMessagesEmpty());
  }, [successMessage, failMessage]);

  return (
    <section id="setInterviewSection" className="row row-margin">
      <div className="setInterviewSection">
        <aside className="col xl5 l6 m6 s12 set-interview-question-left">
          <div className="card card-custom-wr">
            <div className="card-content custom-card">
              <h3 className="card-title">
                Set Interview Question
                {questionType === "openingScript" &&
                  userType === "recruiter" &&
                  newQuestion.questionId && (
                    <i
                      className="show-details infermation-ico-black centered"
                      style={{ display: "inline-flex" }}
                    >
                      i
                      <Tooltip divTagCssClasses={"infbox-click"}>
                        <p>
                          Edit if need be to talk more about the role for the
                          candidate.
                        </p>
                      </Tooltip>
                    </i>
                  )}
              </h3>
              <div className="text-editor-wrap">
                <div className="editorbox">
                  <textarea
                    name="originalQuestion"
                    id="originalQuestion"
                    cols="30"
                    rows="20"
                    placeholder="Enter question text here..."
                    // The first two might evaluate to undefined, in which case the value doesn't clear
                    value={
                      newQuestion.originalQuestion ||
                      newQuestion.questionText ||
                      ""
                    }
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/'/g, "");
                      handleOnChangeNewQuestion(e);
                    }}
                    className="original-que-textarea"
                  ></textarea>
                </div>
                <div className="question-ply-wrap">
                  <PlayButton
                    onClick={() => {
                      let text =
                        newQuestion.scriptType === "openingScript" ||
                          newQuestion.scriptType === "closingScript" ||
                          newQuestion.scriptType === "opening_script" ||
                          newQuestion.scriptType === "closing_script"
                          ? newQuestion.questionText
                          : newQuestion.originalQuestion;
                      playAudioHandler(text, "English", audioRef);
                    }}
                  />
                  <audio controls className="qs-audio" ref={audioRef}></audio>
                  {roundName === roundsData.firstRound.name &&
                    questionType !== "" &&
                    recruiterRound?.interviewTranslationLanguages?.length ? (
                    <NormalButton
                      buttonTagCssClasses={
                        "btn-clear btn-submit btn-small btnsmall-tr right"
                      }
                      buttonText={"Translate"}
                      onClick={handleTranslateQUestion}
                    />
                  ) : (
                    <></>
                  )}
                  {roundName === roundsData.secondRound.name &&
                    questionType !== "" && !(hiringType === 'Campus Hiring' && questionType === "openingScript") &&
                    l1Round?.interviewTranslationLanguages?.length ? (
                    <NormalButton
                      buttonTagCssClasses={
                        "btn-clear btn-submit btn-small btnsmall-tr right"
                      }
                      buttonText={"Translate"}
                      onClick={handleTranslateQUestion}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                {roundName === roundsData.secondRound.name &&
                  questionType === "skillBased" && (
                    <div style={{ padding: "5px" }}>
                      <div>
                        <CheckboxInputField
                          inputTagIdAndName="isProbeQuestion"
                          checked={newQuestion.isProbeQuestion}
                          onChange={(e) => handleOnChangeNewQuestion(e)}
                          labelText="Add Probing Questions"
                        />
                      </div>
                      {newQuestion.isProbeQuestion ? (
                        <QuestionTypeProbeSection />
                      ) : null}
                    </div>
                  )}
                &nbsp;
                {/* Rendering options if question type is mcq or mcr */}
                {newQuestion.responseType === "mcq" ||
                  newQuestion.responseType === "mcr" ? (
                  <QuestionTypeMcqMcr
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                  />
                ) : (
                  <></>
                )}
                {/* <!-- End question box || Enhance Question--> */}
                {questionType === "filtration" ? (
                  <div className="enhance-question">
                    <div className="topenhance">
                      <CheckboxInputField
                        inputTagIdAndName="terminateInterview"
                        checked={newQuestion.terminateInterview}
                        onChange={(e) => handleOnChangeNewQuestion(e)}
                        labelText="Terminate Interview"
                        labelCss="enhance-question-format"
                      // disabled={newQuestion?.questionOptions?.every(
                      //   (op) => op.correct === false
                      // )}
                      />
                      <i
                        className="show-details infermation-ico-black centered"
                        style={{ display: "inline-flex" }}
                      >
                        i
                        <Tooltip divTagCssClasses={"infbox-click"}>
                          <p>
                            Terminate candidates interview with a warning
                            message if desired correct options is not chosen by
                            candidates
                          </p>
                        </Tooltip>
                      </i>
                    </div>
                  </div>
                ) : !newQuestion.isProbeQuestion ? (
                  <>
                    <div className="enhance-question">
                      {questionType === "openingScript" ||
                        questionType === "practiceQuestion" ||
                        questionType === "closingScript" ? (
                        <></>
                      ) : (
                        <div className="topenhance">
                          <CheckboxInputField
                            inputTagIdAndName="isEnhanced"
                            checked={newQuestion.isEnhanced}
                            onChange={(e) => handleOnChangeNewQuestion(e)}
                            labelText="Enhance Question Format"
                            labelCss="enhance-question-format"
                          />
                        </div>
                      )}
                      {newQuestion.isEnhanced && !isUploading ? (
                        <ul className="enhance-sectionul">
                          {attachQuestionMediaData?.map((item, index) => (
                            <EnhanceSectionIcon
                              key={getUniqueId()}
                              iconSrc={item.iconSrc}
                              iconClassName={item.iconClassName}
                              altText={item.altText}
                              pText={item.pText}
                              active={
                                item.mediaType === attachQuestionMediaType
                              }
                              onClick={() => {
                                // if (!attachQuestionMediaType) {
                                setAttachQuestionMediaType(item.mediaType);
                                dispatch(
                                  setNewQuestion({
                                    ...newQuestion,
                                    enhancedMediaType: item.mediaType,
                                  })
                                );
                                // }
                              }}
                            />
                          ))}
                        </ul>
                      ) : null}
                      {isUploading ? (
                        <EvuemeLoader />
                      ) : newQuestion.isEnhanced && attachQuestionMediaType ? (
                        <div className={"add-question-upload-media"}>
                          &nbsp;
                          {!mediaPreview ? (
                            <div className="add-question-upload-media-top-div">
                              <p>
                                Upload your{" "}
                                {attachQuestionMediaType === "codeSnippet"
                                  ? "code snippet"
                                  : attachQuestionMediaType}
                              </p>
                              <p>
                                <EvuemeImageTag
                                  className={"cursor-pointer"}
                                  imgSrc={icon.crossIcon}
                                  onClick={() => setAttachQuestionMediaType("")}
                                />
                              </p>
                            </div>
                          ) : null}
                          <UploadMedia
                            newQuestion={newQuestion}
                            setNewQuestion={setNewQuestion}
                            mediaType={attachQuestionMediaType}
                            setAttachQuestionMediaType={
                              setAttachQuestionMediaType
                            }
                            mediaFile={mediaFile}
                            setMediaFile={setMediaFile}
                            mediaPreview={mediaPreview}
                            setMediaPreview={setMediaPreview}
                            setIsUploading={setIsUploading}
                          />
                        </div>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </aside>
        {roundName === roundsData.firstRound.name &&
          recruiterRound?.interviewTranslationLanguages?.length ? (
          <aside className="col xl7 l6 m6 s12 set-interview-question-right">
            <div className="card card-custom-wr qcard">
              <div className="card-content custom-card">
                <h3 className="card-title">Question Translations</h3>
                {
                  <QuestionTranslationsSection
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                    handleOnChangeNewQuestion={handleOnChangeNewQuestion}
                  />
                }
              </div>
            </div>
            &nbsp;
          </aside>
        ) : (
          <></>
        )}
        {roundName === roundsData.secondRound.name &&
          l1Round?.interviewTranslationLanguages?.length ? (
          <aside className="col xl7 l6 m6 s12 set-interview-question-right">
            <div className="card card-custom-wr qcard">
              <div className="card-content custom-card">
                <h3 className="card-title">Question Translations</h3>
                {
                  <QuestionTranslationsSection
                    newQuestion={newQuestion}
                    setNewQuestion={setNewQuestion}
                    handleOnChangeNewQuestion={handleOnChangeNewQuestion}
                  />
                }
              </div>
            </div>
            &nbsp;
          </aside>
        ) : (
          <></>
        )}
      </div>
      {isLoading && <EvuemeLoader />}
      &nbsp;
      <div className="add-que-save-clear-que-btn-wrapper">
        <NormalButton
          style={{ margin: "0" }}
          buttonTagCssClasses={
            "btn-clear  btnsmall-tr save-translated-questions "
          }
          buttonText={"Clear "}
          onClick={() => clearQuestion()}
        />
        <NormalButton
          style={{ margin: "0" }}
          buttonTagCssClasses={
            "btn-clear btn-submit btnsmall-tr save-translated-questions "
          }
          buttonText={"Save "}
          onClick={() => handleSubmit()}
          disabled={isPublished ||
            ((questionType === "closingScript" ||
              questionType === "practiceQuestion") &&
              !newQuestion.questionId) || (roundName === roundsData.secondRound.name && hiringType === 'Campus Hiring' && questionType === "openingScript")
          }
        />
      </div>
    </section>
  );
};

export default SetInterviewSection;
