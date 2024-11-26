import React from 'react';
import './App.css';
import AppRoutes from './routes/routes'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/navbar';
import CustomerList from './components/CustomerList';



function App() {
  return (
    <div className="App">
      <AppRoutes /> 
    </div>
  );
}

export default App;
