import React, { Component } from "react";
import { connect } from "react-redux";
import { selectAuthUser } from "../../redux/slices/authSlice"; // Import the selector
import "./customerDetails.css";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar"; // Assuming navbar.js is the common navbar component

class CustomerDetails extends Component {
  state = {
    first_name: this.props.user?.first_name || "",
    last_name: this.props.user?.last_name || "",
    email: this.props.user?.email || "",
    phone_number: this.props.user?.phone_number || "",
    avatar: this.props.user?.avatar || "",
    selectedFile: null,
    redirectToHome: false,
    errors: {},
  };

  componentDidMount() {
    if (!this.props.user) {
      // Redirect to login if user is not authenticated
      this.setState({ redirectToHome: true });
    }
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, errors: { ...this.state.errors, [name]: "" } });
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({ selectedFile: file });
  };

  handleProfileUpdate = () => {
    const { first_name, last_name, phone_number, selectedFile } = this.state;

    if (!first_name || !last_name || !phone_number) {
      this.setState({ errors: { form: "Please fill in all required fields." } });
      return;
    }

    const updateData = {
      first_name,
      last_name,
      phone_number,
    };

    const updateProfile = () => {
      axios
        .put(
          `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/customer/profile/update/`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${this.props.user?.token}`, // Use Redux-provided token
            },
          }
        )
        .then((response) => {
          this.setState({ redirectToHome: true });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    if (selectedFile) {
      const formData = new FormData();
      formData.append("avatar", selectedFile);

      axios
        .post(
          `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/customer/upload/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${this.props.user?.token}`, // Use Redux-provided token
            },
          }
        )
        .then((res) => {
          if (res.status === 201) {
            updateData.avatar = res.data.location;
            updateProfile();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      updateProfile();
    }
  };

  render() {
    const { redirectToHome, errors } = this.state;

    if (redirectToHome) {
      return <Navigate to="/customer/home" />;
    }

    return (
      <div className="container">
        <Navbar />
        <div className="formC">
          <div className="innerformC">
            <div className="row" style={{ textAlign: "center" }}>
              <label>
                <h4>Profile Details</h4>
              </label>
            </div>
            <div className="row" style={{ marginLeft: "5%" }}>
              <div className="col-md-6">
                <input
                  className="txtbox marginTop25"
                  name="first_name"
                  value={this.state.first_name}
                  placeholder="First Name"
                  onChange={this.handleInputChange}
                />
                <input
                  className="txtbox marginTop25"
                  name="last_name"
                  value={this.state.last_name}
                  placeholder="Last Name"
                  onChange={this.handleInputChange}
                />
                <input
                  className="txtbox marginTop25"
                  name="email"
                  value={this.state.email}
                  placeholder="Email"
                  disabled
                />
              </div>
              <div className="col-md-6">
                <input
                  className="txtbox marginTop25"
                  name="phone_number"
                  value={this.state.phone_number}
                  placeholder="Phone Number"
                  onChange={this.handleInputChange}
                />
                <label className="custom-file-upload marginTop20">
                  <input
                    type="file"
                    className="uploadbtn"
                    onChange={this.handleFileChange}
                  />
                  Upload Avatar
                </label>
              </div>
              <div className="col-md-12">
                {errors.form && <div className="error-message">{errors.form}</div>}
                <button className="btnn" onClick={this.handleProfileUpdate}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Map state from Redux store to props
const mapStateToProps = (state) => ({
  user: selectAuthUser(state), // Use the selector to get user details
});

export default connect(mapStateToProps)(CustomerDetails);
