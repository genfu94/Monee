import React from "react";
import {labelStyle} from "./constants.js";

function LabeledInput(props) {
  return (
    <div {...props}>
      <div style={labelStyle}>{props.label}</div>
      {props.children}
    </div>
  );
}

export default LabeledInput;