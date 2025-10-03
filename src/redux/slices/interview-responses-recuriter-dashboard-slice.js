import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionsByTypes,
  fetchFilterRejectCandidates,
  fetchAudioScores,
  fetchVideoScores,
  updateCandidateStatus,
  fetchDomainScores,
  moveToNextRound,
} from "../actions/interview-responses-recruiter-dashboard-actions";
import { useDispatch } from "react-redux";
import SuccessToast from "../../components/toasts/success-toast";
import ErrorToast from "../../components/toasts/error-toast";

const initialState = {
  selectedJobId: "",
  selectedRoundId: "",
  selectedQueTypes: [],
  interviewResultStatusList: [],
  videoSkills: [],
  domainSkills: [],
  questionsByTypes: { filtration: [], audio: [], video: [], mcq: [] },
  questionMap: { filtration: {}, audio: {}, video: {}, mcq: {} },
  selectedQuestionsMap: {
    filtration: [],
    audio: [],
    video: [],
    mcq: [],
  },
  isStatusUpdateSuccessful: false,
  selectedQuestionsResponse: [],
  filteredResponses: [],
  responseMap: {},
  selectedCandidateEmailWpInfo:'',
  moveToNextRoundResponse: null,
  moveToNextRoundStatus: "idle",
  moveToNextRoundError: null,
  status: "idle",
  error: null, 
};


