import Logout from "../authentication/Logout";
import { useDispatch, useSelector } from "react-redux";
import { getTokenFromLocalStorage } from "../../utils/token";
import {Navigate, Outlet} from "react-router-dom";
import { logoutUser } from "../../redux/authentication/authThunks";
import {useState} from "react";
import {DashboardLayout} from "./DashboardLayout.jsx";
import {useDisclosure} from "@mantine/hooks";
import {Button, createStyles, Input, Text} from "@mantine/core";

/* create project form/page
    - project name
    - project Description
    - github link
    - deadline
    - team members (invite)
    
    project list
    - project name
    - project des
    - team member profile pic
    - github link if given
*/

const useStyles = createStyles(() => ({
    innerHeader: {
        height: "100%",
        width: "100%",
        backgroundColor: "red",
        display: "flex",
        alignItems: "center"
    }
}))
function Dashboard() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.authSlice.isLoggedIn);
    const [selectedProject, selectProject] = useState({});
    console.log("dashboard loaded")
    const {classes} = useStyles();
    // TEST

    if (!loggedIn || !getTokenFromLocalStorage().isPresent) {
        dispatch(logoutUser());
        return <Navigate to="/auth/login" />;
    }

    return (
        <Outlet context={{selectedProject, selectProject}}/>
    );
}

export default Dashboard;
