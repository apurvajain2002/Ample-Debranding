import { createSlice } from '@reduxjs/toolkit';
import { fetchCandidateList, fetchTotalQuestions, fetchCandidateResponseList, fetchSelectedCandidateInfo, fetchCandidateVideoScores, fetchReportMetaData, triggerScoreCalculation } from '../actions/interview-responses-l1-dashboard-actions';
// Async thunk to fetch data (replace with your actual API call logic)




// Define the initial state for the slice
const initialState = {
  selectedJobId: '',
  selectedRoundId: '',
  selectedCandidateId: '',
  candidateList: [],
  displayCandidateWidgetList: [],
  isViewByApplicant: true,
  totalQuestionList: [],
  candidateResponseList: [],
  filteredCandidateResponseList: [],
  selectedQuestionMap: [],
  // selectedCandidateRating: {},
  userDetailsInfo: {},
  selectedCandidateInfo: {
    name: '-',
    higherEducation: '-',
    totalExperience: '-',
    organizationName: '-',
    designation: '-',
    currentCTC: '-',
    noticePeriod: '-',
    currentLocation: '-'
  },
  candidateResponseMap: [],
  filteredResponseMap: [{ id: '', questionText: '', response: '' }],
  status: 'idle',  // tracks loading, success, error states
  error: null,     // stores error message if the API call fails
  fetchingCandidateList: false,
  fetchingCandidateResponseList: false,
  fetchCandidateVideoScores: false,
  roundSpecificHashMap: {},
  aiScore: '',
  aiComment: '',
  transcription: '',
  competancy: '',
  skillType: '',
  reportLink: '',
  triggerScore: null,
};

