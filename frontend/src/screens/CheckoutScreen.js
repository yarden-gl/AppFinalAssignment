import React, { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function CheckoutScreen(props) {

  const [cartItems, setCart] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/cart");
      setCart(data);
      await axios.get("/getshipping").then((response)=>{
        setAddress(response.address);
        setCity(response.city);
        setPostalCode(response.postalCode);
        setCountry(response.country);
      },(error)=>{
        console.log("No shipping details to display")
      });
      
    }
    fetchData();
    return async () => {
    };
  },[]);

  const itemsPrice =cartItems.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 300 ? 0 : 10;
  const totalPrice = itemsPrice + shippingPrice;

  return <div>
    <div className="placeorder">
      <div className="placeorder-info">
      <ul className="form-container">
          <li>
            <h3>Shipping</h3>
          </li>
          <li>
            <label htmlFor="address">
              Address
          </label>
            <input type="text" name="address" id="address" value={address ? address : ""} onChange={(e) => setAddress(e.target.value)} required>
            </input>
          </li>
          <li>
            <label htmlFor="city">
              City
          </label>
            <input type="text" name="city" id="city" value = {city ? city : ""} onChange={(e) => setCity(e.target.value)} required>
            </input>
          </li>
          <li>
            <label htmlFor="postalCode">
              Postal Code
          </label>
            <input type="text" name="postalCode" id="postalCode" value = {postalCode ? postalCode : ""} onChange={(e) => setPostalCode(e.target.value)} required>
            </input>
          </li>
          <li>
            <label htmlFor="country">
              Country
          </label>
            <input type="text" name="country" id="country" value = {country ? country : ""} onChange={(e) => setCountry(e.target.value)} required>
            </input><br></br>
            <button className="button primary full-width" onClick={
              async () => {
                let shippingDetails = {address,city,postalCode,country};
                await axios.post("/updateshipping",shippingDetails).then(
                  (response)=>{
                    alert("Shipping details set")
                  },(error)=>{
                    alert(error);
              });
            }}>Set Details</button>
          </li>
        </ul>
        <div>
          <h3>Payment</h3>
          <div>
            Payment Method:
          </div>
          <div>
            <select id="quantity">
              <option>Paypal</option> 
              <option>Credit card</option>
              <option>Cash</option>
            </select>
            </div>
        </div>
        <div>
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
                  <li key={item._id}>
                    <div className="cart-image">
                      <img src={item.image} alt="product" />
                    </div>
                    <div className="cart-name">
                      <div>
                        <Link to={"/product/" + item.product}>
                          {item.name}
                        </Link>

                      </div>
                      <div>
                        Quantity: {item.quantity}
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
      </div>
      <div className="placeorder-action">
        <ul>
          <li>
            <button className="button primary full-width" onClick={
              async () => {
                await axios.post("/checkout",{amount: totalPrice});
                window.location = '/orderComplete';
              } 
            } >Place Order</button>
          </li>
          <li>
            <h3>Order Summary</h3>
          </li>
          <li>
            <div>Items</div>
            <div>₪{itemsPrice}</div>
          </li>
          <li>
            <div>Shipping</div>
            <div>₪{shippingPrice}</div>
          </li>
          <li>
            <div>Order Total</div>
            <div>₪{totalPrice}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
}

export default CheckoutScreen;