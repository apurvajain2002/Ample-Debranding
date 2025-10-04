import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

export const getAllLocations = createAsyncThunk(
  "getAllLocations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `${baseUrl}/common/location/get-all`,
        {}
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const saveLocation = createAsyncThunk(
  "saveLocation",
  async (
    { countryName, cityName, address, stateName },
    { rejectWithValue }
  ) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/location/save`,
        {
          countryName,
          cityName,
          stateName,
          address,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const editLocation = createAsyncThunk(
  "editLocation",
  async (
    { countryName, cityName, address, stateName },
    { rejectWithValue }
  ) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/location/save`,
        {
          countryName,
          cityName,
          stateName,
          address,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLocation = createAsyncThunk(
  "deleteLocation",
  async ({ deleteLocationId }, { rejectWithValue }) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/location/trash`,
        {
          id: deleteLocationId,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const getCountries = createAsyncThunk(
  "getCountries",
  async (_, { rejectWithValue }) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.get(
        `${baseUrl}/common/country/get-all`,
        {
          // name: industryName,
          // description: industryDescription,
        }
      );
      if (data.success) {
        const result = data.list.map((val) => {
          return {
            optionValue: val.id,
            optionKey: val.name,
          };
        });
        return { list: result };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const getState = createAsyncThunk(
  "getState",
  async ({ country_id }, { rejectWithValue }) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/state/get-states`,
        {
          country_id: country_id,
        }
      );
      if (data.success) {
        const result = data?.list?.map((val) => {
          return {
            optionValue: val.id,
            optionKey: val.name,
          };
        });
        return { list: result };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

export const getCity = createAsyncThunk(
  "getCity",
  async (value, { rejectWithValue }) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/city/get-city`,
        {
          state_id: value,
        }
      );
      if (data.success) {
        const result = data?.list?.map((val) => {
          return {
            optionValue: val.id,
            optionKey: val.name,
          };
        });
        return { list: result };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);


export const getCityAll = createAsyncThunk(
  "getCityAll",
  async (_, { rejectWithValue }) => {
    try {
      // Todo: API update
    
      const { data } = await axiosInstance.get(
        `${baseUrl}/common/city/get-all`);
      if (data.success) {
        const result = data.list.map((val) => {
          return {
            optionValue: `${val.name}`,
            optionKey: `${val.name}`,
          };
        });
        return { list: result };
        // return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

