import React, { Component } from "react";
import "./CustomerSignup.css";
import ubereatslogo from "../../Images/UberEatsLogo.png";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice"; // Redux action

class CustomerSignup extends Component {
  state = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone_number: "",
    signupError: "",
    redirectToHome: false,
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      signupError: "",
    });
  };

  handleSignup = () => {
    const { first_name, last_name, email, password, phone_number } = this.state;
    const { dispatch } = this.props; // Redux dispatch function

    if (!first_name || !last_name || !email || !password || !phone_number) {
      this.setState({ signupError: "Please fill in all required fields." });
      return;
    }

    // Mocking the backend response for Redux integration
    setTimeout(() => {
      const mockResponse = {
        token: "jwt_token",
        user: {
          first_name,
          last_name,
          email,
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
    const { redirectToHome, signupError } = this.state;

    if (redirectToHome) {
      return <Navigate to="/customer/home" />;
    }

    return (
      <div className="signup-container">
        <div className="formContainer">
          <img className="logo" src={ubereatslogo} alt="Uber Eats Logo" />
          <h3 className="welcome">Create your customer account</h3>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            className="textinput"
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            className="textinput"
            onChange={this.handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="textinput"
            onChange={this.handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="textinput"
            onChange={this.handleInputChange}
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            className="textinput"
            onChange={this.handleInputChange}
          />
          {signupError && <div className="error-message">{signupError}</div>}
          <button className="button" onClick={this.handleSignup}>
            Sign Up
          </button>
          <div className="bottomText">
            <p>
              Already have an account?{" "}
              <a className="link" href="/customer/login">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(CustomerSignup);
