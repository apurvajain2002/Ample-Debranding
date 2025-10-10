import {createAsyncThunk} from "@reduxjs/toolkit";
import {baseUrl} from "../../../config/config";
import axiosInstance from "../../../interceptors";
import {
  dateFormatter,
  dateFormatterForTimeZone,
} from "../../../utils/dateFormatter";
import {
  setFailMessage,
  setSuccessMessage,
  setAllRecruiters,
  setJobDescription,
  setIsLoading,
  setAllEntities
} from "../../slices/create-new-job-slice";
import ErrorToast from "../../../components/toasts/error-toast";
import {Entity} from "draft-js";
import SuccessToast from "../../../components/toasts/success-toast";

// Create create-job
const saveJobPosition = createAsyncThunk(
  "saveJobPosition",
  async (
    {
      userId,
      positionName,
      jobId,
      recruiters,
      vacancyStartDate,
      vacancyEndDate,
      locations,
      maximumExperience,
      minimumExperience,
      interviewrs,
      noOfPosition,
      openPositions,
      hiringOperations,
      softSkills,
      domainSkills,
      interviewRounds,
      orgId,
      placementAgencies,
      hiringType,
      vacancyApprovalDate,
      vacancyClosureDate,
      jobCreationStatus,
      jobDescription,
      maxCtc,
      minCtc,
      interviewers,
      jobDescriptionMedia,
      isPublished = false,
    },
    {rejectWithValue, dispatch}
  ) => {
    const formData = new FormData();
    if (jobId) formData.append("jobId", jobId || null);
    formData.append("positionName", positionName || null);
    formData.append("userId", userId || null);
    formData.append("positionCounts", noOfPosition || null);
    formData.append("recruiterName", recruiters || null);
    formData.append("vacancyStartDate", dateFormatter(vacancyStartDate) || null);
    if (vacancyApprovalDate)
      formData.append(
        "vacancyApprovalDate",
        dateFormatter(vacancyApprovalDate)
      );
    formData.append("vacancyClosureDate", dateFormatter(vacancyEndDate) || null);
    formData.append("locations", locations);
    formData.append("interviewers", interviewers || []);
    formData.append("interviewRounds", interviewRounds || []);
    formData.append("orgId", orgId);
    formData.append("maximumExperience", maximumExperience || 0);
    formData.append("minimumExperience", minimumExperience || 0);
    formData.append("hiringOperations", hiringOperations || null);
    formData.append("softSkills", softSkills || []);
    formData.append("domainSkills", domainSkills || []);
    formData.append("placementAgencies", placementAgencies || []);
    formData.append("jobCreationStatus", jobCreationStatus || null);
    formData.append("jobOpenStatus", true);
    formData.append("jobDescription", jobDescription || "");
    formData.append("hiringType", hiringType || "");
    formData.append("maxCtc", maxCtc || "");
    formData.append("minCtc", minCtc || "");
    formData.append("isPublished", isPublished || false);
    if (jobDescriptionMedia) {
      formData.append("jobDescriptionMedia", jobDescriptionMedia);
    }

    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/save`,
        formData
      );

      if (data.success) {
        dispatch(setSuccessMessage(data?.message));
        dispatch(
          getAllJob({
            currentPage: 1,
            showRows: 10,
            selectColumn: null,
            sortByOption: null,
            job_status: null,
          })
        );
        return data;
      } else {
        dispatch(setFailMessage(data?.message));
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const saveJobPosition2 = createAsyncThunk(
  "saveJobPosition2",
  async (
    {
      orgId,
      positionName,
      jobId,
      recruiters,
      vacancyStartDate,
      vacancyEndDate,
      locations,
      maximumExperience,
      minimumExperience,
      interviewers,
      positionCounts,
      openPositions,
      hiringOperations,
      softSkills,
      domainSkills,
      interviewRounds,
      placementAgencies,
      hiringType,
      vacancyApprovalDate,
      vacancyClosureDate,
      jobCreationStatus,
      jobDescription,
      maxCtc,
      minCtc,
      jobDescriptionMedia,
      isPublished = false,
    },
    {rejectWithValue, dispatch}
  ) => {
    const formData = new FormData();
    formData.append("positionName", positionName || null);
    formData.append("positionCounts", positionCounts || 0);
    formData.append("recruiterName", recruiters || null);
    formData.append(
      "vacancyStartDate",
      dateFormatterForTimeZone(vacancyStartDate)
    );
    formData.append("vacancyClosureDate", dateFormatter(vacancyClosureDate));
    formData.append("locations", locations);
    openPositions.forEach((position, index) => {
      formData.append(`openPositions[${index}].city`, position.city);
      formData.append(`openPositions[${index}].openings`, position.openings);
    });
    formData.append("jobId", jobId);
    formData.append("orgId", orgId);
    formData.append("maximumExperience", maximumExperience || 0);
    formData.append("minimumExperience", minimumExperience || 0);
    formData.append("interviewers", interviewers || []);
    formData.append("hiringOperations", hiringOperations || null);
    formData.append("softSkills", softSkills || []);
    formData.append("domainSkills", domainSkills || []);
    formData.append("interviewRounds", interviewRounds || []);
    formData.append("placementAgencies", placementAgencies || []);
    formData.append(
      "vacancyApprovalDate",
      dateFormatter(vacancyApprovalDate) || null
    );
    formData.append("jobCreationStatus", jobCreationStatus || null);
    formData.append("jobOpenStatus", true);
    formData.append("jobDescription", jobDescription || "");
    formData.append("hiringType", hiringType || "");
    formData.append("maxCtc", maxCtc || "");
    formData.append("minCtc", minCtc || "");
    if (jobDescriptionMedia) {
      formData.append("jobDescriptionMedia", jobDescriptionMedia);
    }
    formData.append("isPublished", isPublished || false);
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/save`,
        formData
      );

      if (data.success) {
        dispatch(setSuccessMessage(data?.message));
        dispatch(getAllJob());
        dispatch(getAllPublishedJob());
        return data;
      } else {
        dispatch(setFailMessage(data?.message));
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

//Get All Job
const getAllJob = createAsyncThunk(
  "getAllJob",
  async (
    {currentPage, showRows, newFilterArray, customSortArray},
    {rejectWithValue}
  ) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-filtered`,
        {
          filterList: newFilterArray || [],
          sortList: customSortArray || [],
          pagingNo: currentPage || 1,
          pageSize: showRows || 10,
          // userId: userId || null,
        }
      );
      if (data.success) {
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

const getAllPublishedJob = createAsyncThunk(
  "getAllPublishedJob",
  async (
    {id},
    {rejectWithValue}
  ) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-all-published-jobs`,
        {
          userId: id,
        }
      );
      if (data.success) {
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

const getAllEntities = createAsyncThunk(
  "getAllEntities",
  async ({ url }, {rejectWithValue, dispatch}) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/get-entities`, {
          url 
        // userId: userId,
        // userType: userType, //karan changed it brfore 10months
      }
      );

      if (data.success) {
        dispatch(setAllEntities(data));
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

const parseExcel = createAsyncThunk(
  "parseExcel",
  async (file, {rejectWithValue, dispatch}) => {
    const formData = new FormData();
    dispatch(setIsLoading(true));
    formData.append("file", file);
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/bulk-save`,
        formData
      );

      if (data.success) {
        dispatch(getAllJob());
        dispatch(getAllPublishedJob());
        dispatch(setIsLoading(false));
        dispatch(setSuccessMessage(data.message));

        return data;
      } else {
        dispatch(setIsLoading(false));
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      dispatch(setIsLoading(false));
      return rejectWithValue(error.message);
    }
  }
);

// Get job by id
const getJob = createAsyncThunk(
  "getJob",
  async ({jobId}, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get`,
        {
          jobId: jobId,
        }
      );

      if (data.success) {
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

// Get placement
const getPlacementAgencies = createAsyncThunk(
  "getPlacementAgencies",
  async ({orgId}, {rejectWithValue}) => {
    try { 
      const {data} = await axiosInstance.get(
        `${baseUrl}/common/placementAgency/get-placement-agency?orgId=${orgId}`
      );

      if (data.success) {
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

// Get Campuses
const getCampuses = createAsyncThunk(
  "getCampuses",
  async ({orgId}, {rejectWithValue}) => {
    try {
      const {data} = await axiosInstance.get(
        `${baseUrl}/common/campus/get-campus?orgId=${orgId}`
      );

      if (data.success) {
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

// read file
const readFile = createAsyncThunk(
  "readFile",
  async (file, {rejectWithValue, dispatch}) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const {data} = await axiosInstance.post(
        `${baseUrl}/common/base/read-file`,
        formData
      );
      dispatch(setJobDescription(data));
      return data;
    } catch (error) {
      // Toasting the error message should be done at source
      return rejectWithValue(error.message);
    }
  }
);

// Get All recruiters
const getAllRecruiters = createAsyncThunk(
  "getAllRecruiters",
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-recruiters/get-role-users`,
        {
          role: "Recruiter",
        }
      );

      if (data.success) {
        dispatch(setAllRecruiters(data));
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

// Get getAllInterviewrs
const getAllInterviewrs = createAsyncThunk(
  "getAllInterviewrs",
  async (_, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-recruiters/get-role-users`,
        {
          role: "Interviewer",
        }
      );

      if (data.success) {
        dispatch(setAllRecruiters(data));
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

// Edit Job
const editJob = createAsyncThunk(
  "editJob",
  async ({jobId}, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/trash`,
        {
          id: jobId,
        }
      );

      if (data.success) {
        dispatch(setSuccessMessage(data.message));
        dispatch(
          getAllJob({
            currentPage: 1,
            showRows: null,
            selectColumn: null,
            sortByOption: null,
            job_status: null,
          })
        );
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

// Delete Job
const deleteJob = createAsyncThunk(
  "deleteJob",
  async ({jobId}, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/trash`,
        {
          id: jobId,
        }
      );

      if (data.success) {
        dispatch(getAllJob({}));
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

// Save Campus
const saveCampus = createAsyncThunk(
  "saveCampus",
  async (formDetails, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/common/campus/save-campus`,
        formDetails
      );

      if (data.success) {
        dispatch(setSuccessMessage(data.message));
        dispatch(getCampuses());
        return data;
      } else {
        dispatch(setFailMessage(data.message));
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Save Placement agency
const savePlacementAgencies = createAsyncThunk(
  "savePlacementAgencies",
  async (formDetails, {rejectWithValue, dispatch}) => {
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/common/placementAgency/save-placement-agency`,
        formDetails
      );

      if (data.success) {
        dispatch(setSuccessMessage(data.message));
        dispatch(getPlacementAgencies());
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

// Save interviewers
const saveInterviewer = createAsyncThunk(
  "saveInterviewer",
  async (formDetails, {rejectWithValue, dispatch}) => {
    try {
      formDetails["primaryEmailId"] = formDetails["emailAddress"];
      formDetails["mobileNumber1CountryCode"] = formDetails["countryCode"];
      formDetails["mobileNumber1"] = formDetails["mobileNumber"]
      delete formDetails["countryCode"];
      delete formDetails["mobileNumber"];
      delete formDetails["emailAddress"];

      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/job-recruiters/save-interviewers`,
        formDetails
      );

      if (data.success) {
        dispatch(getAllInterviewrs(data));
        dispatch(setSuccessMessage(data.message));
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

const saveInterviewerVoiceNote = createAsyncThunk(
  "saveInterviewerVoiceNote",
  async ({
           jobId,
           userId,
           file,
           roundname,
         }, {rejectWithValue, dispatch}) => {
    const formData = new FormData();
    formData.append("jobId", jobId || null);
    formData.append("userId", userId || null);
    formData.append(roundname, file || null);
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-status/add-note`,
        formData,
      );

      if (data.status) {
        dispatch(setSuccessMessage(data.message));
        SuccessToast(data.message);
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const saveInterviewerTextNote = createAsyncThunk(
  "saveInterviewerTextNote",
  async ({
           jobId,
           userId,
           comment,
           roundname,
         }, {rejectWithValue, dispatch}) => {
    const formData = new FormData();
    formData.append("jobId", jobId || null);
    formData.append("userId", userId || null);
    formData.append(roundname, comment || null);
    try {
      const {data} = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-status/add-note`,
        formData
      );

      if (data.status) {
        dispatch(setSuccessMessage(data.message));
        SuccessToast(data.message);
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
  getAllJob,
  getAllPublishedJob,
  getJob,
  saveJobPosition,
  saveJobPosition2,
  getAllRecruiters,
  getAllEntities,
  editJob,
  deleteJob,
  getPlacementAgencies,
  getCampuses,
  saveCampus,
  savePlacementAgencies,
  getAllInterviewrs,
  parseExcel,
  readFile,
  saveInterviewer,
  saveInterviewerVoiceNote,
  saveInterviewerTextNote,
};
