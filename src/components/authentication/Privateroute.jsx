import React from "react";
import { useSelector } from "react-redux";
import { getTokenFromLocalStorage } from "../../utils/token";
import { Route, redirect } from "react-router-dom";

function Privateroute({ element: RouteComponent, ...restProps }) {
    const user = useSelector((state) => state.authReducer.user);
    const token = getTokenFromLocalStorage();

    function isAuthenticated(user, token) {
        return !!user && Object.keys(user).length > 0 && token.isPresent;
    }

    return (
        <Route
            {...restProps}
            render={(renderProps) =>
                isAuthenticated(user, token) ? <RouteComponent {...renderProps} /> : redirect("/auth/login")
            }
        />
    );
}

export default Privateroute;
