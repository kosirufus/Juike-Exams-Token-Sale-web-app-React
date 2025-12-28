import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LinkSecurity() {
  const { token, groupId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(""); // "redirecting", "joined", "expired"
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyToken() {
      try {
        //const myApiBaseUrl = 'http://localhost:8000/api/'; 
        const isDevelopment = process.env.NODE_ENV === 'development'
        const baseURL = isDevelopment
          ? process.env.REACT_APP_API_BASE_URL_LOCAL
          : process.env.REACT_APP_API_BASE_URL_PROD;
        const res = await axios.get(
          `${baseURL}whatsapp-redirect/${token}/?group=${groupId}`
        );
        const { redirectUrl, alreadyJoined } = res.data;
        if (redirectUrl && !alreadyJoined) {
          setStatus("redirecting");
          window.location.href = redirectUrl;
        } else if (alreadyJoined) {
          setStatus("joined");
          setMessage("You have already joined this group.");
        } else {
          setStatus("expired");
          setMessage("This link is no longer valid.");
        }
      } catch (err) {
        console.error("Error verifying token:", err);
        setStatus("expired");
        setMessage("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    verifyToken();
  }, [token, groupId]);

  if (loading) return <p>Verifying link...</p>;

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
        {status === "redirecting" && <p>Redirecting to WhatsApp...</p>}
        {(status === "joined" || status === "expired") && (
          <>
            <h2 style={{ color: "#111", marginBottom: "20px" }}>
              {status === "joined" ? "Already Joined" : "Link Expired"}
            </h2>
            <p style={{ color: "#6E0505", marginBottom: "20px" }}>{message}</p>
            <button
              onClick={() => navigate("/serviceproducts")}
              style={{
                padding: "10px 25px",
                backgroundColor: "#6E0505",
                color: "white",
                borderRadius: "8px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              Back to Services
            </button>
          </>
        )}
      </div>
    </div>
  );
}
