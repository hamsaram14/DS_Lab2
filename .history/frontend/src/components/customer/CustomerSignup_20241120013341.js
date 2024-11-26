handleSignup = () => {
  const { first_name, last_name, email, password, phone_number } = this.state;
  const { dispatch } = this.props; // Redux dispatch function

  if (!first_name || !last_name || !email || !password || !phone_number) {
    this.setState({ signupError: "Please fill in all required fields." });
    return;
  }

  // Simulating backend response
  setTimeout(() => {
    // Mocked response
    const mockResponse = {
      token: "mock_jwt_token",
      user: {
        first_name,
        last_name,
        email,
      },
    };

    // Dispatch Redux action
    dispatch(
      loginSuccess({
        token: mockResponse.token,
        user: mockResponse.user,
      })
    );

    // Redirect to home after signup
    this.setState({ redirectToHome: true });
  }, 1000); // Simulates network delay
};
