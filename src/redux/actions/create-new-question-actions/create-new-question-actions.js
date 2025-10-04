import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";
import SuccessToast from "../../../components/toasts/success-toast";
import Cookies from "js-cookie";

// Function to convert base64 to file
const base64toFile = (base64Data) => {
  // Add a check for null or invalid input
  if (!base64Data || typeof base64Data !== 'string') {
    console.error("Invalid base64Data input:", base64Data);
    throw new Error("Invalid base64Data provided for conversion.");
  }

  // Updated regex to correctly capture the MIME type, which can contain dots and hyphens.
  // We're capturing everything between 'data:' and ';base64,'.
  const matches = base64Data.match(/^data:([^;]+);base64,(.*)$/);

  if (!matches || matches.length < 3) { // Expecting at least 3 elements: full match, mimeType, data
    console.error("base64Data does not match expected data URL format:", base64Data);
    throw new Error("Invalid data URL format. Cannot extract MIME type or data.");
  }

  const mimeType = matches[1]; // This will now correctly capture "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  const data = matches[2];

  // Determine a more appropriate filename extension
  let extension = 'bin'; // Default fallback
  if (mimeType.includes('/')) {
    extension = mimeType.split('/')[1];
    // Handle specific complex MIME types for better extensions
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extension = 'docx';
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      extension = 'xlsx';
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
      extension = 'pptx';
    }
    // You might want to strip any suffixes like "+xml" if present (e.g., image/svg+xml -> svg)
    if (extension.includes('+')) {
      extension = extension.split('+')[0];
    }
  }

  // You might want to make the filename more unique or descriptive
  const filename = `uploaded_file.${extension}`;

  // Convert the base64 data to a file object
  let byteCharacters;
  try {
    byteCharacters = atob(data);
  } catch (e) {
    console.error("Error decoding base64 string:", e);
    throw new Error("Failed to decode base64 string. It might be invalid.");
  }

  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new File([byteArray], filename, { type: mimeType });
};

