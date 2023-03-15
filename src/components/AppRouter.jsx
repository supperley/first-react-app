import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Posts from "../pages/Posts";
import About from "../pages/About";
import Error from "../pages/Error";
import PostIdPage from "../pages/PostIdPage";
import { publicRoutes, privateRoutes } from "../router/routes";
import { AuthContext } from "../context";
import Loader from "./UI/Loader/Loader";

const AppRouter = () => {
    const {isAuth, isLoading} = useContext(AuthContext);
    
    if (isLoading) {
        return <Loader></Loader>
    }

    return (
        isAuth ?
        <Routes>
            {privateRoutes.map((route) => (
                <Route
                    path={route.path}
                    element={route.component}
                    key={route.path}
                />
            ))}
            <Route path="/error" element={<Error />} />
            <Route path="/*" element={<Navigate to="/posts" replace />} />
        </Routes> : <Routes>
            {publicRoutes.map((route) => (
                <Route
                    path={route.path}
                    element={route.component}
                    key={route.path}
                />
            ))}
            <Route path="/error" element={<Error />} />
            <Route path="/*" element={<Navigate to="/login" replace />} />
        </Routes> 
    );
};

export default AppRouter;
