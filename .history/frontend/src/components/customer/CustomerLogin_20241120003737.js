import React, { Component } from "react";
import "./CustomerLogin.css";
import ubereatslogo from "../../Images/UberEatsLogo.png";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice"; // Import the Redux action

class CustomerLogin extends Component {
  state = {
    email: "",
    password: "",
    error: "",
    redirectToHome: false,
  };

  componentDidMount() {
    // Check if the user is logged in via Redux state
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      window.location.href = "/customer/home";
    }
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleLogin = () => {
    const { email, password } = this.state;
    const { dispatch } = this.props; // Access the Redux dispatch function

    axios
      .post(`${process.env.REACT_APP_UBEREATS_BACKEND_URL}/customer/login/`, {
        email,
        password,
      })
      .then((response) => {
        // Dispatch the login success action to store the token and user info
        dispatch(
          loginSuccess({
            token: response.data.token,
            user: { email }, // Add more user details if needed
          })
        );

        // Fetch customer details
        axios
          .get(`${process.env.REACT_APP_UBEREATS_BACKEND_URL}/customer/profile/`, {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          })
          .then((res) => {
            // Optionally, store customer details in Redux or update the UI as needed
            this.setState({ redirectToHome: true });
          })
          .catch(() => {
            this.setState({ error: "Failed to fetch customer details" });
          });
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.error || "Invalid email or password";
        this.setState({ error: errorMsg });
      });
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
            <p className="display--inline">
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

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated, // Map auth state to props
});

export default connect(mapStateToProps)(CustomerLogin);
