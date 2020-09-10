import React from 'react';
import { Link} from 'react-router-dom';
function AboutScreen(props) {
  return <div>
  <div className="back-to-result">
  <Link to="/">Back</Link>
</div>
  <div className="about"> 
  Doggy Delights is a one-stop shop for all your canine needs!
    Whether it's a collar sporting your favorite pattern, a warm coat for the winter months, or treats for your pet's training.
    <br></br><br></br>
    We have searched the market high and low and found the best quality products with the best deals, saving you time and money.
    We send out the products within 2 business days in our original packaging which is entirely eco-friendly, plastic free and recyclable.
    <br></br><br></br>
    In addition, we allow up to 30 days of return! You bought something but your little buddy didn't like it? Send it right on back and get a full refund!
    <br></br><br></br>
    Enjoy shopping!
    <br></br><br></br>
    Yarden and Dave
    <br></br><br></br>
    302328901 308152859
  </div></div>
}

export default AboutScreen;

