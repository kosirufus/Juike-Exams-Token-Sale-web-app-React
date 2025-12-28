import {useEffect, useState} from 'react';
import axios from '../api/axios';
import {Link} from 'react-router-dom';

function Products () {
    const [products, setProducts] = useState ([]);

    useEffect (()=> {
        const isDevelopment = process.env.NODE_ENV === 'development'
        const baseURL = isDevelopment
          ? process.env.REACT_APP_API_BASE_URL_LOCAL
          : process.env.REACT_APP_API_BASE_URL_PROD;
        axios.get (`${baseURL}product/`)
        .then (res => setProducts (res.data))
        .catch (err => console.error (err));
    }, []);

    return (
        <div className = "container">
            <h1>Available Exam Tokens</h1>
            <div className = "product-grid">
                {products.map (product => (
                    <div className = "product-card" key={product.id}>
                        <p className = "product-price">{product.name}</p>
                        <p className = "product-price">PRICE - ₦{product.price}</p>
                        <p><Link className='buy-btn' to = {`/purchase/${product.id}`}> Buy </Link></p>
                    </div>
                ))}
            </div>
                    
        </div>
    )
}

export default Products;