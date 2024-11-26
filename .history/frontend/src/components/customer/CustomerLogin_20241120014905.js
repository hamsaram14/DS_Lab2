import React, { Component } from "react";
import "./CustomerLogin.css";
import ubereatslogo from "../../Images/UberEatsLogo.png";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice"; // Redux action

class CustomerLogin extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    redirectToHome: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      error: "",
    });
  };

  handleLogin = () => {
    const { email, password } = this.state;
    const { dispatch } = this.props;

    if (!email || !password) {
      this.setState({ error: "Please enter your email and password." });
      return;
    }

    // Mocking the backend response for Redux integration
    setTimeout(() => {
      const mockResponse = {
        token: "mock_jwt_token",
        user: {
          email,
          first_name: "John",
          last_name: "Doe",
        },
      };

      // Dispatch loginSuccess action
      dispatch(
        loginSuccess({
          token: mockResponse.token,
          user: mockResponse.user,
        })
      );

      // Redirect to home
      this.setState({ redirectToHome: true });
    }, 1000); // Simulates network delay
  };

  render() {
    const { email, password, error, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Navigate to="/customer/home" />;
    }

    return (
      <div className="login-container">
        <div className="form-container">
          <img className="logo" alt="Uber Eats Logo" src={ubereatslogo} />
          <h3 className="welcome">Welcome back</h3>
          <label className="label-text">
            Sign in with your email address.
          </label>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleInputChange}
            className="text-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleInputChange}
            className="text-input"
          />
          {error && <div className="error-message">{error}</div>}
          <button onClick={this.handleLogin} className="button">
            LOGIN
          </button>
          <div className="bottomText">
            <p>
              New to Uber?{" "}
              <a className="link" href="/customer/signup">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(CustomerLogin);
