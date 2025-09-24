import { createSlice } from "@reduxjs/toolkit";
import {
  createQuestion,
  getAllQuestions,
  translateQuestion,
  saveShuffleOrder,
  editQuestion,
  editOpeningClosingScriptQuestion,
  saveQuestionsFromPreviousPositions,
  getQuestion,
  deleteQuestion,
  getAllOpeningScriptQuestions,
  getOpeningClosingScriptQuestion,
} from "../actions/create-new-question-actions/create-new-question-actions";

const initialState = {
  newQuestion: {
    questionId: "",
    questionType: "",
    responseType: "",
    competency: "",
    responseTimeInMinutes: "00",
    responseTimeInSeconds: "00",
    originalQuestion: "",
    // In case of mcq, mcr type
    questionOptions: [],

    // In case of l1 round && probe questions
    isProbeQuestion: false,
    probeQuestions: [],

    // In case of not a probe question
    isEnhanced: false,
    enhancedMediaType: "",
    enhancedMedia: "",
    enhancedMediaText: "",
    s3Url: "",

    // is terminating question
    terminateInterview: false,
    questionBankTranslations: [],
  },

  currentQuestionType: "",
  questionData: null,

  // All questions of a job
  jobQuestions: [],

  isAboutCompanySet: false,
  isLoading: false,
  isTranslating: false,
  isLoadingJobQuestions: false,
  successMessage: "",
  failMessage: "",

  isTranslated: false,
};

const createNewQuestionSlice = createSlice({
  name: "createNewQuestionSlice",
  initialState,
  reducers: {
    setNewQuestion(state, action) {
      state.newQuestion = action.payload;
    },
    setJobQuestions(state, action) {
      state.jobQuestions = action.payload;
    },
    setQuestionData(state, action) {
      state.questionData = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.failMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    },
    clearCurrentQuestion: (state, action) => {
      state.newQuestion = initialState.newQuestion;
    },
    setIsTranslated: (state, action) => {
      state.isTranslated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create question
      .addCase(createQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit question
      .addCase(editQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit Opening & Closing script question
      .addCase(editOpeningClosingScriptQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editOpeningClosingScriptQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAboutCompanySet = action.payload.status;
        state.successMessage = action.payload.message;
      })
      .addCase(editOpeningClosingScriptQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete question
      .addCase(deleteQuestion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Translate question
      .addCase(translateQuestion.pending, (state) => {
        state.isTranslating = true;
        state.isTranslated = false;
      })
      .addCase(translateQuestion.fulfilled, (state, action) => {
        state.isTranslating = false;
        state.isTranslated = true;
        // If qid !== null, we are editing, so questions already have a qid and probeid
        if (state.newQuestion.questionId && state.newQuestion.questionBankTranslations) {
          let payloadTranslations = action.payload.questionBankTranslations;
          let localTranslations = state.newQuestion.questionBankTranslations;
          let finalTls = [];
          for (const translation of payloadTranslations) {
            let idx = localTranslations.findIndex(t => t.probeQuestionSequence === translation.probeQuestionSequence && t.language === translation.language);
            if (idx === -1)  {
              finalTls.push(translation)
            } else {
              localTranslations[idx].questionText = translation.questionText;
              finalTls.push(localTranslations[idx])
            }
          }
          state.newQuestion.questionBankTranslations = finalTls;
        } else {
          state.newQuestion.questionBankTranslations =
            action.payload.questionBankTranslations;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(translateQuestion.rejected, (state, action) => {
        state.isTranslating = false;
        state.isTranslated = false;
        state.failMessage = action.payload;
      })

      // Get all questions
      .addCase(getAllQuestions.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.jobQuestions = action.payload?.questions || [];
        if (action.payload?.questions?.length !== 0)
          state.successMessage = action.payload?.message;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage = action.payload;
      })

      // Get all questions
      .addCase(getAllOpeningScriptQuestions.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(getAllOpeningScriptQuestions.fulfilled, (state, action) => {
        state.isLoadingJobQuestions = false;
        const userType = action.payload.userType;
        const scriptType = action.payload.scriptType;
        const questions = [
          ...(action.payload.openingAndClosingScriptDynamicQuestionList || []),
          ...(action.payload.openingClosingScriptDefaultQuestions || []),
        ];
        state.jobQuestions = questions;

        if (userType !== "admin") {
          state.isAboutCompanySet =
            scriptType === "openingScript"
              ? action.payload?.openingClosingScriptDefaultQuestions === null
              : false;
          state.newQuestion = initialState.newQuestion;
        }

        // if (userType === "admin") {
        //   state.jobQuestions = questions;
        // } else {
        //   // const openingScriptAboutCompanyQuestionId = 3;
        //   // const editableForRecruiter =
        //   //   scriptType === "openingScript"
        //   //     ? questions.filter(
        //   //         (q) => q.questionId === openingScriptAboutCompanyQuestionId
        //   //       )
        //   //     : questions;
        //   state.jobQuestions = questions;
        // }
      })
      .addCase(getAllOpeningScriptQuestions.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage =
          action.payload?.message || "Couldn't get Opening scripts!";
      })

      // Get all questions
      .addCase(saveShuffleOrder.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(saveShuffleOrder.fulfilled, (state, action) => {
        state.isLoadingJobQuestions = false;
      })
      .addCase(saveShuffleOrder.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage = action.payload;
      })

      // Get question
      .addCase(getQuestion.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(getQuestion.fulfilled, (state, action) => {
        state.isLoadingJobQuestions = false;

        if (action.payload.questions.length <= 1) {
          state.questionData = action.payload.questions[0];
          return;
        }

        // Handle the probing questions
        if (!action.payload.questions[0].isProbeQuestion) return;

        const rootQuestion = action.payload.questions[0];
        rootQuestion.probeQuestions = [];
        rootQuestion.questionBankTranslations = JSON.parse(
          rootQuestion.questionBankTranslations
        );
        const remaining = action.payload.questions.slice(1);

        remaining.forEach((question) => {
          rootQuestion.probeQuestions.push(question);
          const translations = JSON.parse(question.questionBankTranslations);
          rootQuestion.questionBankTranslations.push(...translations);
        });

        console.log(rootQuestion.questionBankTranslations);
        rootQuestion.questionBankTranslations = JSON.stringify(
          rootQuestion.questionBankTranslations
        );

        state.questionData = rootQuestion;
      })
      .addCase(getQuestion.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage = action.payload;
      })

      // Get question
      .addCase(getOpeningClosingScriptQuestion.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(getOpeningClosingScriptQuestion.fulfilled, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.questionData = action.payload.questions[0];
      })
      .addCase(getOpeningClosingScriptQuestion.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage = action.payload;
      })

      // Save question from previous postions
      .addCase(saveQuestionsFromPreviousPositions.pending, (state) => {
        state.isLoadingJobQuestions = true;
      })
      .addCase(
        saveQuestionsFromPreviousPositions.fulfilled,
        (state, action) => {
          state.isLoadingJobQuestions = false;
        }
      )
      .addCase(saveQuestionsFromPreviousPositions.rejected, (state, action) => {
        state.isLoadingJobQuestions = false;
        state.failMessage = action.payload;
      });
  },
});

export const {
  setNewQuestion,
  setJobQuestions,
  setQuestionData,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  clearCurrentQuestion,
  setIsTranslated,
} = createNewQuestionSlice.actions;

const createNewQuestionSliceReducer = createNewQuestionSlice.reducer;
export default createNewQuestionSliceReducer;
