import React from 'react';
import { Link } from 'react-router-dom';
function ReadMe(props) {

  return <div>
    <div className="back-to-result">
      <Link to="/">Back</Link>
    </div>
    <ol>
      <li>
        Store Name: Doggy delights
  </li> <br></br>
      <li>
        What are you selling? Dog items
  </li> <br></br>
      <li>
        What additional page(s) did you add? How to operate them:
  <br></br>
  a. admin user logs - preview the users from the list on the left, then search for the logs checkout
  <br></br>
  b. shipping details - preload them when saving
  </li> <br></br>
      <li>
        What was hard to do?
  <br></br>
  The react part, async control with redis. realizing that handlebars/ejs/jade is probably more work than react
  </li> <br></br>
      <li>
        Who is your partner?  name and id. What did you do? What did your partner do?
  <br></br>
  Yarden Glasberg 302328901. I did mainly the backend, along with the tests. fixing compatibility issues. she did the front, react
  </li> <br></br>
      <li>
        Specify all the different route your app supports
  <br></br>
        // returns isadmin true / false
        <br></br>
 app.get("/isadmin",
 <br></br>
        // returns array of all user names
        <br></br>
app.get("/allusers",
<br></br>
        // returns an object with the user logs in time:action format
        <br></br>
app.get("/userlog/:username",
<br></br>
        // Returns all products to display in HomeScreen 
        <br></br>
app.get("/api/products",
<br></br>
        // Returns products in current order to display in cart
        <br></br>
app.get("/api/cart",
<br></br>
        // Returns products that fit search parameter
        <br></br>
app.get("/api/search/",
<br></br>
        // Returns products that fit the given search parameter
        <br></br>
app.get("/api/search/:parameter",
<br></br>
        // Add product with :productId to user cart and set quantity to 1
        <br></br>
app.post('/cart/:productid',
<br></br>
        // admin updates a product. Changes to apply saved in redis
        <br></br>
app.post('/updateproduct/:productid',
<br></br>
        // Set product's quantity to :quantity in user cart
        <br></br>
app.post('/cart-quantity/:productid/:quantity',
<br></br>
        // remove cart from redis db according to product id
        <br></br>
app.post('/cart/remove/:productid'
<br></br>
        // sign in with remember me trigerring 1 year cookie maxage
        <br></br>
app.post('/signin',
<br></br>
        // register a new user, encrypt the password, return 409 if exists
        <br></br>
app.post('/register',
<br></br>
        // checkout + log the action + delete the user cart.
        <br></br>
app.post('/checkout',
<br></br>
        // add shipping details for user under shipping table
        <br></br>
app.post('/updateshipping',
<br></br>
        // returns shipping details of user and populates in the form
        <br></br>
app.get('/getshipping'
<br></br>
        // destroys the session on the server and also clears the user cookie
        <br></br>
app.delete('/logout'
<br></br>
        // for test purposes, deleting users
        <br></br>
app.delete('/deleteuser'
  </li> <br></br>
      <li>
      How did you make the store secured
      <br></br>
      session validaiton on the meaningful routes, try catch in meaningful routes and error handling
      </li> <br></br>
      <li>
        did you use react
      <br></br>
      yes
  </li> <br></br>
    </ol>
</div>
}
export default ReadMe;