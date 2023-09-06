import { createAsyncThunk } from "@reduxjs/toolkit";
import {client, getAuthHeader} from "../axiosClient";

export const getProjects = createAsyncThunk("project/getProjects", async () => {
    console.log("Calling get Projects")
    const response = await client.get("project/getall", { headers: getAuthHeader()});
    return response.data;
});

export const getProject = createAsyncThunk("project/getProject", async (projectId) => {
    const response = await client.get("project/getProject", {headers: getAuthHeader(),params: { projectId }})
    return response.data;
})

export const createProject = createAsyncThunk("project/createProject", async (project) => {
    const response = await client.post("project/create", {},{headers: getAuthHeader(), params: {...project}});
    return response.data;
})

export const postComment = createAsyncThunk("project/postComment", async (comment) => {
    const response = await client.post("card/postComment", {...comment}, {headers: getAuthHeader()});
    return {card: response.data, projectId: comment.projectId};
})