import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {resetAuth} from "../../redux/authentication/authSlice.js";
import {resetProject} from "../../redux/projects/projectSlice.js";

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const LogoutUser = () => {
        dispatch(resetAuth());
        dispatch(resetProject());
        navigate("/");
    };
    return <button onClick={LogoutUser}>Logout</button>;
}

export default Logout;
