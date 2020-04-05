import React, { Component } from "react";
import "./Login.css";
class Auth extends Component {
  render() {
    return (
      <form class="login-form">
        <div className="form-control">
          <label for="email">Email</label>
          <input type="email" id="email" />
        </div>
        <div className="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" />
        </div>
        <div className="form-actions">
          <button type="submit">Login</button>
          <button type="button">SignUp</button>
        </div>
      </form>
    );
  }
}

export default Auth;
