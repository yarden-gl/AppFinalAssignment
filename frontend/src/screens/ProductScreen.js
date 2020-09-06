import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import data from '../data';

function ProductScreen(props) {
  const product = data.products.find(x => x._id === props.match.params.id);

  const [orderItems,setOrder] = useState([]);


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
          {product.type}
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
        Price: {product.price}
        </li>
        <li>
        Status: {product.status}
        </li>
        <li>
        Quantity: <select>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          </select>
        </li>
        <li>
          <button onClick={setOrder([...orderItems,product]) } >Add to Cart</button>
        </li>
      </ul> 
    </div>
  </div>
</div>
}
export default ProductScreen;