// Create question
const createQuestion = createAsyncThunk(
  "createQuestion",
  async ({ jobId, roundName, newQuestion }, { rejectWithValue }) => {
    console.log('createQuestion thunk started with:', { jobId, roundName, newQuestion });
    // debugger;
    let enhancedMedia = "";
    console.log('newQuestion', newQuestion)
    console.log('newQuestion.enhancedMedia', newQuestion?.enhancedMedia, typeof newQuestion?.enhancedMedia)
    if (newQuestion?.enhancedMedia) {
      try {
        enhancedMedia = base64toFile(newQuestion.enhancedMedia);
        console.log('enhancedMedia conversion successful:', enhancedMedia); // This will log if successful
      } catch (error) {
        console.error('Error during base64toFile conversion:', error);
        // You might want to rejectWithValue here or handle the error gracefully
        return rejectWithValue(`Failed to convert enhanced media: ${error.message}`);
      }
    }
    console.log('enhancedMedia after potential conversion:', enhancedMedia); // Check value here
    console.log('enhancedMedia', enhancedMedia)
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("interviewRound", roundName);
    formData.append("questionType", newQuestion.questionType);
    formData.append("responseType", newQuestion.responseType);
    formData.append("competancy", newQuestion.competency);
    formData.append(
      "responseTimeInMinutes",
      Number(newQuestion.responseTimeInMinutes)
    );
    formData.append(
      "responseTimeInSeconds",
      Number(newQuestion.responseTimeInSeconds)
    );
    formData.append("questionText", newQuestion.originalQuestion);
    formData.append(
      "questionOptions",
      JSON.stringify(newQuestion.questionOptions)
    );
    formData.append("isEnhanced", newQuestion.isEnhanced);
    formData.append(
      "enhancedQuestionFormatType",
      newQuestion.enhancedMediaType
    );
    if (enhancedMedia) formData.append("enhancedMedia", enhancedMedia);
    formData.append("enhancedMediaText", newQuestion.enhancedMediaText);
    formData.append("isProbeQuestion", newQuestion.isProbeQuestion);
    formData.append(
      "probingQuestions",
      JSON.stringify(JSON.parse(JSON.stringify(newQuestion.probeQuestions)))
    );
    formData.append(
      "questionBankTranslations",
      JSON.stringify(newQuestion.questionBankTranslations)
    );
    formData.append("terminateInterview", newQuestion.terminateInterview);
    console.log('FormData prepared:', Object.fromEntries(formData));
    try {
      console.log('Making API call to save question...');
      console.log('Token check:', {
        token: localStorage.getItem("e_access_token") || Cookies.get("e_access_token"),
        headers: axiosInstance.defaults.headers
      });
      console.log('axiosInstance config:', {
        baseURL: axiosInstance.defaults.baseURL,
        headers: axiosInstance.defaults.headers,
        url: `${baseUrl}/job-posting/interview-question/save`
      });

      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/save`,
        formData,
        {
          headers: { "Content-type": "multipart/form-data" },
        }
      );
      console.log('API response:', data);

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      console.log('Error in createQuestion:', error);
      console.log('Error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      const message =
        error?.status === 413 ? "Media size exceeds limit" : error.message;
      ErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Create question
const createOpeningScriptQuestion = createAsyncThunk(
  "createOpeningScriptQuestion",
  async ({ jobId, roundName, newQuestion }, { rejectWithValue }) => {
    // to be continued -> console.log("createOpeningScriptQuestion", newQuestion);
    let enhancedMedia = "";
    if (newQuestion.enhancedMedia)
      enhancedMedia = base64toFile(newQuestion.enhancedMedia);

    const formData = new FormData();
    formData.append("interviewId", "");
    formData.append("jobId", jobId);
    formData.append("roundName", roundName);
    formData.append("questionId", "");
    formData.append("questionText", "");
    formData.append("nextQuestionIfYes", "");
    formData.append("nextQuestionIfNo", "");
    formData.append("termination", false);
    formData.append("terminationText", "");
    formData.append("questionVideoLink", "");
    formData.append("questionType", "mcq");
    formData.append("terminationTextVideoLink", "");
    formData.append("yesText", "");
    if (enhancedMedia) formData.append("enhancedMedia", enhancedMedia);
    formData.append("noText", "No");
    formData.append("scriptType", "opening_script");

    // to be continued -> console.log(newQuestion, formData);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/opening-script-questions/save`,
        formData,
        {
          headers: { "Content-type": "multipart/form-data" },
        }
      );

      if (data.status || data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Edit question
const editQuestion = createAsyncThunk(
  "editQuestion",
  async ({ jobId, roundName, newQuestion }, { rejectWithValue }) => {
    let enhancedMedia = "";
    if (newQuestion.enhancedMedia)
      enhancedMedia = base64toFile(newQuestion.enhancedMedia);
    const formData = new FormData();
    if (newQuestion?.s3Url) {
      formData.append("s3url", newQuestion.s3Url || '');
    }
    formData.append("questionId", newQuestion.questionId);
    formData.append("jobId", jobId);
    formData.append("interviewRound", roundName);
    formData.append("questionType", newQuestion.questionType);
    formData.append("responseType", newQuestion.responseType);
    formData.append(
      "competancy",
      newQuestion.competency ? newQuestion.competency : ""
    );
    formData.append(
      "responseTimeInMinutes",
      newQuestion.responseTimeInMinutes ? newQuestion.responseTimeInMinutes : 0
    );
    formData.append(
      "responseTimeInSeconds",
      newQuestion.responseTimeInSeconds ? newQuestion.responseTimeInSeconds : 0
    );
    formData.append("questionText", newQuestion.originalQuestion);
    formData.append(
      "questionOptions",
      JSON.stringify(newQuestion.questionOptions)
    );
    formData.append("isEnhanced", newQuestion.isEnhanced);
    formData.append(
      "enhancedQuestionFormatType",
      newQuestion.enhancedMediaType
    );
    if (enhancedMedia) {
      formData.append("enhancedMedia", enhancedMedia);
    }
    formData.append("enhancedMediaText", newQuestion.enhancedMediaText);
    formData.append("isProbeQuestion", newQuestion.isProbeQuestion);
    formData.append(
      "probingQuestions",
      JSON.stringify(JSON.parse(JSON.stringify(newQuestion.probeQuestions)))
    );
    formData.append(
      "questionBankTranslations",
      JSON.stringify(newQuestion.questionBankTranslations)
    );
    formData.append("terminateInterview", newQuestion.terminateInterview);

    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/update`,
        formData,
        {
          headers: { "Content-type": "multipart/form-data" },
        }
      );

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      const message =
        error?.status === 413 ? "Media size exceeds limit" : error.message;
      ErrorToast(message);
      return rejectWithValue(message);
    }
  }
);

// Edit question
const editOpeningClosingScriptQuestion = createAsyncThunk(
  "editOpeningClosingScriptQuestion",
  async (
    { newQuestion, entityId, interviewRound, jobId, hiringType, userType },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/opening-closing-script/save-questions`,
        {
          questionId: newQuestion.questionId,
          questionText: newQuestion.questionText,
          scriptType: newQuestion.scriptType === "opening_script" ? "openingScript" : newQuestion.scriptType,
          entityId: entityId,
          interviewRound: interviewRound,
          jobId: jobId,
          hiringType: hiringType,
          questionBankTranslations: newQuestion.questionBankTranslations,
          userType: userType,


        }
      );

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Delete question
const deleteQuestion = createAsyncThunk(
  "deleteQuestion",
  async ({ queId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/moveToTrash`,
        {
          id: queId,
        }
      );

      if (data.status) {
        SuccessToast(data.message);
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Get transaltions
const translateQuestion = createAsyncThunk(
  "translateQuestion",
  async ({ jobId, roundName, newQuestion }, { rejectWithValue }) => {
    let queText = '';
    if (newQuestion?.scriptType === "opening_script") {
      queText = newQuestion.questionText;
    } else {
      queText = newQuestion.originalQuestion;
    }
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/get-translations`,
        {
          jobId: jobId,
          interviewRound: roundName,
          questionText: queText,
          questionOptions: JSON.stringify(newQuestion.questionOptions),
          isProbeQuestion: newQuestion.isProbeQuestion,
          probingQuestions: newQuestion?.probeQuestions?.length
            ? JSON.stringify(newQuestion.probeQuestions)
            : "",
        }
      );

      if (data.status) {
        data.isProbeQuestion = newQuestion.isProbeQuestion;
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Get all question form a job and round
const getAllQuestions = createAsyncThunk(
  "getAllQuestions",
  async ({ jobId, roundName }, { rejectWithValue }) => {
    if (!jobId || !roundName) return;
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/get-all`,
        {
          jobId: jobId,
          interviewRound: roundName,
        }
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Get all question form a job and round
const getAllOpeningScriptQuestions = createAsyncThunk(
  "getAllOpeningScriptQuestions",
  async (
    {
      scriptType,
      jobId,
      interviewRound,
      entityId,
      hiringType,
      userType,
      // responseType,
    },
    { rejectWithValue }
  ) => {
    if (!scriptType) return;
    
    // Add validation for userType
    if (!userType) {
      console.warn('userType is not provided to getAllOpeningScriptQuestions action');
      return rejectWithValue('User type is required');
    }
    
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/opening-closing-script/get-all`,
        {
          scriptType: scriptType,
          jobId: jobId,
          interviewRound: interviewRound,
          entityId: entityId,
          hiringType: hiringType,
          userType: "recruiter",
          // ...(responseType && { responseType: responseType }),
        }
      );
      if (data.status || data.success) {
        return { ...data, userType: userType, scriptType: scriptType };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Get Question
const getQuestion = createAsyncThunk(
  "getQuestion",
  async ({ queId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/get-question`,
        {
          id: queId,
        }
      );

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);
// Get Opening and Closing script Question
const getOpeningClosingScriptQuestion = createAsyncThunk(
  "getOpeningClosingScriptQuestion",
  async ({ queId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/opening-sclosing-question/get-question`,
        {
          id: queId,
        }
      );

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const saveShuffleOrder = createAsyncThunk(
  "saveShuffleOrder",
  async ({ jobId, roundName, shuffleQuesList }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/shuffle-questions`,
        {
          jobId: jobId,
          interviewRound: roundName,
          shuffleQuesList: shuffleQuesList,
        }
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const saveQuestionsFromPreviousPositions = createAsyncThunk(
  "saveQuestionsFromPreviousPositions",
  async ({ jobId, roundName, quesArray = [] }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/questions-from-previous-positions`,
          [
              {
              jobId: jobId,
              interviewRound: roundName,
              shuffleQuesList: quesArray,
          }
      ]
      );

      if (data.status) {
          SuccessToast(data.message);
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);

      return rejectWithValue(error.message);
    }
  }
);

export {
  createQuestion,
  editQuestion,
  deleteQuestion,
  translateQuestion,
  getAllQuestions,
  getQuestion,
  saveShuffleOrder,
  saveQuestionsFromPreviousPositions,
  createOpeningScriptQuestion,
  getAllOpeningScriptQuestions,
  getOpeningClosingScriptQuestion,
  editOpeningClosingScriptQuestion,
};
