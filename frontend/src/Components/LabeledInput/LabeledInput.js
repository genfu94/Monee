import React from "react";


function LabeledInput(props) {
  const labelStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "rgb(50, 50, 50)",
    margin: "7px 0px 7px 0px"
  };

  return (
    <div {...props}>
      <div style={labelStyle}>{props.label}</div>
      {props.children}
    </div>
  );
}

export default LabeledInput;