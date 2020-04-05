import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/login" exact />
        <Route path="/login" component={AuthPage} />
        <Route path="/events" component={null} />
        <Route path="/bookings" component={null} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
