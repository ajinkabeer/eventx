import React from "react";
import "./BookingsControl.css";

const bookingsControl = (props) => {
  console.log(props);
  return (
    <div className="bookings-control">
      <button
        className={props.activeContentType === "Booking" ? "active" : ""}
        onClick={() => props.onChange("Booking")}
      >
        Booking
      </button>
      <button
        className={props.activeContentType === "Chart" ? "active" : ""}
        onClick={() => props.onChange("Chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default bookingsControl;
