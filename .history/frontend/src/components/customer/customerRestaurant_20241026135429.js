// import React, { Component } from "react";
// import axios from "axios";
// import "./customerRestaurant.css";
// import { Modal, Button } from "react-bootstrap";
// import { useParams } from 'react-router-dom';
// import  withRouter  from '../withRouter.js'
// import NavBar from "../navbar.js";


// class CustomerRestaurant extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       restaurant: null,
//       dishes: [],
//       showModal: false,
//       selectedDish: null,
//       cart: [],
//     };
//   }

//   componentDidMount() {
//     const restaurantId= this.props.params.id;

//     // Fetch restaurant details
//     axios
//       .get(
//         `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/restaurant/${restaurantId}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
//           },
//         }
//       )
//       .then((response) => {
//         if (response.status === 200) {
//           this.setState({ restaurant: response.data });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // Fetch restaurant dishes
//     axios
//       .get(
//         `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/restaurant/${restaurantId}/dishes/`,
//         {
//           headers: {
//             Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
//           },
//         }
//       )
//       .then((response) => {
//         if (response.status === 200) {
//           this.setState({ dishes: response.data });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   handleDishClick = (dish) => {
//     this.setState({ selectedDish: dish, showModal: true });
//   };

//   handleCloseModal = () => {
//     this.setState({ showModal: false, selectedDish: null });
//   };

//   handleAddToCart = () => {
//     console.log("============  this.state ==============", this.state);
//     const { selectedDish, cart } = this.state;
//     this.setState({
//       cart: [...cart, selectedDish],
//       showModal: false,
//       selectedDish: null,
//     });
    
//     console.log("======== Add to cart =======", this.state, "selectedDish", selectedDish);
//   };

//   renderDishes = () => {
//     const { dishes } = this.state;
//     if (dishes.length === 0) {
//       return <div>No dishes available</div>;
//     }

//     return (
//       <div className="dishes-list">
//         {dishes.map((dish) => (
//           <div
//             key={dish.id}
//             className="dish-item"
//             onClick={() => this.handleDishClick(dish)}
//           >
//             <div className="dish-info">
//               <div className="dish-name">{dish.name}</div>
//               <div className="dish-description">{dish.description}</div>
//               <div className="dish-price">${dish.price}</div>
//             </div>
//             {dish.image && (
//               <img src={dish.image} alt={dish.name} className="dish-image" />
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   renderModal = () => {
//     const { showModal, selectedDish } = this.state;
//     if (!selectedDish) return null;

//     return (
//       <Modal show={showModal} onHide={this.handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{selectedDish.name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>{selectedDish.description}</p>
//           <p>Price: ${selectedDish.price}</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={this.handleCloseModal}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={this.handleAddToCart}>
//             Add to Cart
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };

//   render() {
//     const { restaurant } = this.state;
//     if (!restaurant) {
//       return <div>Loading...</div>;
//     }

//     return (
//       <div className="customer-restaurant-container">
//         <NavBar/>

//         <div className="restaurant-header">
//           <img
//             src={restaurant.image_url}
//             alt={restaurant.name}
//             className="restaurant-image"
//           />
//           <div className="restaurant-info">
//             <h2>{restaurant.name}</h2>
//             <p>{restaurant.location}</p>
//           </div>
//         </div>
//         <div className="restaurant-dishes">{this.renderDishes()}</div>
//         {this.renderModal()}
//       </div>
//     );
//   }
// }

// export default withRouter(CustomerRestaurant);


import React, { Component } from "react";
import axios from "axios";
import "./customerRestaurant.css";
import { Modal, Button } from "react-bootstrap";
import withRouter from '../withRouter.js';
import NavBar from "../navbar.js";

class CustomerRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: null,
      dishes: [],
      showModal: false,
      selectedDish: null,
      cart: [],
      showCartModal: false,
    };
  }

  componentDidMount() {
    const restaurantId = this.props.params.id;

    // Fetch restaurant details
    axios
      .get(`${process.env.REACT_APP_UBEREATS_BACKEND_URL}/restaurant/${restaurantId}/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ restaurant: response.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // Fetch restaurant dishes
    axios
      .get(`${process.env.REACT_APP_UBEREATS_BACKEND_URL}/restaurant/${restaurantId}/dishes/`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({ dishes: response.data });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleDishClick = (dish) => {
    this.setState({ selectedDish: dish, showModal: true });
  };

  handleCloseModal = () => {
    this.setState({ showModal: false, selectedDish: null });
  };

  handleAddToCart = () => {
    const { selectedDish } = this.state;

    // Call backend API to add to cart
    axios.post(
      `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/cart/add_to_cart/`,
      {
        dish_id: selectedDish.id,
        quantity: 1, // Assuming a default quantity of 1 for simplicity
      },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      }
    )
    .then((response) => {
      if (response.status === 200) {
        console.log("Item added to cart successfully:", response.data);
        // Optionally update the local cart state here
      }
    })
    .catch((err) => {
      console.error("Failed to add item to cart:", err);
    });

    this.setState({
      showModal: false,
      selectedDish: null,
    });
  };

  handleCartIconClick = () => {
    this.setState({ showCartModal: true });
  };

  handleCloseCartModal = () => {
    this.setState({ showCartModal: false });
  };

  renderDishes = () => {
    const { dishes } = this.state;
    if (dishes.length === 0) {
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
    const { restaurant } = this.state;
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

export default withRouter(CustomerRestaurant);
