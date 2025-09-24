import { createSlice } from "@reduxjs/toolkit";
import {
  getCountries,
  getState,
  getCity,
  getAllLocations,
  saveLocation,
  deleteLocation,
  editLocation,
  getCityAll,
} from "../actions/location-actions/location-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  countries: [],
  deleteLocationId: "",
  states: [],
  cities: [],
  address: "",
  successMessage: null,
  failMessage: null,
  success: false,
  error: false,
  isLoading: false,
  locationId: "",
};

const manageLocations = createSlice({
  name: "manageLocations",
  initialState,
  reducers: {
    setDeleteLocationId: (state, action) => {
      state.deleteLocationId = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setState: (state, action) => {},
    setCity: (state, action) => {},
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTableButtonActionsSuccessMessage: (state, action) => {
      state.tableButtonAction = action.paysSuccessMessageload;
    },
    setTableButtonActionsFailMessage: (state, action) => {
      state.tableButtonActionsFailMessage = action.payload;
    },
    setMessagesEmpty: (state) => {
      state.successMessage = "";
      state.failMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCountries.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCountries.fulfilled, (state, action) => {
        state.success = true;
        state.countries = action.payload.list;
        state.isLoading = false;
      })
      .addCase(getCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = "ERROR" || action.payload.message;
      })

      .addCase(getState.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getState.fulfilled, (state, action) => {
        state.success = true;
        state.states = action.payload.list;
        state.isLoading = false;
      })
      .addCase(getState.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = "ERROR" || action.payload.message;
      })

      .addCase(getCity.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.success = true;
        state.cities = action.payload.list;
        state.isLoading = false;
      })
      .addCase(getCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = "ERROR" || action.payload.message;
      })
      .addCase(getCityAll.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getCityAll.fulfilled, (state, action) => {
        state.success = true;
        state.cities = action.payload.list;
        state.isLoading = false;
      })
      .addCase(getCityAll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = "ERROR" || action.payload.message;
      })

      .addCase(getAllLocations.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(getAllLocations.fulfilled, (state, action) => {
        state.tableData = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllLocations.rejected, (state, action) => {
        state.error = true;
        state.failMessage = "ERROR" || action.payload.message;
        state.isLoading = false;
      })
      .addCase(deleteLocation.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.successMessage = action.payload;
      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(saveLocation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(saveLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.successMessage = action.payload.message;
      })
      .addCase(saveLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = action.payload.message;
      })
      .addCase(editLocation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.successMessage = action.payload.message;
      })
      .addCase(editLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.failMessage = action.payload.message;
      });
  },
});

export const {
  setDeleteLocationId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setIsLoading,
  setTableButtonActionsSuccessMessage,
  setTableButtonActionsFailMessage,
  setMessagesEmpty,
} = manageLocations.actions;
const manageLocationsSliceReducer = manageLocations.reducer;
export default manageLocationsSliceReducer;
