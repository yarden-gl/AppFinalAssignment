import React,{ useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; //library to retrieve data from web API

function HomeScreen(props) {

  // Retrieve products from backend
  const [products, setProduct] = useState([]);


  useEffect(() => {
    const fetchData = async() => {
      const {data} = await axios.get("/api/products");

      setProduct(data);
      
    };
    fetchData();
    return () => {};
  },[]);

    return <ul className="products">
    {
      products.map(product =>
      <li key={product._id}>
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

