import React from "react";
import "./EventItem.css";

const eventItem = (props) => {
  return (
    <li key={props._id} className="events-list-item">
      <div>
        <h1>{props.title}</h1>
        <h2>€ {props.price}</h2>
        <h2> {new Date(props.date).toLocaleDateString()}</h2>
        <p>{props.descriptions}</p>
      </div>
      <div>
        {props.userId === props.creatorId ? (
          <p>You're the owner of this event</p>
        ) : (
          <button
            className="btn"
            onClick={props.onDetail.bind(this, props.eventId)}
          >
            View details
          </button>
        )}
      </div>
    </li>
  );
};
export default eventItem;
