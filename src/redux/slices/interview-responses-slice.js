import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../store/api";

apiSlice.enhanceEndpoints({
	addTagTypes: ["InterviewLanguage"]
});

const initialState = {
	selectedApplicant: "",
}

const interviewResponseSlice = createSlice({
	name: "interviewResponse",
	initialState,
	reducers: {
		selectApplicant: (state, action) => {
			state.selectedApplicant = action.payload;
		}
	}
});

const interviewApi = apiSlice.injectEndpoints({
	endpoints: build => ({
		getInterviewLanguages: build.query({
			query: (params) => ({
				url: '/job-posting/define-interviews/get-language-for-interview',
				method: 'POST',
				body: params
			}),
			transformResponse: (response) => response.interviewLanguageList,
			providesTags: (_1, _2, params) => [{ type: "InterviewLanguage", id: params.interviewId }],
		})
	})
});

export const { useGetInterviewLanguagesQuery } = interviewApi;
export const { selectApplicant } = interviewResponseSlice.actions;

export default interviewResponseSlice.reducer;
