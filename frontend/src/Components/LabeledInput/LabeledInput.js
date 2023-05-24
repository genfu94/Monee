import React from "react";


function LabeledInput(props) {
  const labelStyle = {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "rgb(50, 50, 50)",
    margin: "0.5rem 0px 0.5rem 0px"
  };

  return (
    <div {...props}>
      <div style={labelStyle}>{props.label}</div>
      {props.children}
    </div>
  );
}

export default LabeledInput;