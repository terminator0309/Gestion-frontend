import { createSlice } from "@reduxjs/toolkit";
import { deleteTokenFromLocalStorage, setTokenToLocalStorage } from "../../utils/token";
import { loginUser, logoutUser, signupUser } from "./authThunks";

const AuthInitialState = {
    loading: false,
    user: {},
    isLoggedIn: false,
};
export const authSlice = createSlice({
    name: "authSlice",
    initialState: {...AuthInitialState},
    reducers: {resetAuth: authenticationReset},
    extraReducers(builder) {
        builder
            // LOGIN
            .addCase(loginUser.pending, authenticationPending)
            .addCase(loginUser.fulfilled, authenticationFulfilled)
            .addCase(loginUser.rejected, authenticationFailed)

            // SIGNUP
            .addCase(signupUser.pending, authenticationPending)
            .addCase(signupUser.fulfilled, authenticationFulfilled)
            .addCase(signupUser.rejected, authenticationFailed)

            // LOGOUT
            .addCase(logoutUser.pending, authenticationPending)
            .addCase(logoutUser.fulfilled, authenticationReset);
    },
});

export const {resetAuth} = authSlice.actions;
export default authSlice.reducer;

function authenticationPending(state) {
    state.loading = true;
}

function authenticationFulfilled(state, action) {
    state.loading = false;
    state.isLoggedIn = true;
    state.user = {
        username: action.payload.username,
        email: action.payload.email,
    };

    setTokenToLocalStorage(action.payload.token);
}

function authenticationReset(state) {
    state.isLoggedIn = false;
    state.isLoading = false;
    state.user = {};

    deleteTokenFromLocalStorage();
}

function authenticationFailed() {
    // handle failed login or signup attempt
    console.log("AUTH FAILED")
}
