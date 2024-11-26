import React, { Component } from "react";
import { connect } from "react-redux";
import { selectRestaurants } from "../../redux/slices/restaurantSlice"; // Import selector
import "./customerRestaurant.css";
import { Modal, Button } from "react-bootstrap";
import withRouter from "../withRouter.js";
import NavBar from "../navbar.js";

class CustomerRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDish: null,
      cart: [],
      showModal: false,
      showCartModal: false,
    };
  }

  handleDishClick = (dish) => {
    this.setState({ selectedDish: dish, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedDish: null });
  };

  handleAddToCart = () => {
    const { selectedDish } = this.state;

    // Simulate adding to cart
    this.setState((prevState) => ({
      cart: [...prevState.cart, { ...selectedDish, quantity: 1 }],
      showModal: false,
      selectedDish: null,
    }));
  };

  handleCartIconClick = () => {
    this.setState({ showCartModal: true });
  };

  handleCloseCartModal = () => {
    this.setState({ showCartModal: false });
  };

  renderDishes = () => {
    const { dishes } = this.props.restaurant;
    if (!dishes || dishes.length === 0) {
      return <div>No dishes available</div>;
    }

    return (
      <div className="dishes-list">
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-item" onClick={() => this.handleDishClick(dish)}>
            <div className="dish-info">
              <div className="dish-name">{dish.name}</div>
              <div className="dish-description">{dish.description}</div>
              <div className="dish-price">${dish.price}</div>
            </div>
            {dish.image && <img src={dish.image} alt={dish.name} className="dish-image" />}
          </div>
        ))}
      </div>
    );
  };

  renderModal = () => {
    const { showModal, selectedDish } = this.state;
    if (!selectedDish) return null;

    return (
      <Modal show={showModal} onHide={this.handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
