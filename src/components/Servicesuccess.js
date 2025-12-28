import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ServiceSuccess() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const reference = query.get("reference");

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupMessage, setGroupMessage] = useState({}); // { [groupId]: message }

  useEffect(() => {
    if (!reference) {
      setError("No payment reference found");
      setLoading(false);
      return;
    }

    const fetchOrderSuccess = async () => {
      try {
        const isDevelopment = process.env.NODE_ENV === 'development'
        const baseURL = isDevelopment
          ? process.env.REACT_APP_API_BASE_URL_LOCAL
          : process.env.REACT_APP_API_BASE_URL_PROD;
        const res = await axios.get(
          `${baseURL}servicesuccess/${reference}/`
        );
        setOrderData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderSuccess();
  }, [reference]);

  // Handle WhatsApp group join
  const handleJoinGroup = async (groupId) => {
    if (!orderData?.whatsapp_button_token) {
      alert("Order data not ready yet");
      return;
    }

    try {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseURL = isDevelopment
      ? process.env.REACT_APP_API_BASE_URL_LOCAL
      : process.env.REACT_APP_API_BASE_URL_PROD;
      const res = await axios.get(
        `${baseURL}whatsapp-redirect/${orderData.whatsapp_button_token}/?group=${groupId}`
      );

      if (res.data?.url) {
        // Open WhatsApp in a new tab
        window.open(res.data.url, "_blank");
      }
    } catch (err) {
      let message = "Failed to join group. Try again later.";

      if (err.response?.status === 409) {
        message = "You have already joined this group!";
      } else if (err.response?.status === 403) {
        message = "This link has expired.";
      } else if (err.response?.status === 404 || err.response?.status === 400) {
        message = "Invalid group or link.";
      }

      setGroupMessage((prev) => ({
        ...prev,
        [groupId]: message,
      }));
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fefcf8",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "40px 30px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#111" }}>
          Thank you, {orderData.full_name}!
        </h2>

        <p style={{ marginBottom: "20px", color: "green" }}>
          Products purchased: {orderData.products.join(", ")}
        </p>

        <h3 style={{ marginBottom: "15px", color: "#111" }}>WhatsApp Groups</h3>

        {orderData.groups.map((group) => (
          <div key={group.id} style={{ marginBottom: "10px" }}>
            <p style={{ marginBottom: "5px", color: "#333" }}>
              {group.product_name}
            </p>

            <button
              onClick={() => handleJoinGroup(group.id)}
              style={{
                display: "inline-block",
                padding: "10px 25px",
                backgroundColor: "#6E0505",
                color: "white",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Join Group
            </button>

            {groupMessage[group.id] && (
              <p style={{ color: "#6E0505", marginTop: "5px" }}>
                {groupMessage[group.id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
