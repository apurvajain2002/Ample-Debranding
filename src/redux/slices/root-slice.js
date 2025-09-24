import { createSlice } from "@reduxjs/toolkit";
import { getBranding } from "../actions/root-actions";

const initialState = {
  branding: {},
};

const rootSlice = createSlice({
  name: "rootSlice",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getBranding.pending, (state) => {
      })
      .addCase(getBranding.fulfilled, (state, action) => {
        state.branding = action.payload?.organizationBrandingDTO || {};
      })
      .addCase(getBranding.rejected, (state, action) => {
      })
  },
});

export const {

} = rootSlice.actions;

const rootSliceReducer = rootSlice.reducer;
export default rootSliceReducer;