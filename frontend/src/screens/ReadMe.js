import React from 'react';
import { Link} from 'react-router-dom';
function ReadMe(props) {

  return <div>
  <div className="back-to-result">
  <Link to="/">Back</Link>
</div>
<h2>Read Me</h2>

<ol>
    <li>Q: Store name?<br></br>
        A: Doggy Delights</li><br></br>
    <li>Q: What are you selling?<br></br>
        A: Dog products - food, treats, leashes, collars.</li><br></br>
    <li>Q: What additional page(s) did you add? How to operate them<br></br>
        A: <ul><li>
            ProductScreen - a screen for each product with product details. When in HomeScreen, press on the product and it will navigate you to the product page.
        </li><li>
            UpdateProductScreen - a screen where you can update each products details. Must be admin in order to do this. Sign in with username:admin password:admin, in HomeScreen click on any product and edit the details you wish to change -> press update. </li>
    </ul></li> <br></br>
    <li>Q: What was hard to do?<br></br>
        A: Getting the project started was hard, understanding React, connecting the frontend and backend.</li><br></br>
    <li>Q: Who is your partner?  (name and id) What did you do? What did your partner do?<br></br>
        A: Dave Levinov 308152859. <br></br>
        I worked on the frontend - I was in charge of React, implementing all the screens and the logic between them, routing requests to backend etc<br></br>
        Dave worked on the backend - Dave was in charge of Redis, returning requests, implemented cookies,sessions etc</li><br></br>
    <li>Q: Specify all the different route your app supports<br></br>
        A: "/isadmin", "/allusers", "/userlog/:username", "/api/products", "/api/cart", "/api/search/", "/api/search/:parameter", "/cart/:productid", "/updateproduct/:productid", "/cart-quantity/:productid/:quantity", "/cart/remove/:productid", '/signin', '/register', '/checkout, '/updateshipping', '/getshipping','/logout' </li><br></br>
    <li>Q: How did you make your store secured?<br></br>
        A: We encrypted the users' passwords and implemented session access and expiry</li><br></br>   
    <li>Q: Did you implement the store using react.js?<br></br>
        A: Yes</li> <br></br>
</ol> 

</div>
}

export default ReadMe;

