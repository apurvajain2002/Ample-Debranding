import { useEffect, useState } from "react";
import EvuemeImageTag from "../../components/evueme-html-tags/Evueme-image-tag";
import { icon } from "../../components/assets/assets";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ShuffleQuestionsComponent from "./shuffle-questions";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import PublishQuestions from "./publish-questions";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestions } from "../../redux/actions/create-new-question-actions/create-new-question-actions";
import SelectInputField from "../../components/input-fields/select-input-field";
import { optionMapper } from "../../utils/optionMapper";
import {
  selectJobId,
  setRoundName,
} from "../../redux/slices/create-new-job-slice";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue";
import { getAllNotPublishedJobs } from "../../redux/actions/define-interview-actions/define-interview-actions";
import { getJob } from "../../redux/actions/create-job-actions";
import ErrorToast from "../../components/toasts/error-toast";

const ShuffleQuestions = () => {
  const { jobQuestions } = useSelector(
    (state) => state.createNewQuestionSliceReducer
  );
  const { jobId, roundName, currentJobDetails } = useSelector(
    (state) => state.createNewJobSliceReducer
  );
  
  const recruiterRound = useSelector(state => state.defineInterviewSliceReducer.recruiterRound);
  const l1Round = useSelector(state => state.defineInterviewSliceReducer.l1Round);
  const isPublished = roundName === 'L1 Hiring Manager Round' 
  ? l1Round?.isRoundPublished 
  : recruiterRound?.isRoundPublished;
  const { allNotPublishedJobs } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { userId } = useSelector((state) => state.signinSliceReducer);
  const dispatch = useDispatch();

  const [questions, setQuestions] = useState([]);

  const getQuestionPosition = (id) =>
    questions.findIndex((question) => question.questionId === id);

  // drag will work only for mouse events
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active?.id === over?.id) return;

    setQuestions(() => {
      const originalPosition = getQuestionPosition(active.id);
      const newPosition = getQuestionPosition(over.id);

      return arrayMove(questions, originalPosition, newPosition);
    });
  };

  // drag will work for mobile and keyboards events
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    dispatch(getAllNotPublishedJobs({ userId, ErrorToast }));
  }, []);

  useEffect(() => {
    dispatch(getJob({ jobId: jobId }));
  }, [jobId]);

  useEffect(() => {
    if (currentJobDetails) {
    }
  }, [currentJobDetails]);

  useEffect(() => {
    if ((jobId, roundName)) {
      dispatch(getAllQuestions({ jobId: jobId, roundName: roundName }));
    }
  }, [jobId, roundName]);

  useEffect(() => {
    if (jobQuestions) setQuestions(jobQuestions);
  }, [jobQuestions]);

  return (
    <div className="container">
      <ul className="breadcrome-wr">
        <li>
          <a href="">
            <i>
              <EvuemeImageTag imgSrc={icon.homeIcon} altText="" />
            </i>{" "}
            Home
          </a>
        </li>
        <li>Shuffle questions</li>
      </ul>

      {/* Select Job and Round */}
      <header className="body-box-top">
        <div className="row row-margin padding-0 add-questions-top valign-wrapper">
          <aside className="xl-6 lg-6 md-6 s12">
            <h3>
              <i>
                <EvuemeImageTag
                  src={icon.brandingLogo}
                  altText={"Brand logo"}
                  style={{ marginRight: "2px" }}
                  alt=""
                />
              </i>
              Shuffle Questions
            </h3>
          </aside>
          <aside className="col xl5 l4 m12 s12 add-questions-top-right">
            <SelectInputField
              selectTagIdAndName={"selectJobPosition"}
              options={optionMapper(
                allNotPublishedJobs,
                "positionName",
                "jobId",
                "Position Name"
              )}
              value={jobId}
              onChange={(e) => dispatch(selectJobId(e.target.value))}
            />
            <SelectInputField
              selectTagIdAndName={"selectJobPosition"}
              options={arrayToKeyValue(
                currentJobDetails?.interviewRounds?.toString().split(","),
                "Round Name"
              )}
              value={roundName}
              onChange={(e) => dispatch(setRoundName(e.target.value))}
            />
          </aside>
        </div>
      </header>

      <div className="added-q-header">
        <div className="row">
          <aside className="col xl2 l2 m2 s3">
            <div className="white slno">SL No</div>
            <div className="white slno">Action</div>
          </aside>
          <aside className="col xl10 l10 m10 s9">
            <div className="row hea-right-2">
              <div className="col xl2 l2 m2 s2">Question Type</div>
              <div className="col xl2 l2 m2 s2">Competency</div>
              <div className="col xl8 l8 m8 s8">Title</div>
            </div>
          </aside>
        </div>
      </div>

      {/* DND Context */}
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
        sensors={sensors}
      >
        <ShuffleQuestionsComponent
          jobId={jobId}
          roundName={roundName}
          questions={questions || []}
          isPublished={isPublished}
        />
      </DndContext>

      <PublishQuestions />
    </div>
  );
};

export default ShuffleQuestions;
