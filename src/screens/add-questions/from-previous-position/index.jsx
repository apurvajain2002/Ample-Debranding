import { useEffect, useState } from "react";
import SelectInputField from "../../../components/input-fields/select-input-field";
import CheckboxInputField from "../../../components/input-fields/checkbox-input-field";
import NormalButton from "../../../components/buttons/normal-button";
import TableComponent from "../../../components/table-components/table-component";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotPublishedJobs } from "../../../redux/actions/define-interview-actions/define-interview-actions";
import { optionMapper } from "../../../utils/optionMapper";
import {
  setFromJob,
  setFromRound,
} from "../../../redux/slices/from-previous-job-slice";
import { arrayToKeyValue } from "../../../utils/arrayToKeyValue";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../../config/config";
import { saveQuestionsFromPreviousPositions } from "../../../redux/actions/create-new-question-actions/create-new-question-actions";
import ErrorToast from "../../../components/toasts/error-toast";
import WarningToast from "../../../components/toasts/warning-toast";
import EvuemeLoader from "../../../components/loaders/evueme-loader";
import getUniqueId from "../../../utils/getUniqueId";
import SuccessToast from "../../../components/toasts/success-toast";

const FromPreviousPosition = ({ roundName, userId, userType }) => {
  const { jobId } = useSelector((state) => state.createNewJobSliceReducer);
  const { allNotPublishedJobs } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const { fromJob, fromRound } = useSelector(
    (state) => state.fromPreviousPositionSliceReducer
  );
  const dispatch = useDispatch();

  const [jobDetails, setJobDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const [showRows, setShowRows] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        selected: !updatedQuestions[index].selected,
      };
      return updatedQuestions;
    });
  };

  const handleAddQuestionsToJob = () => {
    const selectedQuestionsArray = questions
      .filter((question) => question.selected)
      .map((selectedQuestion) => selectedQuestion.questionId);

    setSelectedQuestions(selectedQuestionsArray);
  };

  // Handle to get job details for the job from which we have to add questions
  const handleGetJobDetails = async () => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get`,
        {
          jobId: fromJob,
        }
      );

      if (data.success) {
        setJobDetails(data.data);
      }
    } catch (error) {
      return ErrorToast(error.message);
    }
  };

  // handle to get Questions form the job from which we have to add questions
  const handleGetQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/get-all`,
        {
          jobId: fromJob,
          interviewRound: fromRound,
        }
      );
      if (data.status) {
        setQuestions(data.questions);
      } else {
        ErrorToast(data.message);
      }
    } catch (error) {
      return ErrorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Call the save questions from previous position API
  const handleSaveAddedQuestions = () => {
    dispatch(
      saveQuestionsFromPreviousPositions({
        jobId: jobId,
        roundName: roundName,
        quesArray: selectedQuestions,
      })
    );
  };

  useEffect(() => {
    dispatch(getAllNotPublishedJobs({ userId, ErrorToast }));
  }, []);

  useEffect(() => {
    if (fromJob) {
      handleGetJobDetails();
    }
  }, [fromJob]);

  useEffect(() => {
    if (fromRound) {
      handleGetQuestions();
    }
  }, [fromRound]);

  useEffect(() => {
    if (selectedQuestions.length > 0) handleSaveAddedQuestions();
  }, [selectedQuestions]);

  return (
    <>
      {loading && <EvuemeLoader />}
      <section className="body-box-body body-bg qsb-bg">
        <div className="row">
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName="fromJob"
            options={optionMapper(
              allNotPublishedJobs,
              "positionName",
              "jobId",
              "Select Job "
            )}
            value={fromJob}
            onChange={(e) => {
              if (e.target.value === jobId) {
                return WarningToast(
                  "Cannot insert questions form the same job!"
                );
              } else {
                dispatch(setFromJob(e.target.value));
              }
            }}
            labelText={"Select job"}
          />
          <SelectInputField
            divTagCssClasses="input-field col xl3 l4 m4 s12"
            selectTagIdAndName={"fromRound"}
            options={arrayToKeyValue(jobDetails?.interviewRounds, "Round Name")}
            value={fromRound}
            onChange={(e) => dispatch(setFromRound(e.target.value))}
          />
          <div className="input-field col xl3 l3 m3 s12">
            <NormalButton
              buttonTagCssClasses={"btn-clear btn-submit"}
              buttonText={"Add selected questions"}
              onClick={() => handleAddQuestionsToJob()}
            />
          </div>
        </div>
      </section>

      {questions.length > 0 && (
        <section className="body-box-body questionfound-body">
          <section className="row row-margin">
            <aside className="col s12 padding-0">
              <div className="qsdescription-wr previous-table-body-box-body">
                <TableComponent
                  showTableComponentHeader={false}
                  showRows={showRows}
                  setShowRows={setShowRows}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  // totalItems={totalItems}
                  // setTotalItems={setTotalItems}
                  // loading={loading}
                  // setLoading={setLoading}
                  tableHeadValues={[
                    { optionKey: "SQ", optionValue: "" },
                    { optionKey: "Question Description", optionValue: "" },
                    { optionKey: "Domain Skill", optionValue: "" },
                    { optionKey: "Question Type", optionValue: "" },
                  ]}
                >
                  {questions?.map((item, index) => (
                    <tr key={getUniqueId()}>
                      <td>
                        <CheckboxInputField
                          inputTagIdAndName={`selected${index}`}
                          checked={item.selected}
                          onChange={() => {
                            handleCheckboxChange(index);
                          }}
                        />
                      </td>
                      <td>{item.questionText}</td>
                      <td>{item.competancy}</td>
                      <td>{item.questionType}</td>
                    </tr>
                  ))}
                </TableComponent>
              </div>
            </aside>
          </section>
        </section>
      )}
    </>
  );
};

export default FromPreviousPosition;
