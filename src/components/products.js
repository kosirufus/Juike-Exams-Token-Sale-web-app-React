import { useEffect, useState } from 'react';
import axios from 'axios'; // use plain axios, no custom instance needed
import { Link } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Determine backend URL based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseURL = isDevelopment
      ? 'http://localhost:8000' // local backend
      : 'https://juike-exams-token-sale-web-app-django.onrender.com'; // production backend

    // Fetch products
    axios
      .get(`${baseURL}/product/`) // add leading slash
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>Available Exam Tokens</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <p className="product-price">{product.name}</p>
            <p className="product-price">PRICE - ₦{product.price}</p>
            <p>
              <Link className="buy-btn" to={`/purchase/${product.id}`}>
                Buy
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
