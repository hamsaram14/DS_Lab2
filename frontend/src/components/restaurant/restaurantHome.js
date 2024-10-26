import React, { Component } from "react";
import "./restaurantHome.css";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-scroll";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import dishIcon from "../../Images/bowl.svg";

class RestaurantHome extends Component {
  state = {
    restaurantDetails: JSON.parse(sessionStorage.getItem("restaurantDetails")),
    redirectToAddDish: false,
    dishes: {},
    redirectToModifyDish: false,
    selectedDishId: null,
  };

  componentDidMount() {
    const restaurantId = this.state.restaurantDetails.id;
    axios
      .get(
        `${process.env.REACT_APP_UBEREATS_BACKEND_URL}/restaurant/get_dishes/${restaurantId}/`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          let dishesByCategory = {};
          response.data.forEach((dish) => {
            if (!dishesByCategory[dish.category]) {
              dishesByCategory[dish.category] = [];
            }
            dishesByCategory[dish.category].push(dish);
          });
          this.setState({ dishes: dishesByCategory });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleAddDish = () => {
    this.setState({ redirectToAddDish: true });
  };

  handleModifyDish = (dishId) => {
    this.setState({ selectedDishId: dishId, redirectToModifyDish: true });
  };

  renderDishes = () => {
    const { dishes } = this.state;
    const categories = Object.keys(dishes);

    return (
      <>
        <div className="row sticky-header">
          <ul className="category-list">
            {categories.map((category) => (
              <li className="category-item" key={category}>
                <Link to={category} spy={true} smooth={false} duration={1000}>
                  <label>{category}</label>
                </Link>
              </li>
            ))}
          </ul>
          <hr className="horizontalRule" />
        </div>

        <div style={{ position: "relative" }}>
          {categories.map((category) => (
            <div className="row category-section" id={category} key={category}>
              <label className="categorySubtxt">{category}</label>

              {dishes[category].map((dish) => (
                <div
                  className="col-md-4 dish-card-container"
                  key={dish.id}
                  onClick={() => this.handleModifyDish(dish.id)}
                >
                  <Card className="dish-card">
                    <CardContent className="dish-card-content">
                      <div className="dish-info">
                        <div className="dish-name">{dish.name}</div>
                        <div className="dish-description">
                          {dish.description}
                        </div>
                      </div>
                      <div className="dish-price">${dish.price}</div>
                    </CardContent>
                    {dish.image && (
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="dish-card-media"
                      />
                    )}
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );
  };

  render() {
    const { redirectToAddDish, redirectToModifyDish, selectedDishId } = this.state;

    if (redirectToAddDish) {
      return <Navigate to="/restaurant/adddish" />;
    }

    if (redirectToModifyDish && selectedDishId) {
      return <Navigate to={`/restaurant/modifydish/${selectedDishId}`} />;
    }

    return (
      <>
        <div>
          <figure className="figureClass">
            <div className="figureDiv">
              <img
                className="imginFig"
                src={this.state.restaurantDetails.image_url}
                alt={this.state.restaurantDetails.name}
              />
            </div>
          </figure>
          <div className="imgBck">
            <div className="imgBckspace"></div>
            <div className="imgtxtContainer">
              <div className="imgtxtCo">
                <div className="imgtxtleftspace"></div>
                <div className="imgtxtleftContainer">
                  <div className="spacer_40"></div>
                  <div>
                    <h2 style={{ color: "white", marginBottom: "50px" }}>
                      {`${this.state.restaurantDetails.name} (${this.state.restaurantDetails.location.split(",")[0]})`}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="imgButtons">
                <button className="priceButton" onClick={this.handleAddDish}>
                  <div className="button-content">
                    <img
                      src={dishIcon}
                      alt="Add Dish"
                      className="dish-icon"
                    />
                    <span>Add Dish</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="content-container">
          <div className="restaurant-address">
            {this.state.restaurantDetails.location}
          </div>
          {this.renderDishes()}
        </div>
      </>
    );
  }
}

export default RestaurantHome;
