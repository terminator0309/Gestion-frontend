import { createAsyncThunk } from "@reduxjs/toolkit";
import {client} from "../axiosClient";

export const loginUser = createAsyncThunk("auth/login", async (loginData) => {
    const response = await client.post("user/login", { params: loginData });
    return response.data;
});

export const signupUser = createAsyncThunk("auth/signup", async (signupData) => {
    const response = await client.post("user/signup", { params: signupData });
    return response.data;
});

export const logoutUser = createAsyncThunk("auth/logout", () => {});
