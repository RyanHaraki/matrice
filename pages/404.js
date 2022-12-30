import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-full">
      404 ERROR: This page does not exist. Click{" "}
      <a className="text-blue-400 underline mx-1" href="/">
        here
      </a>{" "}
      to return home!
    </div>
  );
};

export default ErrorPage;
