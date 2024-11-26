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
          <Modal.Title>{selectedDish.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedDish.description}</p>
          <p>Price: ${selectedDish.price}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={this.handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  renderCartModal = () => {
    const { showCartModal, cart } = this.state;
    return (
      <Modal show={showCartModal} onHide={this.handleCloseCartModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {cart.length === 0 ? (
            <div>Your cart is empty</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div>{item.name} (x{item.quantity})</div>
                <div>${item.price * item.quantity}</div>
              </div>
            ))
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleCloseCartModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  render() {
    const { restaurant } = this.props;
    if (!restaurant) {
      return <div>Loading...</div>;
    }

    return (
      <div className="customer-restaurant-container">
        <NavBar />
        <div className="restaurant-header">
          <img src={restaurant.image_url} alt={restaurant.name} className="restaurant-image" />
          <div className="restaurant-info">
            <h2>{restaurant.name}</h2>
            <p>{restaurant.location}</p>
          </div>
        </div>
        <div className="restaurant-dishes">{this.renderDishes()}</div>
        {this.renderModal()}
        {this.renderCartModal()}
      </div>
    );
  }
}

// Map Redux state to props
const mapStateToProps = (state, ownProps) => {
  const restaurantId = ownProps.params.id;
  const restaurants = selectRestaurants(state); // Fetch restaurants from Redux
  const restaurant = restaurants.find((rest) => rest.id === parseInt(restaurantId));
  return { restaurant };
};

export default withRouter(connect(mapStateToProps)(CustomerRestaurant));
