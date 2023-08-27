import "./App.css";
import Login from "./components/authentication/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Signup from "./components/authentication/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import Project from "./components/projects/Project";
import ProjectList from "./components/projects/ProjectList.jsx";
import {MantineProvider} from "@mantine/core";

function App() {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{colorScheme: "light"}}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" exact element={<Landing />} />
                    <Route path="auth/login" element={<Login />} />
                    <Route path="auth/signup" element={<Signup />} />
                    <Route path="/dashboard/*" element={<Dashboard />} >
                        <Route path="" element={<ProjectList />} />
                        <Route path=":projectId" element={<Project />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </MantineProvider>

    );
}

export default App;
