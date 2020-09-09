import React, {useEffect,useState} from 'react';
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
  const [isAdmin, setAdmin] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
       await axios.get("/isadmin").then((response)=>{
        setAdmin(response.data);
        window.isAdmin = response.data;
       },(error)=> {
         alert(error);
       }
       );
       let visible = window.isAdmin ? "" : "none";
       document.getElementById("logs").style.display = visible;
    }
    fetchData();
    return () => {
    }
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
          <Link to="/logs" id="logs" >Logs</Link>
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link onClick={
              async () => {
                await axios.delete(`/logout`).then((response)=>console.log(response),
                (error)=>alert(error));
                window.location('/');
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
            <Route path="/checkout" component={CheckoutScreen}/>
            <Route path="/orderComplete" component={OrderCompleteScreen}/>
            <Route path="/updateProduct/:id" component={UpdateProductScreen}/>
            <Route path="/logs" component={AdminScreen}/>
          </div>  
        </main>
        <footer className="footer">Doggy Delights Inc</footer>
      </div>
    </BrowserRouter>
  );
}

export default App; 