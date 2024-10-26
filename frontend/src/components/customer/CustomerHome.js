import React, { Component } from "react";
import Navbar from "../navbar"; // Assuming navbar.js is the common navbar component
import CustomerFooter from "../footer/customerFooter"; // Importing customer-specific footer
import "./CustomerHome.css";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Radio, Space } from "antd";
import deals from "../../Images/deals.png";
import RestaurantCard from "../restaurant/restaurantCard";

class CustomerHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveryType: "",
      restaurants: [],
      redirectToRestaurant: false,
      selectedRestaurantId: null,
    };
  }

  componentDidMount() {
    this.fetchRestaurants();
  }

  fetchRestaurants = () => {
    const { deliveryType } = this.state;
    let url = `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/customer/restaurants/`;
    if (deliveryType) {
      url += `?deliveryType=${deliveryType}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ restaurants: response.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDeliveryTypeChange = (e) => {
    this.setState({ deliveryType: e.target.value }, () => {
      this.fetchRestaurants();
    });
  };

  redirectToRestaurant = (restaurantId) => {
    this.setState({
      selectedRestaurantId: restaurantId,
      redirectToRestaurant: true,
    });
  };

  renderRestaurants = () => {
    const { restaurants } = this.state;
    return (
      <div className="row restaurant-list">
        {restaurants.map((restaurant) => (
          <RestaurantCard
            profilePicture={restaurant.profile_picture}
            key={restaurant.id}
            name={restaurant.name}
            onClick={() => this.redirectToRestaurant(restaurant.id)}
          />
        ))}
      </div>
    );
  };

  renderCategoryImages = () => {
    const categories = [
      { imgSrc: deals, label: "Deals" },
      // Add other categories here
    ];

    return (
      <div className="category-images">
        {categories.map((category, index) => (
          <div className="category-item" key={index}>
            <img src={category.imgSrc} alt={category.label} />
            <label>{category.label}</label>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { redirectToRestaurant, selectedRestaurantId } = this.state;

    if (redirectToRestaurant && selectedRestaurantId) {
      return <Navigate to={`/customer/restaurant/${selectedRestaurantId}`} />;
    }

    return (
      <div className="customer-home-container">
        <Navbar />
        {this.renderCategoryImages()}
        <div className="container-fluid main-content">
          <div className="row">
            <div className="col-md-3 filters">
              <div className="filter-section">
                <h4>Delivery Type</h4>
                <Radio.Group
                  onChange={this.handleDeliveryTypeChange}
                  value={this.state.deliveryType}
                >
                  <Space direction="vertical">
                    <Radio value="">All</Radio>
                    <Radio value="Delivery">Delivery</Radio>
                    <Radio value="Pickup">Pickup</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="col-md-9">{this.renderRestaurants()}</div>
          </div>
        </div>
        <CustomerFooter />
      </div>
    );
  }
}

export default CustomerHome;
