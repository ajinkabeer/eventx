import React from "react";
import EventItem from "./EventItem/EventItem";
import "./EventList.css";

const eventList = (props) => {
  if (props) {
    const events = props.events.map((event) => {
      return (
        <EventItem
          key={event._id}
          eventId={event._id}
          title={event.title}
          userId={props.authUserId}
          creatorId={event.creator._id}
        />
      );
    });
    return <ul className="event-list">{events}</ul>;
  }
};

export default eventList;
