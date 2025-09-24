import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

// Create role
const createRole = createAsyncThunk(
    "createRole",
    async ({ roleName, roleDescription }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `${baseUrl}/common/base/roles/save`,
                {
                    name: roleName,
                    description: roleDescription,
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

// Delete role
const deleteRole = createAsyncThunk(
    "deleteRole",
    async ({ deleteRoleId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `${baseUrl}/common/base/roles/trash`,
                {
                    id: deleteRoleId,
                }
            );

            if (data.success) {
                return data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            ErrorToast(error.message)
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Edit role
const editRole = createAsyncThunk(
    "editRole",
    async (
        { roleId, newRoleName, newRoleDescription },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await axiosInstance.post(
                `${baseUrl}/common/base/roles/save`,
                {
                    id: roleId,
                    name: newRoleName,
                    description: newRoleDescription,
                }
            );

            if (data.success) {
                return data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            ErrorToast(error.message)
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get all roles
const getAllRoles = createAsyncThunk(
    "getAllRoles",
    async (
        { currentPage, showRows, filterArray, customSortArray},
        { rejectWithValue }
    ) => {
        try {
            const { data } = await axiosInstance.post(
                `${baseUrl}/common/base/roles/get-filtered`,
                {
                    filterList: filterArray || [],
                    sortList: customSortArray || [],
                    pagingNo: currentPage || 1,
                    pageSize: showRows || 0,
                }
            );

            if (data.success) {
                return data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            ErrorToast(error.message)
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get role info
const getRoleInfo = createAsyncThunk(
    "getRoleInfo",
    async ({ roleId }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(
                `${baseUrl}/common/base/roles/get`,
                {
                    id: roleId,
                }
            );

            if (data.success) {
                return data;
            } else {
                return rejectWithValue(data.message);
            }
        } catch (error) {
            ErrorToast(error.message)
            return rejectWithValue(error.response.data.message);
        }
    }
);

export { createRole, deleteRole, editRole, getAllRoles, getRoleInfo };
