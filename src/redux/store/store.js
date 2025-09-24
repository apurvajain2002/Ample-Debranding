import { configureStore } from "@reduxjs/toolkit";
import roleSliceReducer from "../slices/role-slice";
import manageLocationsSliceReducer from "../slices/location-slice";
import industrySliceReducer from "../slices/industry-slice";
import domainSkillSliceReducer from "../slices/domain-skill-slice";
import softSkillSliceReducer from "../slices/soft-skill-slice";
import signinSliceReducer from "../slices/signin-slice";
import createNewJobSliceReducer from "../slices/create-new-job-slice";
import createCandidateSliceReducer from "../slices/create-candidate-slice";
import createUserManagementSliceReducer from "../slices/create-new-user-management-slice";
import createNewQuestionSliceReducer from "../slices/create-new-question-slice";
import defineInterviewSliceReducer from "../slices/define-interview-slice";
import signUpReducer from "../slices/sign-up-slice";
import inviteCandidatesSliceReducer from "../slices/invite-candidates-slice";
import fromPreviousPositionSliceReducer from "../slices/from-previous-job-slice";
import invitedCandidatesSliceReducer from "../slices/invited-candidates-slice";
import userInfoReducer from "../slices/user-information-slice";
import entitySliceReducer from "../slices/entity-slice";
import interviewResponseSlice from "../slices/interview-responses-slice";
import interviewSlice from "../slices/interview-slice";
import interviewResponsesL1DashboardSliceReducer from "../slices/interview-responses-l1-dashboard-slice";
import interviewResponsesRecruiterDashboardSliceReducer from "../slices/interview-responses-recuriter-dashboard-slice";
import summaryScoresScliceReducer from "../slices/summary-scores-slice";
import rootSliceReducer from "../slices/root-slice";

import { apiSlice } from "./api";

const store = configureStore({
  _reducer: {
    roleSliceReducer,
    industrySliceReducer,
    domainSkillSliceReducer,
    manageLocationsSliceReducer,
    softSkillSliceReducer,
    signinSliceReducer,
    createNewJobSliceReducer,
    createCandidateSliceReducer,
    createNewQuestionSliceReducer,
    defineInterviewSliceReducer,
    signUpReducer,
    inviteCandidatesSliceReducer,
    interviewResponsesL1DashboardSliceReducer,
    interviewResponsesRecruiterDashboardSliceReducer,
    fromPreviousPositionSliceReducer,
    invitedCandidatesSliceReducer,
    userInfoReducer,
    entitySliceReducer,
    interviewResponseSlice,
    interviewSlice,
    summaryScoresScliceReducer,
    rootSliceReducer,
    createUserManagementSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  get reducer() {
    return this._reducer;
  },
  set reducer(value) {
    this._reducer = value;
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;