// src/features/auth/authSlice.ts
import { createAppSlice } from '@/app/createAppSlice';
import { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
    accessToken: string | null;
}

export const initialState: AuthState = {
    accessToken: null,
};

export const authSlice = createAppSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string }>,
        ) => {
            state.accessToken = action.payload.accessToken;
        },
        logout: (state) => {
            state.accessToken = null;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
