handleLogin = () => {
  const { email, password } = this.state;
  const { dispatch } = this.props;

  if (!email || !password) {
    this.setState({ error: "Please enter your email and password." });
    return;
  }

  // Simulating backend response
  setTimeout(() => {
    // Mocked response
    const mockResponse = {
      token: "mock_jwt_token",
      user: {
        email,
        first_name: "John",
        last_name: "Doe",
      },
    };

    // Dispatch Redux action
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
