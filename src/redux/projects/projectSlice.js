import { createSlice } from "@reduxjs/toolkit";
import {createProject, getProject, getProjects} from "./projectThunk";

const ProjectInitialState = {
    loading: false,
    projects: [],
};
export const projectSlice = createSlice({
    name: "projectSlice",
    initialState: ProjectInitialState,
    reducers: {resetProject: () => ProjectInitialState},
    extraReducers(builder) {
        builder
            // GET ALL PROJECTS
            .addCase(getProjects.pending, (state) => {
                state.loading = true;
            })
            .addCase(getProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(getProjects.rejected, () => {
                // handle rejected promise
                console.log("GET ALL PROJECTS FAILED")
            })

            // GET PROJECT
            .addCase(getProject.pending, (state) => {state.loading = true;})
            .addCase(getProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.forEach((project, idx) => {
                    if(project._id === action.payload.project._id) {
                        state.projects[idx] = action.payload.project;
                    }
                })
            })
            .addCase(getProject.rejected, () => {
                console.log("GET PROJECT FAILED")
            })

            // CREATE PROJECT
            .addCase(createProject.pending, (state) => {state.loading = true;})
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = [...state.projects, action.payload.project];
            })
            .addCase(createProject.rejected, () => {
                console.log("CREATE PROJECT FAILED")
            });
    },
});

export const {resetProject} = projectSlice.actions;
export default projectSlice.reducer;
