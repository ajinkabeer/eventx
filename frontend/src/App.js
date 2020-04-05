import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/login" exact />
        <Route path="/login" component={Login} />
        <Route path="/events" component={Events} />
        <Route path="/bookings" component={Bookings} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
