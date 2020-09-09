import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
import axios from 'axios';

function ProductScreen(props) {
  const product = data.products.find(x => x._id === props.match.params.id);


  return <div>
    <div className="back-to-result">
      <Link to="/">Back to Result</Link>
    </div>
    <div className="details">
      <div className="details-image">
        <img src={product.image} alt="product"></img>
      </div>
    <div className="details-info">
      <ul>
        <li>
          <h4>{product.name}</h4>
        </li>
        <li>
          Price: <b>₪{product.price}</b>
        </li>
        <li>
          {product.brand}
        </li>  
        <li>
          Description:
        </li>
        <li>
            {product.description}
        </li>
      </ul>
    </div>
    <div className="details-action">
      <ul>
        <li>
          <button onClick={async ()=> {
            await axios.post("/cart/" + product._id).then(
              (response) => alert(`${product.name} was added to cart`)
              , (error) => alert(error));}
            } >Add to Cart</button>
        </li>
      </ul> 
    </div>
  </div>
</div>
}
export default ProductScreen;