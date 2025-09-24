import { createSlice } from "@reduxjs/toolkit";
import { getIndustryInfo } from "../actions/industry-actions/industry-actions";
import {
  fetchTemplate,
  fetchTemplateNames,
  fetchWATemplateNames,
  generateLink,
  mapIndex,
  sendInvite,
  generateShortenLink,
  revalidateBulkInvite,
  fetchWATemplate,
  interviewLinkInviteDetails,
} from "../actions/invite-candidates";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  deleteIndustryId: "",
  link: "",
  generatedLinkState: {},
  isLoading: false,
  successMessage: "",
  failMessage: "",
  template: "",
  templateWA: "",
  isTemplate: false,
  isTemplateWA: false,
  templateNames: [],
  templateWANames: [],
  interviewRoundTemplate: false,
  interviewRoundTemplateWA: false,
  customEditLink: "",
  customLinkGenerated: false,
  shortenLink: "",
  shortenLinkTitle: "",
  candidates: {
    validData: [],
    duplicateEmails: [],
    duplicatePhoneNumbers: [],
    InvalidMobileNumbers: [],
    invalidEmails: [],
    headers: [],
    error: "",
  },
  inviteDetailsDTO: {},
  isInterviewLinkInviteDetails: false,
  isInviteCandidateButtonDisable: false,
};

