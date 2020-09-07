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
          <div>
            {product.description}
          </div>
        </li>
      </ul>
    </div>
    <div className="details-action">
      <ul>
        <li>
          <button onClick={async ()=> {
            //let input = document.getElementById('quantity');
            await axios.post("/currentOrder/" + product._id);
            }
            } >Add to Cart</button>
        </li>
      </ul> 
    </div>
  </div>
</div>
}
export default ProductScreen;