// Create the slice
const interviewResponsesL1DashboardSlice = createSlice({
  name: 'interviewResponsesL1DashboardSlice',
  initialState,
  reducers: {
    setInitialState: (state) => {
      return { ...initialState };
    },
    // setSelectedCandidateRating:(state,action)=>{
    //   state.selectedCandidateRating=action?.payload;
    // },
    setSelectedCandidateId: (state, action) => {
      state.selectedCandidateId = action.payload;
      console.log("selectedcandidateid", state.selectedCandidateId);
    },
    setIsViewByApplicant: (state, action) => {
      state.isViewByApplicant = action.payload;
    },
    setSelectedJobId: (state, action) => {
      state.selectedJobId = action.payload;
    },
    setSelectedRoundId: (state, action) => {
      state.selectedRoundId = action.payload;
    },

    setSelectedQuestionMap: (state, action) => {
      console.log("asdfasdf asdfasdf asdfasdf", action.payload?.totalQuestionList);
      const updatedList = [];
      action.payload?.totalQuestionList?.forEach((question, index) => {
        const probeQueIdList = [];
        if (question?.isProbeQuestion) {
          question?.probingQuestionsList?.forEach((que, index) => {
            probeQueIdList.push(que?.questionId);
          });
        }
        updatedList.push({ active: action.payload?.isViewByApplicant ? true : false, questionId: question?.questionId, probingQuestionsList: probeQueIdList });
      })
      state.selectedQuestionMap = updatedList;
      // console.log(state.selectedQuestionMap," selectedQuestionMap");
    },
    updateSelectedQuestionMap: (state, action) => {
      state.selectedQuestionMap = action.payload.lst;
      console.log(state.selectedQuestionMap, "questionmap");
    },
    setCandidateResponseMap: (state, action) => {
      const lst = {};
      // console.log("candidateResponseList",candidateResponseList);
      action.payload?.candidateResponseList.forEach((response, index) => {
        action.payload?.selectedQuestionMap.forEach((obj) => {
          if (obj.questionId === response.questionId) {
            lst[response.questionId] = index;
          }
          else {
            obj.probingQuestionsList?.forEach((obj2) => {
              if (obj2 === response.questionId) {
                lst[obj2] = index;
              }

            })
          }
        })

      })
      state.candidateResponseMap = lst;
      console.log("candidate responseMap", state.candidateResponseMap);
    },
    setFilteredResponseMap: (state, action) => {
      state.filteredResponseMap = action.payload;
    },
    setFilteredCandidateResponseList: (state, action) => {
      const lst = []
      action.payload.selectedQuestionMap?.forEach((obj, index) => {
        if (obj.active) {
          const responseIndex = action.payload?.candidateResponseMap[obj.questionId] ?? -1;
          if (responseIndex >= 0) {
            lst.push({
              id: (+index + 1),
              queText: action.payload?.totalQuestionList[index]?.questionText,
              response: action.payload?.candidateResponseList[responseIndex]?.response,
              aiComment: action.payload?.candidateResponseList[responseIndex]?.aiComment,
              answerType: action.payload?.candidateResponseList[responseIndex]?.answerType,
              aiScore: action.payload?.candidateResponseList[responseIndex]?.aiScore,
              competancy: action.payload?.candidateResponseList[responseIndex]?.competancy,
              skillType: action.payload?.candidateResponseList[responseIndex]?.skillType,
              transcription: action.payload?.candidateResponseList[responseIndex]?.transcription,
              cheatingProbability: action.payload?.candidateResponseList[responseIndex]?.cheatingProbability,
              accessorScore: action.payload?.candidateResponseList[responseIndex]?.accessorScore,
              questionId: action.payload?.candidateResponseList[responseIndex]?.questionId,
            });
            if (action.payload?.totalQuestionList[index]?.isProbeQuestion) {

              action.payload?.totalQuestionList[index]?.probingQuestionsList?.forEach((que, pIndex) => {

                const probeQueId = que['questionId'];
                const probeResponseIndex = action.payload?.candidateResponseMap[probeQueId] ?? -1;

                if (probeResponseIndex !== -1) {
                  lst.push({
                    id: (Number(index) + 1) + "P" + (pIndex + 1),
                    queText: que['questionText'],
                    response: action.payload?.candidateResponseList[probeResponseIndex]?.response ?? '',
                    aiComment: action.payload?.candidateResponseList[probeResponseIndex]?.aiComment,
                    aiScore: action.payload?.candidateResponseList[probeResponseIndex]?.aiScore,
                    competancy: action.payload?.candidateResponseList[probeResponseIndex]?.competancy,
                    skillType: action.payload?.candidateResponseList[probeResponseIndex]?.skillType,
                    transcription: action.payload?.candidateResponseList[probeResponseIndex]?.transcription,
                    cheatingProbability: action.payload?.candidateResponseList[probeResponseIndex]?.cheatingProbability,
                    accessorScore: action.payload?.candidateResponseList[probeResponseIndex]?.accessorScore,
                    questionId: action.payload?.candidateResponseList[probeResponseIndex]?.questionId,
                  });
                }
              })
            }
          }
        }
      });
      state.filteredCandidateResponseList = lst;
      console.log("filterecanddiateresponselist", state.filteredCandidateResponseList);
    },
    searchedCandidateList: (state, action) => {
      const { searchTerm, sortOrder } = action.payload;
      const lowerCaseSearchTerm = searchTerm.toLowerCase();

      // Filter candidates based on the search term
      let filteredList = state.candidateList.filter(candidate => {
        const fullName = `${candidate.firstName} ${candidate.lastName}`.toLowerCase();
        return (
          candidate.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
          candidate.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
          fullName.includes(lowerCaseSearchTerm)
        );
      });

      // Sort the filtered list based on aiScore
      if (sortOrder === "ascending_order") {
        filteredList.sort((a, b) => a.aiScore - b.aiScore);
      } else if (sortOrder === "descending_order") {
        filteredList.sort((a, b) => b.aiScore - a.aiScore);
      }

      // Update the display list
      state.displayCandidateWidgetList = filteredList;
    },
    setReportLink: (state, action) => {
      state.reportLink = action?.payload;
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalQuestions.pending, (state) => {
        // state.status = 'loading';
      })
      .addCase(fetchTotalQuestions.fulfilled, (state, action) => {
        // state.status = 'succeeded';
        state.totalQuestionList = action.payload?.questions ?? []; // Update the questionList with fetched data
      })
      .addCase(fetchTotalQuestions.rejected, (state, action) => {
        // state.status = 'failed';
        // state.error = action.payload;
      })

      .addCase(fetchCandidateList.pending, (state) => {
        state.fetchingCandidateList = true;
      })
      .addCase(fetchCandidateList.fulfilled, (state, action) => {
        state.candidateList = action.payload?.list ?? []; // Update the questionList with fetched data
        state.displayCandidateWidgetList = action.payload?.list ?? []; // Update the questionList with fetched data
        state.fetchingCandidateList = false;
      })
      .addCase(fetchCandidateList.rejected, (state, action) => {
        // state.error = action.payload;
        state.fetchingCandidateList = false;
      })
      .addCase(fetchCandidateResponseList.pending, (state) => {
        state.fetchingCandidateResponseList = true;
      })
      .addCase(fetchCandidateResponseList.fulfilled, (state, action) => {
        state.candidateResponseList = action.payload?.candidateResponseList ?? []; // Update the questionList with fetched data
        console.log("candidateResponseList", state.candidateResponseList);
        state.fetchingCandidateResponseList = false;
      })
      .addCase(fetchCandidateResponseList.rejected, (state, action) => {
        // state.error = action.payload;
        state.fetchingCandidateResponseList = false;
      })
      .addCase(fetchSelectedCandidateInfo.pending, (state) => {
      })
      .addCase(fetchSelectedCandidateInfo.fulfilled, (state, action) => {


        const userProfileDTO = action?.payload?.userProfileDTO;
        state.userDetailsInfo = userProfileDTO;
        const currentEmp = userProfileDTO?.workExperience?.filter(workex => workex['currentOrganization'] === true)[0] ?? {};

        state.selectedCandidateInfo = {
          name: userProfileDTO?.firstName + " " + userProfileDTO?.lastName ?? '-',
          higherEducation: userProfileDTO?.higherEducation ?? '-',
          totalExperience: userProfileDTO?.totalExperience ?? '-',
          organizationName: currentEmp?.organizationName ?? '-',
          designation: currentEmp?.designation ?? '-',
          currentCTC: userProfileDTO?.currentCTC ?? '-',
          noticePeriod: userProfileDTO?.noticePeriod ?? '-',
          currentLocation: userProfileDTO?.currentLocation ?? '-',
          username: userProfileDTO?.username ?? '-',
          id: userProfileDTO?.id ?? '-',
        };
      })
      .addCase(fetchSelectedCandidateInfo.rejected, (state, action) => {
        // state.error = action.payload;
      })
      // .addCase(fetchSelectedCandidateRating.pending, (state) => {
      // })
      // .addCase(fetchSelectedCandidateRating.fulfilled, (state, action) => {
      //   state.selectedCandidateRating = action.payload?.candidateScore ?? {};

      // })
      // .addCase(fetchSelectedCandidateRating.rejected, (state, action) => {
      //   // state.error = action.payload;

      // })
      .addCase(fetchCandidateVideoScores.pending, (state) => {
        state.fetchCandidateVideoScores = true;
      })
      .addCase(fetchCandidateVideoScores.fulfilled, (state, action) => {
        state.roundSpecificHashMap = action.payload?.roundSpecificHashMap ?? {};
        state.fetchCandidateVideoScores = false;
      })
      .addCase(fetchCandidateVideoScores.rejected, (state, action) => {
        state.fetchCandidateVideoScores = false;
      })

      .addCase(triggerScoreCalculation.pending, (state) => {
        state.loading = true;
        state.triggerScore = null;
      })
      .addCase(triggerScoreCalculation.fulfilled, (state, action) => {
        state.loading = false;
        state.triggerScore = action.payload ?? {};
      })
      .addCase(triggerScoreCalculation.rejected, (state, action) => {
        state.loading = false;
        state.triggerScore = null;
      })
      // .addMatcher(
      //   (action) => action.type === 'interviewResponsesL1DashboardSlice/setSelectedCandidateId',
      //   (state, action) => {
      //     if (action.payload) {
      //       const candidateId = action.payload;
      //      useDispatch(fetchSelectedCandidateRating(candidateId));
      //     }
      //   }
      // );
      .addCase(fetchReportMetaData.pending, (state) => {
        state.fetchCandidateVideoScores = true;
      })
      .addCase(fetchReportMetaData.fulfilled, (state, action) => {

      })
      .addCase(fetchReportMetaData.rejected, (state, action) => {
        state.fetchCandidateVideoScores = false;
      });



},
});


export const {
  setSelectedCandidateId,
  // setSelectedCandidateRating,
  setSelectedJobId,
  setSelectedRoundId,
  setIsViewByApplicant,
  setSelectedQuestionMap,
  updateSelectedQuestionMap,
  setResponseList,
  setInitialState,
  setFilteredCandidateResponseList,
  setCandidateResponseMap,
  setFilteredResponseMap,
  searchedCandidateList,
  setReportLink,
  userDetailsInfo
} = interviewResponsesL1DashboardSlice.actions;

const interviewResponsesL1DashboardSliceReducer = interviewResponsesL1DashboardSlice.reducer;
export default interviewResponsesL1DashboardSliceReducer;
