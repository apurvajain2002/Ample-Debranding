import { createSlice } from "@reduxjs/toolkit";
import {
  saveJobPosition,
  getAllJob,
  getAllPublishedJob,
  getAllRecruiters,
  getAllInterviewrs,
  deleteJob,
  editJob,
  getJob,
  getPlacementAgencies,
  getCampuses,
  getAllEntities,
} from "../actions/create-job-actions";

const initialState = {
  tableData: [],
  tableDataPublished: [],
  totalItems: 0,
  totalItemsPublished: 0,
  searchValue: "",
  successMessage: null,
  failMessage: null,
  success: false,
  error: false,
  isLoading: false,
  recruiters: [],
  entityId: [],
  currentJobDetails: null,
  isGetJobsApiCalled: false,
  jobId: "",
  roundName: "",
  jobDescrptionFromFile: "",
  entityId: localStorage.getItem("entityId") || "",
  hiringType: "",
  roundsLength:0,
  interviewrs: [],
  organizationsList: [],
  organizationId: '',
};

const createNewJobSlice = createSlice({
  name: "createNewJobSlice",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setTableDataPublished: (state, action) => {
      state.tableDataPublished = action.payload;
    },
    setTotalItemsPublished: (state, action) => {
      state.totalItemsPublished = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    selectJobId: (state, action) => {
      state.jobId = action.payload;
      state.roundName = "";
    },
    selectOrganizationId: (state, action) => {
      state.organizationId = action.payload;
    },
    selectEntity: (state, action) => {
      state.entityId = action.payload;
      localStorage.setItem("entityId", action.payload);
      state.currentJobDetails = null;
    },
    selectHiringType: (state, action) => {
      state.hiringType = action.payload;
    },
    setRoundName: (state, action) => {
      console.log('round name action :: ', action.payload);
      state.roundName = action.payload;
    },
    selectDeleteLocationId: (state, action) => {
      state.deleteLocationId = action.payload;
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
    setAllRecruiters: (state, action) => {
      state.recruiters = action.payload?.list;
    },
    setAllEntities: (state, action) => {
      state.entityId = action.payload?.list;
    },
    setJobDescription: (state, action) => {
      state.jobDescrptionFromFile = action.payload;
    },
    setIsGetJobsApiCalled: (state, action) => {
      state.isGetJobsApiCalled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // create job
      .addCase(saveJobPosition.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(saveJobPosition.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jobId = action.payload?.data?.jobId;
      })
      .addCase(saveJobPosition.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      //Get all job
      .addCase(getAllJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload?.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllJob.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      //Get all published job
      .addCase(getAllPublishedJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPublishedJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableDataPublished = action.payload?.list;
        state.totalItemsPublished = action.payload.recordsTotal;
      })
      .addCase(getAllPublishedJob.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Get Job Id
      .addCase(getJob.pending, (state) => {
        state.isLoading = true;
        state.isGetJobsApiCalled = false;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentJobDetails = action.payload.data;
        state.roundsLength = state.currentJobDetails?.interviewRounds?.length??0;
        state.isGetJobsApiCalled = true;
      })
      .addCase(getJob.rejected, (state, action) => {
        state.isLoading = false;
        state.isGetJobsApiCalled = false;
      })

      //Get All Recruiters
      .addCase(getAllRecruiters.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRecruiters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recruiters = action.payload?.list;
      })
      .addCase(getAllRecruiters.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      //Get All Entity
      .addCase(getAllEntities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEntities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entityId = action.payload?.list;
        state.organizationsList = action.payload?.organizationsList;
      })
      .addCase(getAllEntities.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })


      //Get All Recruiters
      .addCase(getAllInterviewrs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllInterviewrs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewrs = action.payload?.list || [];
      })
      .addCase(getAllInterviewrs.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit  job
      .addCase(editJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editJob.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete  job
      .addCase(deleteJob.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      //  getPlacementAgencies  job
      .addCase(getPlacementAgencies.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlacementAgencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.placementAgencies = action.payload?.list;
      })
      .addCase(getPlacementAgencies.rejected, (state, action) => {
        state.isLoading = false;
      })

      //  get campuses
      .addCase(getCampuses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCampuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campuses = action.payload?.list;
      })
      .addCase(getCampuses.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {
  setTableData,
  setTotalItems,
  setSearchValue,
  searchValue,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setAllRecruiters,
  setAllEntities,
  selectJobId,
  setRoundName,
  setJobDescription,
  selectEntity,
  selectHiringType,
  setIsGetJobsApiCalled,
  selectOrganizationId,
  setSelectedPlacementAgency,
  setSelectedLocation,
} = createNewJobSlice.actions;

const createNewJobSliceReducer = createNewJobSlice.reducer;
export default createNewJobSliceReducer;
