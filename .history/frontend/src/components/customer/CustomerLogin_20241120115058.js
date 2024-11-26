import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loginSuccess, selectIsAuthenticated } from "../../redux/slices/authSlice";
import "./CustomerLogin.css";

const CustomerLogin = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated); // Check if user is already logged in
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Simulating backend response
    setTimeout(() => {
      const mockResponse = {
        token: "mock_jwt_token",
        user: {
          email,
          first_name: "John",
          last_name: "Doe",
        },
      };

      // Dispatch loginSuccess action to Redux
      dispatch(
        loginSuccess({
          token: mockResponse.token,
          user: mockResponse.user,
        })
      );
    }, 1000); // Simulating a network delay
  };

  if (isAuthenticated) {
    return <Navigate to="/customer/home" />;
  }

  return (
    <div className="login-container">
      <div className="form-container">
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default CustomerLogin;
