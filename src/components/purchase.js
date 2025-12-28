import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import html2pdf from "html2pdf.js"

const downloadCard = (id) => {
  const element = document.getElementById(`token-card-${id}`);

  html2pdf()
    .from(element)
    .set({
      filename: `exam-token-${id}.pdf`,
      margin: 5,
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait" }
    })
    .save();
};

function Purchase() {
  const { id } = useParams(); // Product ID
  console.log("Route param id:", id);

  const [product, setProduct] = useState(null); // start as null
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [assignedTokens, setAssignedTokens] = useState([]);
  const [finalTokens, setFinalTokens] = useState([]); // ✅ ADDED: Freeze tokens after payment
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch product details
  useEffect(() => {
    console.log("Route param id:", id);
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/product/${id}/`); //endpoint
        console.log("API response:", res.data);
        const productData = {
          ...res.data,
          price: Number(res.data.price), // ensure price is a number
        };
        setProduct(productData);
        setTotal(productData.price * quantity); // initial total
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setLoading(false);
      }
  };

  fetchProduct();
}, [id, quantity]);


  // 2️⃣ Update total when quantity changes
  useEffect(() => {
    if (product) {
      setTotal(product.price * quantity);
    }
  }, [quantity, product]);

  // 3️⃣ Handle Paystack Payment
const handlePay = async () => {
  try {
    const res = await axios.post('/api/create-paystack-session/', {
      product_id: product.id,
      quantity: quantity
    });

    const { authorization_url, reference } = res.data;
    console.log("Reference:", reference);

    // Redirect user to Paystack checkout
    window.location.href = authorization_url;

  } catch (err) {
    console.error("Payment initiation failed:", err);
    alert("Payment initiation failed.");
  }
};

// 4️⃣ Fetch assigned tokens after payment success
useEffect(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const reference = searchParams.get('reference');

  if (reference) {
    const fetchAssignedTokens = async () => {
      try {
        const res = await axios.get(`/api/assigned-tokens/?reference=${reference}`);
        setAssignedTokens(res.data);
        setPaymentCompleted(true);
      } catch (err) {
        console.error("Failed to fetch assigned tokens:", err);
      }
    };
    fetchAssignedTokens();
  }
}, []);

// ✅ ADDED: Freeze tokens after payment so UI does not disappear
useEffect(() => {
  if (paymentCompleted && assignedTokens.length > 0 && finalTokens.length === 0) {
    setFinalTokens(assignedTokens);
  }
}, [paymentCompleted, assignedTokens, finalTokens]);


  // 5️⃣ Render loading while product data is fetching
  if (loading || !product) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="purchase-container">
      <div className = "purchase-card">
        <h2 style={{marginBottom :'50px', fontSize: '40px'}}>Purchase {product.name}</h2>
        <p style={{marginBottom: '30px', fontSize: '25px'}}>Price per token: <b>₦{product.price}</b></p>

        <label style={{fontSize: '25px'}}>
          Quantity:
          <input
            className='quantity-input'
            type="number"
            min="1"
            max={product?.available_tokens ?? 1} // fallback if undefined
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <h3 style={{marginTop: '20px', marginBottom: '20px'}}>Total: ₦{total}</h3>
        <button onClick={handlePay} className='pay-button'>Pay Now</button>
      </div>
      <div className = "instruction-card">
        <h3 style={{marginBottom: '30px', backgroundColor: '#551010ff', textAlign: 'center', color: 'white' }}>How to Buy</h3>
        <ol>
          <li>Check your token quantity.</li>
          <li>Click "Pay Now".</li>
          <li>Confirm payment in Paystack.</li>
        </ol>
      </div>
      
      {/* Display assigned tokens after payment */}
      {finalTokens.length > 0 && (
        <div className="success-container">
          <h3>Your Exam Token(s)</h3>         
          {finalTokens.map((token) => (
            <div key={token.id} id={`token-card-${token.id}`} className="success-card">
              <p><strong>Token Code:</strong> {token.code}</p>
              <p><strong>Exam Type:</strong> {token.product_name}</p>
              <p><strong>Session:</strong> {token.product_session}</p>

              <button style={{
                marginTop: "15px",
                padding: "12px 16px",
                backgroundColor: "#102644",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "inline-block",
                fontSize: "14px",
              }} onClick={() => downloadCard(token.id)}>
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Purchase;
