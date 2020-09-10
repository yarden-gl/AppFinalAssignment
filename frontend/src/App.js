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
import ReadMe from './screens/ReadMe';
import axios from 'axios';
import './App.css';

function App() {
  useEffect(() => {
    const fetchData = async () => {
       await axios.get("/isadmin").then((response)=>{
        window.isAdmin = response.data;
       },(error)=> {
         alert(error);
       }
       );
       let visible = window.isAdmin ? "" : "none";
       if(document.getElementById("logs"))
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
            <button onClick={
              async () => {
                window.arr=undefined;
                document.getElementById("search").value="";
                await axios.get(`/api/products`).then((response)=>
                window.location="/homescreen", 
                  (error)=>
                  alert("Please sign in")
                );
                
              }
            }>Doggy Delights</button>
            <input className="searchBar" type="text" placeholder="Search.." id="search"></input>
            <button type="submit" className="searchButton" onClick = { 
              async () => {
                let input = document.getElementById('search');
                await axios.get(`/api/search/${input.value}`).then((response)=>
                  window.arr = response,
                  (error)=>
                  alert("Please sign in")
                );
              }
            }><span role="img" aria-label="magnifyingglass">🔍</span></button>
          </div>
          <div>FREE SHIPPING FOR ORDERS OVER ₪300!</div> 
          <div className="header-links">
          <Link onClick = { async () => {
            await axios.get("/isadmin").then((response)=>{
              window.isAdmin = response.data;
              window.location = '/logs';
             },(error)=> {
               alert(error);
             }
             );
            }
          } id="logs" >Logs</Link>
          <Link to="/readme">ReadMe</Link>
            <Link to="/about">About</Link>
            <Link  onClick= {
              async ()=> {
                await axios.get(`/api/cart`).then((response)=>
                window.location = ('/cart'),
                (error)=>alert("Please sign in"));
              }
            }>Cart</Link>
            <Link onClick={
              async () => {
                await axios.delete(`/logout`).then((response)=>
                console.log("See you soon!"),
                (error)=>console.log(error));
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
            <Route path="/readme" component={ReadMe}/>
          </div>  
        </main>
        <footer className="footer">Doggy Delights Inc</footer>
      </div>
    </BrowserRouter>
  );
}

export default App; 