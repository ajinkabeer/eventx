import React, { Component } from "react";
import LoginContext from "../context/login";
import { toast } from "react-toastify";
import "./css/login.css";

class Login extends Component {
  state = {
    isLogin: true,
    emailInvalid: false,
    passwordInvalid: false,
    email: "",
    password: "",
  };

  static contextType = LoginContext;

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = async (event) => {
    const { email, password } = this.state;
    event.preventDefault();

    if (email.trim().length === 0 || password.trim().length === 0) {
      this.setState({ emailInvalid: true, passwordInvalid: true });
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
        if (email.trim().length !== 0 || password.trim().length !== 0) {
          toast.info("User exists");
        }
      }
      const responseData = await response.json();
      if (!this.state.isLogin && !responseData.errors) {
        toast.success("User created 🚀");
      }
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
      return;
    }
  };

  emailChangeHandler = (e) => {
    const email = e.target.value;
    this.setState({ email });
    if (email.trim().length === 0) {
      this.setState({ emailInvalid: true });
    }
  };

  passwordChangeHandler = (e) => {
    const password = e.target.value;
    this.setState({ password });
    if (password.trim().length === 0) {
      this.setState({ passwordInvalid: true });
    }
  };

  render() {
    return (
      <form className="login-form" onSubmit={this.submitHandler}>
        <h1>Login</h1>

        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            className={this.state.emailInvalid ? "invalid" : ""}
            type="email"
            id="email"
            autoComplete="on"
            value={this.state.email}
            onChange={(e) => this.emailChangeHandler(e)}
          />
          <label
            className={this.state.emailInvalid ? "error" : "no-error"}
            htmlFor="error"
          >
            Invalid e-mail
          </label>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            className={this.state.passwordInvalid ? "invalid" : ""}
            type="password"
            id="password"
            autoComplete="on"
            value={this.state.password}
            onChange={(e) => this.passwordChangeHandler(e)}
          />
          <label
            className={this.state.passwordInvalid ? "error" : "no-error"}
            htmlFor="error"
          >
            Invalid Email
          </label>
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
