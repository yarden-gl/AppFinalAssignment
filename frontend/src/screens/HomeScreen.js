import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';


function HomeScreen(props) {
  // Retrieve products from backend
  const [products, setProduct] = useState([]);
  const [isAdmin, setAdmin] = useState([]);
  var productLink ="/product/";
  let newProducts = [];
  // Runs once after rendering component
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/api/products");
      setProduct(data);
      //const isAdmin = await axios.get("/isAdmin");
      const isAdmin = false;
      setAdmin(isAdmin);
    }
    fetchData();
    return () =>{};
  },[newProducts,isAdmin]);
  productLink = isAdmin ? "/updateProduct/" : "/product/";
  newProducts = window.arr ? window.arr.data : products; 

  return newProducts.length > 0 ? <ul className="products">
    {
      newProducts.map(product =>
      <li key={product._id} >
      <div className="product">
      <Link to={productLink + product._id}>
                  <img
                    className="product-image"
                    src={product.image}
                    alt="product"
                  />
                </Link>
        <div className="product-name"><Link to={'/product/' + product._id}>{product.name}</Link> </div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-price">₪{product.price}</div>
        <div className="product-type">{product.type}</div>
      </div>
    </li>)
    }
  </ul> : "No results"
}

export default HomeScreen;

