import React from 'react';
import {Link} from 'react-router-dom';
import data from '../data';
import axios from 'axios';

function UpdateProductScreen(props) {
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
          <h4><input type="text" id="name" value={product.name} required></input></h4>
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
        <li>{product.description} 
            <input type="text" className = "description" placeHolder = "Description..." id="description" required>
          </input>
        </li>
      </ul>
    </div>
    <div className="details-action">
      <ul>
        <li>
          <button onClick={async ()=> {
            if(document.getElementById('name').value ||document.getElementById('price').value || document.getElementById('brand').value || document.getElementById('description').value) {
              let newProduct = {
                _id : product._id,
                name : document.getElementById('name').value,
                category: product.category,
                image: product.image,
                price : document.getElementById('price').value,
                brand : document.getElementById('brand'),
                description : document.getElementById('description'),
              }  
              await axios.post("/updateproduct",newProduct).then(
                (response) => {
                  alert("Product updated");
                }, 
                (error) => {alert(error);}
                );
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