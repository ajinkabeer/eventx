import React from "react";
import { NavLink } from "react-router-dom";
import LoginContext from "../../context/login";
import "./MainNavigation.css";

const mainNavigation = (props) => (
  <LoginContext.Consumer>
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation-logo">
            <h1>EventX</h1>
          </div>
          <nav className="main-navigation-item">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
              )}
              <li>
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </LoginContext.Consumer>
);

export default mainNavigation;
