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
      query Login($email:String!, $password:String!) {
        login(email:$email,password:$password){
          userId
          token
          tokenExpiration
        }
      }
      `,
      variables: {
        email: email,
        password: password,
      },
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation createUser($email:String!, $password:String!) {
            createUser(userInput:{email:$email,password:$password}){
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password,
        },
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

      if (responseData.data.login !== undefined) {
        this.context.login(
          responseData.data.login.token,
          responseData.data.login.userId,
          responseData.data.login.tokenExpiration
        );
        localStorage.setItem("token", responseData.data.login.token);
        localStorage.setItem("userId", responseData.data.login.userId);
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
          <input type="email" id="email" ref={this.emailEl} autoComplete="on" />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            ref={this.passwordEl}
            autoComplete="on"
          />
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
