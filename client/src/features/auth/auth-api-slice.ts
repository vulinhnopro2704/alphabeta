import { RootState } from "@/app/store";
import { BACKEND_URL } from "@/const/url";
import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "./auth-slice";
import { toast } from "sonner";

export interface User {
	username: string;
	email: string;
	fullname: string;
	dateofbirth: string;
	gender: string;
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface SignupRequest extends User {
	password: string;
	confirmPassword: string;
}

export interface LoginResponse {
	status: number;
	message: string;
	data: {
		access_token: string;
		refresh_token: string;
		token_type: string;
		expires_in: number;
	};
}

export interface SignupResponse {
	status: number;
	message: string;
	data: null;
}

export interface RefreshResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

// Base fetch: thêm access token vào header nếu có
export const baseQuery = fetchBaseQuery({
	baseUrl: BACKEND_URL, // Thay đổi URL theo server của bạn
	credentials: "include", // Để gửi kèm HttpOnly cookie (refresh token)
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.accessToken;
		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

// Base query với logic refresh khi gặp lỗi 401 (Access Token hết hạn)
export const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	// Nếu gặp lỗi 401, thử gọi endpoint auth/refresh
	if (result.error && result.error.status === 401) {
		// Gọi endpoint refresh; trình duyệt tự động gửi HttpOnly cookie chứa refresh token
		const refreshResult = await baseQuery(
			{ url: "auth/refresh", method: "POST" },
			api,
			extraOptions
		);

		if (refreshResult.data) {
			const data = refreshResult.data as RefreshResponse;
			// Cập nhật access token trong Redux state (lưu tạm trong memory)
			api.dispatch(setCredentials({ accessToken: data.access_token }));
			// Retry lại request ban đầu với access token mới
			result = await baseQuery(args, api, extraOptions);
		} else {
			// Nếu refresh thất bại, thực hiện logout
			api.dispatch(logout());
		}
	}

	return result;
};

export const authApiSlice = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth, // Sử dụng baseQueryWithReauth thay vì baseQuery
	endpoints: (build) => ({
		login: build.mutation<LoginResponse, LoginRequest>({
			query: (body) => ({
				url: "/auth/login",
				method: "POST",
				body,
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(
						setCredentials({
							accessToken: data.data.access_token,
						})
					);
				} catch (error) {
					toast.error("Đăng nhập thất bại");
					console.error(error);
				}
			},
		}),
		signUp: build.mutation<SignupResponse, SignupRequest>({
			query: (body) => ({
				url: "/auth/signup",
				method: "POST",
				body,
			}),
		}),
		refresh: build.mutation<RefreshResponse, void>({
			query: () => ({
				url: "/auth/refresh",
				method: "POST",
			}),
		}),
		logout: build.mutation<void, void>({
			query: () => ({ url: "/auth/logout", method: "POST" }),
		}),
	}),
});

export const {
	useLoginMutation,
	useSignUpMutation,
	useRefreshMutation,
	useLogoutMutation,
} = authApiSlice;
