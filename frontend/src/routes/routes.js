import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '../components/landingPage/LandingPage';
import CustomerLogin from '../components/customer/CustomerLogin';
import CustomerSignup from '../components/customer/CustomerSignup';
import RestaurantLogin from "../components/restaurant/restaurantLogin";
import RestaurantSignup from "../components/restaurant/restaurantSignup";
import CustomerHome from '../components/customer/CustomerHome';
import CustomerDetails from '../components/customer/customerDetails';
import CustomerOrders from '../components/customer/customerOrders';
import CustomerRestaurant from '../components/customer/customerRestaurant';
import CustomerCart from '../components/cart/cart';

// import CustomerDetails from '../components/customer/customerDetails';
// import CustomerFavorites from '../components/customer/customerFavorites';


const AppRouter = () => {
    return (
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />
  
          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/restaurant/login" element={<RestaurantLogin />} />
          <Route path="/restaurant/signup" element={<RestaurantSignup />} />
          <Route path="/customer/home" element={<CustomerHome />} />
          <Route path="/customer/account" element={<CustomerDetails />} />
          <Route path="/customer/orders" element={<CustomerOrders />} />
          <Route path="/customer/restaurant/:id" element={<CustomerRestaurant />} />
          <Route path="/customer/cart/" element={<CustomerCart />} />
          
          {/* <Route path="/customer/details" element={<CustomerDetails />} />
        //   <Route path="/customer/favorites" element={<CustomerFavorites />} /> */}
          
          {/* Add additional routes for other components as needed */}
        </Routes>
      </Router>
    );
  };
  
  export default AppRouter;
  
