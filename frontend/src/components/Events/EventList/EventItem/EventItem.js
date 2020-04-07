import React from "react";
import "./EventItem.css";

const eventItem = (props) => {
  return (
    <li key={props._id} className="events-list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>19.99</h2>
      </div>
    </li>
  );
};
export default eventItem;
