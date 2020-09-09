import React from 'react';//, {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
//import axios from 'axios';

function UpdateProductScreen(props) {
  const product = data.products.find(x => x._id === props.match.params.id);
  const index = data.products.indexOf(product);
  console.log(index);
  /** 
   *   const [updatedProduct, setProduct] = useState(product);
  useEffect(() => {
    const fetchData = async () => {

  
    }
    fetchData();
    return () => {};
  },[updatedProduct]);
  */

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
          <h4><input type="text" id="price" name="price" value={product.name}></input></h4>
        </li>
        <li>
          Price: <b>₪</b>
          <input type="text" id="price" name="price" value={product.price}></input>
        </li>
        <li>
        <input type="text" id="price" name="price" value= {product.brand} ></input>
        </li>  
        <li>
          Description:
        </li>
        <li>
            <input type="text" className = "description" value= {product.description} id="description" name="description">
          </input>
        </li>
      </ul>
    </div>
    <div className="details-action">
      <ul>
        <li>
          <button onClick={async ()=> {
            let input = document.getElementById('quantity');  
            //data.products[index].
            }
            }>Update</button>
        </li>
      </ul> 
    </div>
  </div>
</div>
}
export default UpdateProductScreen;