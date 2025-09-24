import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";
import { icon } from "../../components/assets/assets";
import TopTapButtonIcon from "../../components/add-questions/top-tap-button-icon";
import NewQuestion from "./new-question/index";
import FromQuestionBank from "./from-question-bank/index";
import FromPreviousPosition from "./from-previous-position";
import NoRouteFound from "../no-route-found/no-route-found";
import BreadCrome from "../../components/admin/admin-breadcrome/admin-breadcrome";
import SelectInputField from "../../components/input-fields/select-input-field";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotPublishedJobs, getJobsFromEntity } from "../../redux/actions/define-interview-actions/define-interview-actions";
import { optionMapper } from "../../utils/optionMapper";
import {
  selectJobId,
  setRoundName,
} from "../../redux/slices/create-new-job-slice";
import { arrayToKeyValue } from "../../utils/arrayToKeyValue";
import { getAllEntities } from "../../redux/actions/entity-actions/entity-actions";
import { setCurrentEntity } from "../../redux/slices/entity-slice";
import { setCurrentJob } from "../../redux/slices/define-interview-slice";
import { clearCurrentQuestion } from "../../redux/slices/create-new-question-slice";

const AddQuestions = () => {
  const locationPathName = window.location.pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userType, userId } = useSelector((state) => state.signinSliceReducer);
  const { tableData: entities, currentEntity } = useSelector(
    (state) => state.entitySliceReducer
  );
  const { roundName } = useSelector((state) => state.createNewJobSliceReducer);
  const { allEntityJobs, currentJob } = useSelector(
    (state) => state.defineInterviewSliceReducer
  );
  const entityId = currentEntity ? currentEntity.id : "";
  const jobId = currentJob ? currentJob.jobId : "";
  const hiringType = currentJob ? currentJob.hiringType : "";
  const jobName = currentJob ? currentJob.positionName : "";

  useEffect(() => {
    document.title = "Add Questions";
  });

  useEffect(() => {
    // console.log("entityIdentityId ----- >",entityId);
    
    dispatch(getJobsFromEntity(userId));
    if (entityId) {
    
    }
  }, [currentEntity]);

  useEffect(() => {
    if (userType === "recruiter" && entities) {
      dispatch(setCurrentEntity(entities[0]));
    }
  }, [entities]);

  useEffect(() => {
    dispatch(getAllEntities({ userId, userType }));
  }, []);

  return (
    <div className="container">
      <BreadCrome />

      {/* Select questions from */}
      <div className="row row-margin padding-0 add-questions-top valign-wrapper">
        <aside className="col xl5 l12 m12 s12 add-questions-top-left padding-0">
          <ul className="top-tab-button">
            <TopTapButtonIcon
              iconSrc={icon.clipboardQuestionIcon}
              onClick={() => navigate("new-question")}
              linkText={"New Question"}
              active={locationPathName === "/admin/add-questions/new-question"}
            />
            <TopTapButtonIcon
              iconSrc={icon.bookQuestionIcon}
              onClick={() => navigate("from-question-bank")}
              linkText={"From Question Bank"}
              active={
                locationPathName === "/admin/add-questions/from-question-bank"
              }
            />
            <TopTapButtonIcon
              iconSrc={icon.onlineSurveyIcon}
              iconClassName="add-questions-online-survey"
              onClick={() => navigate("from-previous-position")}
              linkText={"From Previous Position"}
              active={
                locationPathName ===
                "/admin/add-questions/from-previous-position"
              }
            />
          </ul>
        </aside>
        <aside className="col xl8 l12 m12 s12 add-questions-top-right padding-0">
          {userType === "admin" && (
            <SelectInputField
              selectTagIdAndName={"entityName"}
              options={optionMapper(
                entities,
                "businessName",
                "id",
                "Entity Name"
              )}
              value={entityId}
              labelText={"Entity"}
              onChange={(e) => {
                const id = e.target.value;
                const currentEntt = entities.find(
                  (entt) => Number(entt.id) === Number(id)
                );
                dispatch(setCurrentEntity(currentEntt));
              }}
              disabled={userType !== "admin"}
            />
          )}
          <SelectInputField
            selectTagIdAndName={"selectJobPosition"}
            options={optionMapper(
              allEntityJobs,
              "positionName",
              "jobId",
              "Position Name"
            )}
            value={jobId}
            labelText={"Position"}
            cutomizedCssForLabel={true}
            onChange={(e) => {
              const id = e.target.value;
              const currentJob = allEntityJobs.find(
                (job) => Number(job.jobId) === Number(id)
              );
              dispatch(setCurrentJob(currentJob));
              dispatch(selectJobId(id));
            }}
          />

          {(userType === "admin" || userType === "recruiter") && (
            <SelectInputField
              selectTagIdAndName={"hiringType"}
              options={optionMapper(
                [
                  { hiringTypeName: "Campus Hiring", hiringTypeId: "Campus Hiring" },
                  { hiringTypeName: "Lateral Hiring", hiringTypeId: "Lateral Hiring" },
                ],
                "hiringTypeName",
                "hiringTypeId",
                "Hiring Type"
              )}
              labelText={"Hiring Type"}
              value={hiringType}
              cutomizedCssForLabel={true}
              disabled={true}
            />
          )}
          <SelectInputField
            selectTagIdAndName={"selectJobPosition"}
            options={arrayToKeyValue(
              currentJob?.interviewRounds?.toString().split(","),
              "Round Name"
            )}
            labelText={"Round"}
            value={roundName}
            cutomizedCssForLabel={true}
            onChange={(e) => {
              dispatch(setRoundName(e.target.value)); 
              dispatch(clearCurrentQuestion());
            }}
          />
        </aside>
      </div>

      <Routes>
      {/* Redirect from root to new-question */}
      <Route 
        path="/" 
        element={<Navigate to="/admin/add-questions/new-question" replace />} 
      />
      
      <Route
        path="/new-question"
        element={
          <NewQuestion
            jobName={jobName}
            roundName={roundName}
            jobId={jobId}
            entityId={entityId}
            hiringType={hiringType}
            userId={userId}
            userType={userType}
          />
        }
      />
      
      <Route
        path="/from-question-bank"
        element={
          <FromQuestionBank
            jobName={jobName}
            roundName={roundName}
            userId={userId}
            userType={userType}
          />
        }
      />
      
      <Route
        path="/from-previous-position"
        element={
          <FromPreviousPosition
            jobName={jobName}
            roundName={roundName}
            userId={userId}
            userType={userType}
          />
        }
      />

      {/* Catch all route - redirect to new-question */}
      <Route 
        path="*" 
        element={<Navigate to="/admin/add-questions/new-question" replace />} 
      />
    </Routes>
    </div>
  );
};

export default AddQuestions;
