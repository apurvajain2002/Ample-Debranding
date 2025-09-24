import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../interceptors/axiosBaseQuery";
import { baseUrl } from "../../config/config";

export const apiSlice = createApi({
	reducerPath: 'evuemeApi',
	baseQuery: axiosBaseQuery({ baseUrl }),
	endpoints: () => ({})
});
