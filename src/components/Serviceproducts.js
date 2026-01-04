import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // use plain axios

export default function ServiceProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Determine backend URL based on environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseURL = isDevelopment
      ? "http://localhost:8000" // local backend
      : "https://juike-exams-token-sale-web-app-django.onrender.com"; // production backend

    axios
      .get(`${baseURL}/api/serviceproducts/`) 
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleSelectProduct = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const proceedToForm = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to continue");
      return;
    }
    navigate("/order-form", { state: { productIds: selectedProducts } });
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="service-container">
      <h1 style={{ color: "green" }}>Our Services</h1>
      <div className="serviceproducts-container">
        {products.map((product) => (
          <div key={product.id} className="serviceproducts-card">
            <h3 style={{ color: "orange", fontSize: "25px" }}>{product.name}</h3>
            <p style={{ color: "purple" }}>₦{product.price}</p>

            <div className="button-group">
              <button
                onClick={() => toggleSelectProduct(product.id)}
                className={`product-select-btn ${
                  selectedProducts.includes(product.id) ? "selected" : ""
                }`}
              >
                {selectedProducts.includes(product.id) ? "Selected" : "Select"}
              </button>

              <button
                className="orderbutton"
                onClick={() =>
                  navigate("/order-form", { state: { productIds: [product.id] } })
                }
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "70px" }}>
          <button className="ordercontinue" onClick={proceedToForm}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
