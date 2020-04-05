import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const mainNavigation = (props) => (
  <header className="main-navigation">
    <div className="main-navigation-logo">
      <h1>EventX</h1>
    </div>
    <nav className="main-navigation-item">
      <ul>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
        <li>
          <NavLink to="/events">Events</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
