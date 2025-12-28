import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";

export default function PurchaseSuccess() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [assignedTokens, setAssignedTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Verify payment ONCE
  useEffect(() => {
    if (!reference) return;

    axios.get(`/api/verify-paystack/?reference=${reference}`)
      .then(res => {
        console.log("Payment verified");
      })
      .catch(err => {
        console.error("Verification failed:", err);
      });
  }, [reference]);

  // 2️⃣ Poll assigned tokens
  useEffect(() => {
    if (!reference) return;

    const interval = setInterval(() => {
      axios.get(`/api/assigned-tokens/?reference=${reference}`)
        .then(res => {
          if (res.data.length > 0) {
            setAssignedTokens(res.data);
            setLoading(false);
            clearInterval(interval);
          }
        })
        .catch(err => {
          console.error("Fetching tokens failed:", err);
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [reference]);

  return (
    <div className="success">
        <h2>Payment Completed!</h2>
        {loading ? (
          <p>Assigning your token(s)... Please wait.</p>
        ) : (
          <div>
            <h3 style={{color: 'blue', marginTop: '20px', fontSize: '25px'}}>Your Exam Token(s)</h3>
            {assignedTokens.map(token => (
              <div  className="success-container" key={token.id}>
                <div className="success-card">
                  <p><strong>Token Code:</strong> <span style={{color: 'blue', fontSize: '20px'}}><b>{token.code}</b></span></p>
                  <p><strong>Exam Type:</strong> {token.product_name}</p>
                  <p><strong>Session:</strong> {token.product_session}</p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
