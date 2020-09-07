import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CartScreen(props) {

  // Retrieve cartItems from backend

  const [cartItems, setCart] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/cart");
      setCart(data);
    }
    fetchData();
    return () => {};
  },[]); // Run once when page loads

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
        </li>
        {
          cartItems.length === 0 ?
            <div>
              Cart is empty
          </div>
            :
            cartItems.map(item => 
              <li>
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
                    Quantity: <select id="quantity" onSelect={
                    async ()=> {
                      let input = document.getElementById('quantity');
                      console.log(input.value);
                      await axios.post("/currentOrder/" + item._id + "/" + input.value);
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
                        await axios.post("/currentOrder/" + item._id + "/remove");
                      }
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
      <button className="button primary full-width" disabled={cartItems.length === 0}>
        Proceed to Checkout
      </button>

    </div>

  </div>
}

export default CartScreen;

/**{()=>{
          let subTotal = 0;
            cartItems.forEach((item) => {
            item.quantity;
          })
        }
        }  */