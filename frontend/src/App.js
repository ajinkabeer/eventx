import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Bookings from "./pages/Bookings";
import Events from "./pages/Events";
import MainNavigation from "./components/Navigation/MainNavigation";
import LoginContext from "./context/login";

import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
  };

  login = (token, userId) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <BrowserRouter>
        <LoginContext.Provider
          value={{
            token: this.state.token,
            userId: this.state.userId,
            login: this.login,
            logout: this.logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {!this.state.token && (
                <Redirect from="/bookings" to="/login" exact />
              )}
              {this.state.token && <Redirect from="/" to="/events" exact />}
              {this.state.token && (
                <Redirect from="/login" to="/events" exact />
              )}

              {!this.state.token && <Route path="/login" component={Login} />}
              <Route path="/events" component={Events} />
              {this.state.token && (
                <Route path="/bookings" component={Bookings} />
              )}
              {!this.state.token && <Redirect to="/login" exact />}
            </Switch>
          </main>
        </LoginContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
