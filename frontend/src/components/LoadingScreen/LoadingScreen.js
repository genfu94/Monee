import React from "react";
import ClipLoader from "react-spinners/ClipLoader";


function renderLoadingPage(content) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content}
      </div>
      <ClipLoader size="2rem" />
    </div>
  );
}

function LoadingScreen({loading, content, children}) {
  if(loading) {
    return renderLoadingPage(content);
  } else {
    return children;
  }
};

export default LoadingScreen;