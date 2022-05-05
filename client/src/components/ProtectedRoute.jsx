import React from "react";
import { Navigate } from "react-router-dom";
import IsAuthenticated from "../helper/auth";

export const ProtectedRoute = (props) => {
  return IsAuthenticated() ? (
    <>{props.children}</>
  ) : (
    <Navigate
      to={{
        pathname: "/login",
        state: {
          from: props.location,
        },
      }}
    />
  );
};
