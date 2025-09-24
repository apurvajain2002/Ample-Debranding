import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	preferredLanguage: "",
	jobId: "",
	interviewId: "",
	tenantId: "0",
	roundName: "",
	forceCameraOn: false
}

const interviewSlice = createSlice({
	name: 'interviewSlice',
	initialState,
	reducers: {
		preferredLanguageChanged: (state, action) => {
			state.preferredLanguage = action.payload;
		},
		dataFromLink: (state, action) => {
			let { interviewId, jobId, roundName, forceCameraOn, tenantId } = action.payload;
			state.interviewId = interviewId;
			state.tenantId = tenantId || "0";
			state.jobId = jobId;
			state.roundName = roundName;
			state.forceCameraOn = forceCameraOn
		},
		clearInterviewSlice : (state, action) => {
			state = initialState;
		}
	}
});

export const { preferredLanguageChanged, dataFromLink, clearInterviewSlice } = interviewSlice.actions;
export default interviewSlice.reducer;
