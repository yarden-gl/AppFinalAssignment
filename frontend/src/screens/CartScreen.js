import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import data from '../data';

function CartScreen(props) {
  const allProducts = data.products;
  
  const [cartItems, setCart] = useState([]);
  const [finalCart, setFinalCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/cart");
      setCart(data);

      cartItems.forEach((item)=>{
        let cartProduct = allProducts.find((product)=>{
          return product._id === item._id;
        });
        if(cartProduct) {
          cartProduct.quantity = item.quantity;
          setFinalCart([...finalCart,cartProduct])
        }
      });
      
    }
    fetchData();
    return () => {};
  },[cartItems,allProducts,finalCart]);

  return <div className="cart">
    <div className="cart-list"> 
      <ul className="cart-list-container">
        <li>
          <h3>
            Shopping Cart
          </h3>
          <div>
            Price
          </div>
        </li >
        {
          finalCart.length === 0 ?
            <div>
              Cart is empty
          </div>
            :
            cartItems.map(item => 
              <li key={item._id}>
                <div className="cart-image">
                  <img src={item.image} alt="product" />
                </div>
                <div className="cart-name">
                  <div>
                    <Link to={"/product/" + item._id}>
                      {item.name}
                    </Link>
                  </div>
                  <div>
                    Quantity: <select id="quantity" value={item.quantity} onChange={
                    async ()=> {
                      console.log("I changed the quantity")
                     /** let input = document.getElementById('quantity');
                      await axios.post("/currentOrder/" + item._id + "/" + input.value).then((data) => {
                        setCart(data);
                      });*/ 
                    }}>
                      <option>1</option> 
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      </select>
                    </div>
                  <div>
                    <button type="button" className="button" onClick={
                      async () => {
                        console.log("Remove");
                        await axios.post("/currentOrder/" + item._id + "/remove").then((data) => setCart(data));}
                    } >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-price">
                ₪{item.price}
                </div>
              </li>
            )
        }
      </ul>
    </div>
    <div className="cart-action">
      <h3>
        Subtotal ({cartItems.reduce((subTotal, item) => subTotal + item.quantity, 0)} items)
        :
        ₪ {cartItems.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0)}
      </h3>
      <button className="button primary full-width" disabled={cartItems.length === 0} onClick = {
        () => {
        window.location = '/checkout';}
         }>
        Proceed to Checkout
      </button>
    </div>
  </div>
}

export default CartScreen;
