// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// // import dotenv from "dotenv";
// import "./navbar.css";
// // import ubereatslogo from "../../Images/UberEatsLogo.png";
// // import UberEatsLogo from "../../Images/UberEatsLogo.png";


// // dotenv.config();

// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAuthenticated: false,
//       userType: "", // 'customer' or 'restaurant'
//     };
//   }

//   componentDidMount() {
//     // Check if the user is logged in by verifying the token in session storage
//     const token = sessionStorage.getItem("authToken"); // Updated key
//     const userType = sessionStorage.getItem("userType");
//     console.log("token", token, "userType", userType);
//     if (token && userType) {
//       this.setState({ isAuthenticated: true, userType });
//     }
//   }

//   handleLogout = () => {
//     sessionStorage.clear();
//     this.setState({ isAuthenticated: false, userType: "" });
//   };

//   render() {
//     const { isAuthenticated, userType } = this.state;
//     return (
//       <nav className="navbar">
//         <div className="navbar-container">
//           {/* <Link to="/" className="navbar-logo">
//             <img src={UberEatsLogo} alt="Uber Eats Logo" />
//           </Link> */}
//           <ul className="nav-menu">
//             {isAuthenticated ? (
//               <>
//                 {userType === "customer" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/customer/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 {userType === "restaurant" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/restaurant/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 <li className="nav-item">
//                   <button className="nav-links logout-button" onClick={this.handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link to="/customer/login" className="nav-links">
//                     Customer Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link to="/restaurant/login" className="nav-links">
//                     Restaurant Login
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </nav>
//     );
//   }
// }

// export default NavBar;

// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { FaShoppingCart } from "react-icons/fa"; // Importing cart icon
// import "./navbar.css";

// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAuthenticated: false,
//       userType: "", // 'customer' or 'restaurant'
//     };
//   }

//   componentDidMount() {
//     // Check if the user is logged in by verifying the token in session storage
//     const token = sessionStorage.getItem("authToken"); // Updated key
//     const userType = sessionStorage.getItem("userType");
//     console.log("token", token, "userType", userType);
//     if (token && userType) {
//       this.setState({ isAuthenticated: true, userType });
//     }
//   }

//   handleLogout = () => {
//     sessionStorage.clear();
//     this.setState({ isAuthenticated: false, userType: "" });
//   };

//   handleCartIconClick = () => {
//     if (this.props.onCartIconClick) {
//       this.props.onCartIconClick();
//     }
//   };

//   render() {
//     const { isAuthenticated, userType } = this.state;
//     const { cartItemCount } = this.props; // Receiving the cart item count via props
//     return (
//       <nav className="navbar">
//         <div className="navbar-container">
//           <ul className="nav-menu">
//             {isAuthenticated ? (
//               <>
//                 {userType === "customer" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/customer/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                     <li className="nav-item cart-icon">
//                         <Link to="/customer/cart" className="nav-links">
//                            Cart
//                         </Link>
//                     </li>
//                   </>
//                 )}
//                 {userType === "restaurant" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/restaurant/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 <li className="nav-item">
//                   <button className="nav-links logout-button" onClick={this.handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link to="/customer/login" className="nav-links">
//                     Customer Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link to="/restaurant/login" className="nav-links">
//                     Restaurant Login
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </nav>
//     );
//   }
// }

// export default NavBar;


// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import { FaShoppingCart } from "react-icons/fa"; // Importing cart icon
// import "./navbar.css";

// class NavBar extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAuthenticated: false,
//       userType: "", // 'customer' or 'restaurant'
//     };
//   }

//   componentDidMount() {
//     // Check if the user is logged in by verifying the token in session storage
//     const token = sessionStorage.getItem("authToken"); // Updated key
//     const userType = sessionStorage.getItem("userType");
//     console.log("token", token, "userType", userType);
//     if (token && userType) {
//       this.setState({ isAuthenticated: true, userType });
//     }
//   }

//   handleLogout = () => {
//     sessionStorage.clear();
//     this.setState({ isAuthenticated: false, userType: "" });
//   };

//   handleCartIconClick = () => {
//     if (this.props.onCartIconClick) {
//       this.props.onCartIconClick();
//     }
//   };

//   render() {
//     const { isAuthenticated, userType } = this.state;
//     const { cartItemCount } = this.props; // Receiving the cart item count via props
//     return (
//       <nav className="navbar">
//         <div className="navbar-container">
//           <ul className="nav-menu">
//             {isAuthenticated ? (
//               <>
//                 {userType === "customer" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/customer/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/customer/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                     <li className="nav-item cart-icon" onClick={this.handleCartIconClick}>
//                       <FaShoppingCart size={25} />
//                       {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
//                     </li>
//                   </>
//                 )}
//                 {userType === "restaurant" && (
//                   <>
//                     <li className="nav-item">
//                       <Link to="/restaurant/home" className="nav-links">
//                         Home
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/orders" className="nav-links">
//                         Orders
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link to="/restaurant/account" className="nav-links">
//                         Account
//                       </Link>
//                     </li>
//                   </>
//                 )}
//                 <li className="nav-item">
//                   <button className="nav-links logout-button" onClick={this.handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link to="/customer/login" className="nav-links">
//                     Customer Login
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link to="/restaurant/login" className="nav-links">
//                     Restaurant Login
//                   </Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </nav>
//     );
//   }
// }

// export default NavBar;


import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Importing cart icon
import "./navbar.css";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      userType: "", // 'customer' or 'restaurant'
    };
  }

  componentDidMount() {
    // Check if the user is logged in by verifying the token in session storage
    const token = sessionStorage.getItem("authToken"); // Updated key
    const userType = sessionStorage.getItem("userType");
    console.log("token", token, "userType", userType);
    if (token && userType) {
      this.setState({ isAuthenticated: true, userType });
    }
  }

  handleLogout = () => {
    sessionStorage.clear();
    this.setState({ isAuthenticated: false, userType: "" });
  };

  handleCartIconClick = () => {
    if (this.props.onCartIconClick) {
      this.props.onCartIconClick();
    }
  };

  render() {
    const { isAuthenticated, userType } = this.state;
    const { cartItemCount } = this.props; // Receiving the cart item count via props
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <ul className="nav-menu">
            {isAuthenticated ? (
              <>
                {userType === "customer" && (
                  <>
                    <li className="nav-item">
                      <Link to="/customer/home" className="nav-links">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/customer/orders" className="nav-links">
                        Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/customer/account" className="nav-links">
                        Account
                      </Link>
                    </li>
                    <li className="nav-item cart-icon">
                      <Link to="/customer/cart" className="nav-links" onClick={this.handleCartIconClick}>
                        <FaShoppingCart />
                        {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                      </Link>
                    </li>
                  </>
                )}
                {userType === "restaurant" && (
                  <>
                    <li className="nav-item">
                      <Link to="/restaurant/home" className="nav-links">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/restaurant/orders" className="nav-links">
                        Orders
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/restaurant/account" className="nav-links">
                        Account
                      </Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="nav-links logout-button" onClick={this.handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/customer/login" className="nav-links">
                    Customer Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/restaurant/login" className="nav-links">
                    Restaurant Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
