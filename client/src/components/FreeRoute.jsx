import React from "react";
import { Navigate } from "react-router-dom";
import IsAuthenticated from "../helper/auth";
// import auth from '../../Helper/auth'

export const FreeRoute = (props) => {
  return !IsAuthenticated() ? (
    <>{props.children}</>
  ) : (
    <Navigate
      to={{
        pathname: "/dashboard",
        state: {
          from: props.location,
        },
      }}
    />
  );
};
