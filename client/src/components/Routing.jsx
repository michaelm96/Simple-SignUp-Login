import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { FreeRoute } from "./FreeRoute";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ResetPassword from "../pages/resetPassword/ResetPassword";
import Profile from "../pages/profile/Profile";
import Page404 from "../pages/404/page404";
import IsAuthenticated from "../helper/auth";
import Redirect from "../pages/redirect/Redirect";
import Resend from "../pages/resend/Resend";

export default function Routing(props) {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={
            IsAuthenticated(props) ? (
              <Navigate
                to={{
                  pathname: "/dashboard",
                  state: {
                    from: props.location,
                  },
                }}
              />
            ) : (
              <Navigate
                to={{
                  pathname: "/login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
          }
        />

        <Route path="/login" exact element={
            <FreeRoute>
              <Login />
            </FreeRoute>
          }
        />
        <Route path="/register" exact element={
            <FreeRoute>
              <Register />
            </FreeRoute>
          }
        />
        <Route path="/dashboard" exact element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/profile" exact element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/resetPassword" exact element={
            <ProtectedRoute>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route path="/redirect/:hash" exact element={
            <Redirect/>
          }
        />
        <Route path="/resend/:email" exact element={
            <Resend/>
          }
        />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}
