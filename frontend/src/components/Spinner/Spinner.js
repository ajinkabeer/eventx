import React from "react";
import "./Spinner.css";

const spinner = () => (
  <div className="container">
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default spinner;
