import React, { Component } from "react";
import LoginContext from "../context/login";
import "./css/login.css";

class Login extends Component {
  state = {
    isLogin: true,
  };

  static contextType = LoginContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = async (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
      query {
        login(email:"${email}",password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput:{email:"${email}",password:"${password}"}){
              _id
              email
            }
          }
        `,
      };
    }

    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      const responseData = await response.json();
      console.log(responseData);

      if (responseData.data.login !== undefined) {
        this.context.login(
          responseData.data.login.token,
          responseData.data.login.userId,
          responseData.data.login.tokenExpiration
        );
      }
    } catch (error) {
      throw error;
    }
  };

  render() {
    return (
      <form className="login-form" onSubmit={this.submitHandler}>
        <h1>Login</h1>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default Login;
