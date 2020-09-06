import React from 'react';
import { BrowserRouter, Route, Link} from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="grid-container">
        <header className="header">
          <div className="brand">
            <Link to="/">Doggy Delights</Link>
          </div>
          <div className="header-links">
            <Link to="/about">About</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/signin">Sign In</Link>
          </div>
        </header>       
        <main className="main">
          <div className="content">
            <Route path="/cart" component={CartScreen} />
            <Route path="/product/:id" component={ProductScreen} />
            <Route path="/" exact={true} component={HomeScreen} />
          </div>  
        </main>
        <footer className="footer">Doggy Delights Inc</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
