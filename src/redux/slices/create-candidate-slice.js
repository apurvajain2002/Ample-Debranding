import { createSlice } from "@reduxjs/toolkit";
import { saveCandidate } from "../actions/create-candidate";


const initialState = {
  isCandidateSaved: false,
  saveCandidateResponse: null,
};

const createCandidateSlice = createSlice({
  name: "createCandidateSlice",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder

      // create job
      .addCase(saveCandidate.pending, (state) => {
        state.isCandidateSaved = false;
      })
      .addCase(saveCandidate.fulfilled, (state, action) => {
        state.isCandidateSaved = true;
        state.saveCandidateResponse = action.payload;
        console.log('save response :::: ', action.payload);
      })
      .addCase(saveCandidate.rejected, (state, action) => {
        state.isCandidateSaved = false;
      })
  },
});

export const {

} = createCandidateSlice.actions;

const createCandidateSliceReducer = createCandidateSlice.reducer;
export default createCandidateSliceReducer;