const inviteCandidatesSlice = createSlice({
  name: "inviteCandidatesSlice",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    selectDeleteIndustryId: (state, action) => {
      state.deleteIndustryId = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.getExcelSuccessMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.getExcelFailMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    },
    clearIsTemplate: (state, action) => {
      state.isTemplate = false;
    },
    clearIsTemplateWA: (state, action) => {
      state.isTemplateWA = false;
    },
    clearIsInterviewRoundTemplate: (state, action) => {
      state.interviewRoundTemplate = false;
    },
    clearIsInterviewRoundTemplateWA: (state, action) => {
      state.interviewRoundTemplateWA = false;
    },
    setCustomLinkGenerated: (state, action) => {
      state.customLinkGenerated = action.payload;
    },
    setInterviewLinkInviteDetailsApiCalled: (state, action) => {
      state.isInterviewLinkInviteDetails = action.payload;
    },
    setInviteCandidateButtonDisable: (state, action) => {
      state.isInviteCandidateButtonDisable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get invite link
      .addCase(generateLink.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(generateLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
        state.link = action.payload?.interviewLinkDTO?.shortenLink;
        state.generatedLinkState = action.payload?.interviewLinkDTO;
        state.shortenLink = action.payload?.interviewLinkDTO?.interviewLink;
        state.shortenLinkTitle =
          action.payload?.interviewLinkDTO?.shortenLinkTitle;
        // Handle customEditLink when it comes back in the response
        if (action.payload?.interviewLinkDTO?.customEditLink) {
          state.customEditLink = action.payload.interviewLinkDTO.customEditLink;
        }
      })
      .addCase(generateLink.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
        // Handle customEditLink even when status is false (e.g., "This interview link already exists")
        if (action.payload?.interviewLinkDTO?.customEditLink) {
          state.customEditLink = action.payload.interviewLinkDTO.customEditLink;
        }
        // Also set other link data if available
        if (action.payload?.interviewLinkDTO) {
          state.generatedLinkState = action.payload.interviewLinkDTO;
          state.shortenLink = action.payload.interviewLinkDTO.interviewLink;
          state.shortenLinkTitle = action.payload.interviewLinkDTO.shortenLinkTitle;
        }
      })

      // get shorten link
      .addCase(generateShortenLink.pending, (state) => {
        state.isLoading = true;
        state.customLinkGenerated = false;
      })
      .addCase(generateShortenLink.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
        state.customLinkGenerated = true;
        state.customEditLink = action.payload?.interviewLinkDTO?.customEditLink;
      })
      .addCase(generateShortenLink.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
        state.customLinkGenerated = false;
        // Handle customEditLink even when status is false
        if (action.payload?.interviewLinkDTO?.customEditLink) {
          state.customEditLink = action.payload.interviewLinkDTO.customEditLink;
        }
      })

      // send invite link
      .addCase(sendInvite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendInvite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
        state.link = action.payload?.interviewLinkDTO?.shortenLink;
      })
      .addCase(sendInvite.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
      })

      .addCase(fetchTemplate.pending, (state) => {
        state.isTemplate = false;
        state.template = "";
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.template = action.payload.parsedTemplate;
        state.isTemplate = true;
        state.failMessage = "";
      })
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.failMessage = action.payload?.message || "Failed to load email template";
        state.isTemplate = false;
        state.template = "";
      })

      .addCase(fetchWATemplate.pending, (state) => {
        state.isTemplateWA = false;
        state.templateWA = "";
      })
      .addCase(fetchWATemplate.fulfilled, (state, action) => {
        state.templateWA = action.payload.parsedTemplate;
        state.isTemplateWA = true;
        state.failMessage = "";
      })
      .addCase(fetchWATemplate.rejected, (state, action) => {
        state.failMessage = action.payload?.message || "Failed to load WhatsApp template";
        state.isTemplateWA = false;
        state.templateWA = "";
      })

      .addCase(fetchTemplateNames.pending, (state) => {
        state.interviewRoundTemplate = false;
        state.templateNames = [];
      })
      .addCase(fetchTemplateNames.fulfilled, (state, action) => {
        state.templateNames = action.payload.templateLinkDTO || [];
        state.interviewRoundTemplate = true;
        state.failMessage = "";
      })
      .addCase(fetchTemplateNames.rejected, (state, action) => {
        state.failMessage = action.payload?.message || "Failed to load email template names";
        state.interviewRoundTemplate = false;
        state.templateNames = [];
      })

      .addCase(fetchWATemplateNames.pending, (state) => {
        state.interviewRoundTemplateWA = false;
        state.templateWANames = [];
      })
      .addCase(fetchWATemplateNames.fulfilled, (state, action) => {
        state.templateWANames = action.payload.templateLinkDTO || [];
        state.interviewRoundTemplateWA = true;
        state.failMessage = "";
      })
      .addCase(fetchWATemplateNames.rejected, (state, action) => {
        state.failMessage = action.payload?.message || "Failed to load WhatsApp template names";
        state.interviewRoundTemplateWA = false;
        state.templateWANames = [];
      })

      .addCase(interviewLinkInviteDetails.pending, (state) => {
        state.isLoading = true;
        state.isInviteCandidateButtonDisable = false;
      })
      .addCase(interviewLinkInviteDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
        state.inviteDetailsDTO = action.payload?.inviteDetailsDTO;
        state.isInterviewLinkInviteDetails = true;
        state.isInviteCandidateButtonDisable = true;
      })
      .addCase(interviewLinkInviteDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
        state.isInviteCandidateButtonDisable = false;
      })

      .addCase(mapIndex.pending, (state) => { })
      .addCase(mapIndex.fulfilled, (state, action) => {
        state.candidates.validData = action.payload.response.validData || [];
        state.candidates.InvalidMobileNumbers =
          action.payload.response.invalidMobileNumbers || [];
        state.candidates.duplicateEmails =
          action.payload.response.duplicateEmails || [];
        state.candidates.duplicatePhoneNumbers =
          action.payload.response.duplicatePhoneNumbers || [];
        state.candidates.invalidEmails =
          action.payload.response.invalidEmails || [];
        state.candidates.headers = action.payload.response.headers || [];
      })
      .addCase(mapIndex.rejected, (state, action) => {
        state.candidates.error = action.payload.message;
      })

      .addCase(revalidateBulkInvite.pending, (state) => { })
      .addCase(revalidateBulkInvite.fulfilled, (state, action) => {
        state.candidates.validData = action.payload.response.validData || [];
        state.candidates.InvalidMobileNumbers =
          action.payload.response.invalidMobileNumbers || [];
        state.candidates.duplicateEmails =
          action.payload.response.duplicateEmails || [];
        state.candidates.duplicatePhoneNumbers =
          action.payload.response.duplicatePhoneNumbers || [];
        state.candidates.invalidEmails =
          action.payload.response.invalidEmails || [];
        state.candidates.headers = action.payload.response.headers || [];
      })
      .addCase(revalidateBulkInvite.rejected, (state, action) => {
        state.candidates.error = action.payload.message;
      })

      // Get industry
      .addCase(getIndustryInfo.pending, (state) => { })
      .addCase(getIndustryInfo.fulfilled, (state, action) => { })
      .addCase(getIndustryInfo.rejected, (state, action) => {
        state.failMessage = action.payload;
      });
  },
});

export const {
  selectDeleteIndustryId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  clearIsTemplate,
  clearIsTemplateWA,
  setIsLoading,
  clearIsInterviewRoundTemplate,
  clearIsInterviewRoundTemplateWA,
  setCustomLinkGenerated,
  setInterviewLinkInviteDetailsApiCalled,
  setInviteCandidateButtonDisable,
} = inviteCandidatesSlice.actions;

const inviteCandidatesSliceReducer = inviteCandidatesSlice.reducer;
export default inviteCandidatesSliceReducer;
