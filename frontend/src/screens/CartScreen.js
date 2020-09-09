import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CartScreen(props) {
  
  const [cartItems, setCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/cart");
      setCart(data);
    }
    fetchData();
    return () => {};
  },[]);

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
          cartItems.length === 0 ?
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
                     let input = document.getElementById('quantity');
                      await axios.post("/cart-quantity/" + item._id + "/" + input.value).then(
                        (response) => {
                        window.location = ("/cart");
                      },(error) => {
                        alert(error)
                      });
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
                        await axios.post("/cart/remove/"+ item._id ).then(
                          (response) => {
                           setCart(response.data);
                          }, 
                          (error) => {alert(error);}
                          );}
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
        Subtotal ({cartItems.reduce((subTotal,item) => parseInt(subTotal) + parseInt(item.quantity), 0)} items)
        :
        ₪ {cartItems.reduce((subTotal, item) => parseInt(subTotal) + parseInt(item.price) * parseInt(item.quantity), 0)}
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
