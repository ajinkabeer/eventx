import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/login" exact />
          <Route path="/login" component={Login} />
          <Route path="/events" component={Events} />
          <Route path="/bookings" component={Bookings} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
