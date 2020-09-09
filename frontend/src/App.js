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
import UpdateProductScreen from './screens/UpdateProductScreen';
import AdminScreen from './screens/AdminScreen';
import axios from 'axios';
import './App.css';

function App() {
  useEffect(() => {
    const fetchData = async () => {
    }
    fetchData();
    return () => {};
  },[]);

  return (
  <BrowserRouter>
      <div className="grid-container">
        <header className="header">
          <div className="brand">
            <Link to="/homescreen" onClick={
              async () => {
                await axios.get(`/api/products`);
              }
            }>Doggy Delights</Link>
            <input className="searchBar" type="text" placeholder="Search.." id="search"></input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                let input = document.getElementById('search');
                window.arr = await axios.get(`/api/search/${input.value}`);
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
          </div>
          <div>FREE SHIPPING FOR ORDERS OVER ₪300!</div> 
          <div className="header-links">
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link onClick={
              async () => {
                await axios.delete(`/logout`).then((response)=>console.log(response),
                (error)=>alert(error));
              }
            }to="/">Log Out</Link>
          </div>
        </header>       
        <main className="main">
          <div className="content">
            <Route path="/about" component={AboutScreen}/>
            <Route path="/cart" component={CartScreen}/>
            <Route path="/product/:id" component={ProductScreen}/>
            <Route path="/homescreen"  component={HomeScreen}/>
            <Route path="/" exact={true} component={SigninScreen}/>
            <Route path="/register" component={RegisterScreen}/>
            <Route path="/checkout" component={CheckoutScreen}  />
            <Route path="/orderComplete" component={OrderCompleteScreen}  />
            <Route path="/updateProduct/:id" component={UpdateProductScreen}  />
          </div>  
        </main>
        <footer className="footer">Doggy Delights Inc</footer>
      </div>
    </BrowserRouter>
  );
}

export default App; 