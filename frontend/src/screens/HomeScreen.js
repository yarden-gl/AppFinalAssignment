import React  from 'react';
import { Link } from 'react-router-dom';
import data from '../data';
//import { useState, useEffect } from 'react'
//import axios from 'axios'; //library to retrieve data from web API

function HomeScreen(props) {
/**
  // Retrieve products from backend
  
  const [products, setProduct] = useState([]);
  useEffect(() => {
    const fetchData = async() => {
      const {data} = await axios.get("/api/products");//.catch((err)=> console.log(err));

      setProduct(data);
      
    };
    fetchData();
    return () => {};
  },[]);
*/
    return <ul className="products">
    {
      data.products.map(product =>
      <li key={product.__id}>
      <div className="product">
      <Link to={'/product/' + product._id}>
                  <img
                    className="product-image"
                    src={product.image}
                    alt="product"
                  />
                </Link>
        <div className="product-name">
        <Link to={'/product/' + product._id}></Link>
        </div>
        <div className="product-brand">{product.brand}</div>
        <div className="product-price">₪{product.price}</div>
        <div className="product-type">{product.type}</div>
      </div>
    </li>)
    }
  </ul>
}

export default HomeScreen;

