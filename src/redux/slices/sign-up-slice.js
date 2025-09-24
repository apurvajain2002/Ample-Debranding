import { createSlice } from "@reduxjs/toolkit";
import { getEntity } from "../actions/sign-up-actions";

const initialState = {
  entityInfo: [],
  captcha: [],
  successMessage: "",
  failMessage: "",
  entityName: "",
};

const signUp = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setEntity: (state, action) => {
      state.entityInfo = action.payload.organizationDTO;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.failMessage = action.payload;
    },
    setCaptcha: (state, action) => {
      state.captcha = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all softSkills
      .addCase(getEntity.pending, (state) => {})
      .addCase(getEntity.fulfilled, (state, action) => {
        state.entityName = action.payload.organizationDTO.businessName;
      })
      .addCase(getEntity.rejected, (state, action) => {});
  },
});

export const { setEntity, setSuccessMessage, setFailMessage, setCaptcha } =
  signUp.actions;

const signUpReducer = signUp.reducer;
export default signUpReducer;
