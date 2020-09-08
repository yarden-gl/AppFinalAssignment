import React, {useEffect} from 'react';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import AboutScreen from './screens/AboutScreen';
import SigninScreen from './screens/SigninScreen';
import RegisterScreen from './screens/RegisterScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderCompleteScreen from './screens/OrderCompleteScreen';
import axios from 'axios';
import './App.css';

function App() {
  useEffect(() => {
    const fetchData = async () => {

      /**
       * Sessions
       * 
      let session;
      let response = await axios.get('/start');
      if (response.ok) { // if HTTP-status is 200-299
          session = await response.text();
          console.log("HTTP-OK: " + response.status);
          return session;
      }
      console.log("HTTP-Error: " + response.status);


      //await axios.get("/start");
       */
    }
    fetchData();
    return () => {};
  },[]);

  return (
  <BrowserRouter>
      <div className="grid-container">
        <header className="header">
          <div className="brand">
            <Link to="/" onClick={
              async () => {
                await axios.get(`/api/products`);
                console.log("Get all products");
              }
            }>Doggy Delights</Link>
            <input className="searchBar" type="text" placeholder="Search.." id="search"></input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                let input = document.getElementById('search');
                window.arr = await axios.get(`/api/search/${input.value}`);
                console.log("This is the new array");
                console.log(window.arr.data);
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
          </div>
          <div>FREE SHIPPING FOR ORDERS OVER ₪300!</div> 
          <div className="header-links">
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/signin">Log Out</Link>
          </div>
        </header>       
        <main className="main">
          <div className="content">
            <Route path="/about" component={AboutScreen}/>
            <Route path="/cart" component={CartScreen}/>
            <Route path="/product/:id" component={ProductScreen}/>
            <Route path="/" exact={true} component={HomeScreen}/>
            <Route path="/signin" component={SigninScreen}/>
            <Route path="/register" component={RegisterScreen}/>
            <Route path="/checkout" component={CheckoutScreen}  />
            <Route path="/orderComplete" component={OrderCompleteScreen}  />
          </div>  
        </main>
        <footer className="footer">Doggy Delights Inc</footer>
      </div>
    </BrowserRouter>
  );
}

export default App; 