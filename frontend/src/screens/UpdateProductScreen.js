import React from 'react';//, {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
//import axios from 'axios';

function UpdateProductScreen(props) {
  const product = data.products.find(x => x._id === props.match.params.id);
  const index = data.products.indexOf(product);
  console.log(index);

  /** 
   * const [updatedProduct, setProduct] = useState(product);
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
          <h4><input type="text" id="price" value={product.name} required></input></h4>
        </li>
        <li>
          Price: <b>₪</b>
          <input type="text" id="price" value={product.price} required></input>
        </li>
        <li>
        <input type="text" id="brand" value= {product.brand} required></input>
        </li>  
        <li>
          Description:
        </li>
        <li>
            <input type="text" className = "description" value= {product.description} id="description" required>
          </input>
        </li>
      </ul>
    </div>
    <div className="details-action">
      <ul>
        <li>
          <button onClick={async ()=> {
            if(document.getElementById('name').value ||document.getElementById('price').value || document.getElementById('brand').value || document.getElementById('description').value) {
              document.getElementById('name');  
            document.getElementById('price');  
            document.getElementById('brand');  
            document.getElementById('description'); 
            } else {
              alert("Please fill in all fields");
            }
             
            }
            }>Update</button>
        </li>
      </ul> 
    </div>
  </div>
</div>
}
export default UpdateProductScreen;