const interviewResponsesRecruiterDashboardSlice = createSlice({
  name: "interviewResponsesRecruiterDashboardSlice",
  initialState,
  reducers: {
    setInitialState: (state) => {
      return { ...initialState };
    },
    setSelectedCandidateEmailWpInfo:(state,action)=>{
      state.selectedCandidateEmailWpInfo = action?.payload; 
    },
    clearMoveToNextRoundResponse: (state) => {
      state.moveToNextRoundResponse = null;
      state.moveToNextRoundStatus = "idle";
      state.moveToNextRoundError = null;
    },
    setSelectedJobId: (state, action) => {
      state.selectedJobId = action?.payload;
    },
    setSelectedRoundId: (state, action) => {
      state.selectedRoundId = action.payload;
    },
    setQuestionsByTypes: (state, action) => {
    },
    setSelectedQueTypes: (state, action) => {
      state.selectedQueTypes = action.payload;
    },
    setFiltrationQuestionMap: (state, action) => {
      state.filtrationQuestioMap = action.payload;
    },
    setQuestionMap: (state, action) => {
      state.questionMap = { ...state.questionMap, ...action?.payload };
    },
    setFilteredResponses: (state, action) => {
      state.filteredResponses = action.payload;
    },
    setSelectedQuestionsResponse: (state, action) => {
      state.selectedQuestionsResponse = action.payload;
      state.filteredResponses = {};
    },
    setSelectedQuestionsMap: (state, action) => {
      state.selectedQuestionsMap = {
        ...action?.payload,
      };
    },
    setIsStatusUpdateSuccessful: (state, action) => {
      state.isStatusUpdateSuccessful = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsByTypes.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchQuestionsByTypes.fulfilled, (state, action) => {
        
        const obj = { filtration: [], audio: [], video: [], mcq: [] };

        
        if (action?.payload?.questionTypeList[0] === "filtration") {
          obj["filtration"] = action?.payload?.questions;
        } else if (action?.payload?.questionTypeList[0] === "skillBased") {
          if (state.selectedQueTypes.includes("mcq")) {
            obj["mcq"] = action?.payload?.competencyList?.map((value) => {
              return { questionText: value };
            });
          }
          action?.payload?.questions?.forEach((question) => {
            if (question?.responseType !== "mcq")
              obj[question.responseType].push(question);
          });
        }
        state.questionsByTypes = { ...state.questionsByTypes, ...obj };
      })
      .addCase(fetchQuestionsByTypes.rejected, (state, action) => {
        
      })
      .addCase(fetchFilterRejectCandidates.pending, (state) => {
       
      })
      .addCase(fetchFilterRejectCandidates.fulfilled, (state, action) => {
        
        const selectedJobId = state.selectedJobId;
        const selectedRoundId = state.selectedRoundId;
        const tableData = action.payload?.["candidateFiltrations"]?.map(
          (userObj, index) => {
            const obj = {};
            obj["applicant"] = userObj["user"] ?? {};
            const userId = userObj["user"]?.["id"];
            obj["status"] = userObj["status"];
            obj["published"] = userObj["published"] ?? false;
            state.selectedQueTypes.forEach((type) => {
              if (type === "audio") {
                obj["audio"] = userObj["audioList"];
              } else if (type === "video") {
                obj["video"] = userObj["videoList"];
              } else if (type === "filtration" && userObj[type]) {
                obj[type] = userObj[type];
              }
            });
            state.responseMap = { ...state.responseMap, [userId]: index };
            return obj;
          }
        );
        state.selectedQuestionsResponse = [...tableData];
        const statusList =
          action.payload?.["interviewResultConstantModelList"] ?? [];
        state.interviewResultStatusList = [...statusList];
      })
      .addCase(fetchFilterRejectCandidates.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(fetchAudioScores.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchAudioScores.fulfilled, (state, action) => {
       
        const responses = [...state.selectedQuestionsResponse];
        action.payload?.["roundSpecificDataDTO"]?.[
          state.selectedRoundId
        ]?.forEach((obj) => {
          const userId = obj["userId"];
          const index = state.responseMap[userId];
          if (responses[index]) {
            responses[index] = { ...responses[index], audioScore: obj };
          }
        });
        state.selectedQuestionsResponse = [...responses];
      })

      .addCase(fetchAudioScores.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(fetchVideoScores.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(fetchVideoScores.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchVideoScores.fulfilled, (state, action) => {
       
        const videoScoreData =
          action?.payload?.["roundSpecificHashMap"]?.[state.selectedRoundId];
        state.videoSkills =
          action?.payload?.["roundSpecificSkills"]?.[state.selectedRoundId]?.[
            "softSkillList"
          ];

        const responses = state.selectedQuestionsResponse;
        state.selectedQuestionsResponse.forEach((obj, index) => {
          const userId = obj["applicant"]?.["id"];
          responses[index] = {
            ...responses[index],
            videoScore: videoScoreData?.[String(userId)] ?? [],
          };
        });

        state.selectedQuestionsResponse = responses;
      })
      .addCase(fetchDomainScores.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(fetchDomainScores.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchDomainScores.fulfilled, (state, action) => {
        // state.status = 'succeeded';

        //   const payload = {
        //     "success": true,
        //     "message": "Domain data fetched successfully!",
        //     "roundSpecificSkills": {
        //         "Recruiter Round": {
        //             "softSkillList": [],
        //             "domainList": [
        //                 "",
        //                 "Channel Sales *"
        //             ]
        //         }
        //     },
        //     "roundSpecificHashMap": {
        //         "Recruiter Round": {
        //             "1434": [],
        //             "1137": [
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1137,
        //                     "competancy": "Adaptability  *",
        //                     "skillType": "Domain",
        //                     "averageScore": 20.0
        //                 },
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1137,
        //                     "competancy": "Channel Sales *",
        //                     "skillType": "Domain",
        //                     "averageScore": 20.0
        //                 }
        //             ],
        //             "1464": [],
        //             "1575": [
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1575,
        //                     "competancy": "Adaptability  *",
        //                     "skillType": "Domain",
        //                     "averageScore": 20.0
        //                 },
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1575,
        //                     "competancy": "Channel Sales *",
        //                     "skillType": "Domain",
        //                     "averageScore": 20.0
        //                 }
        //             ],
        //             "1584": [
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1584,
        //                     "competancy": "",
        //                     "skillType": "Domain",
        //                     "averageScore": 60.0
        //                 },
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1584,
        //                     "competancy": "Channel Sales *",
        //                     "skillType": "Domain",
        //                     "averageScore": 33.33333333333333
        //                 }
        //             ],
        //             "1517": [
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1517,
        //                     "competancy": "",
        //                     "skillType": "Domain",
        //                     "averageScore": 80.0
        //                 },
        //                 {
        //                     "interviewId": 400,
        //                     "userId": 1517,
        //                     "competancy": "Channel Sales *",
        //                     "skillType": "Domain",
        //                     "averageScore": 66.66666666666666
        //                 }
        //             ]
        //         }
        //     }
        // };

        const domainScoreData =
          action?.payload?.["roundSpecificHashMap"]?.[state.selectedRoundId];
        state.domainSkills =
          action?.payload?.["roundSpecificSkills"]?.[state.selectedRoundId]?.[
            "domainList"
          ];

        const responses = state.selectedQuestionsResponse;
        state.selectedQuestionsResponse.forEach((obj, index) => {
          const userId = obj["applicant"]?.["id"];
          responses[index] = {
            ...responses[index],
            domainScore: domainScoreData?.[String(userId)] ?? [],
          };
        });
        state.selectedQuestionsResponse = responses;
      })
      .addCase(updateCandidateStatus.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(updateCandidateStatus.fulfilled, (state, action) => {
        if (action.payload?.status) {
          state.isStatusUpdateSuccessful = action.payload?.status;
          SuccessToast("Status Updated Successfully!");
        } else {
          ErrorToast("Status Updated Unsuccessfully!");
        }
      })
      .addCase(updateCandidateStatus.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })
      .addCase(moveToNextRound.pending, (state) => {
        state.moveToNextRoundStatus = 'loading';
        state.moveToNextRoundError = null;
      })
      .addCase(moveToNextRound.fulfilled, (state, action) => {
        state.moveToNextRoundStatus = 'succeeded';
        state.moveToNextRoundResponse = action.payload;
        console.log('Move to next round response in slice:', action.payload);
        console.log('Action type:', action.type);
        console.log('Action meta:', action.meta);
      })
      .addCase(moveToNextRound.rejected, (state, action) => {
        state.moveToNextRoundStatus = 'failed';
        state.moveToNextRoundError = action.payload;
        console.log('Move to next round error:', action.payload);
      });
  },
});

export const {
  setSelectedJobId,
  setSelectedRoundId,
  setSelectedQueTypes,
  setFiltrationQuestionMap,
  setSelectedQuestionsResponse,
  setQuestionsByTypes,
  setQuestionMap,
  setFilteredResponses,
  setSelectedQuestionsMap,
  setInitialState,
  setIsStatusUpdateSuccessful,
  setSelectedCandidateEmailWpInfo,
  clearMoveToNextRoundResponse
} = interviewResponsesRecruiterDashboardSlice.actions;

const interviewResponsesRecruiterDashboardSliceReducer =
  interviewResponsesRecruiterDashboardSlice.reducer;
export default interviewResponsesRecruiterDashboardSliceReducer;
