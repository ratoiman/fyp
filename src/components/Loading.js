import React from "react";
import { Navigate } from "react-router-dom";

const Loading = () => {
  return (
    <>
      <div><h1>Loading......</h1></div>
      <Navigate to="/" />
    </>
  );
};

export default Loading;
