import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "../api/axios";

export default function OrderFormPage() {
  const location = useLocation();
  const productIds = location.state?.productIds || [];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("science");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);


  // Fetch subjects from backend
  useEffect(() => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseURL = isDevelopment
      ? process.env.REACT_APP_API_BASE_URL_LOCAL
      : process.env.REACT_APP_API_BASE_URL_PROD;
    axios.get(`${baseURL}subjects/`)  // endpoint returning all subjects
      .then(res => setSubjects(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggleSubject = (subjectId) => {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter(id => id !== subjectId));
    } else {
      if (selectedSubjects.length < 9) {
        setSelectedSubjects([...selectedSubjects, subjectId]);
      } else {
        alert("You can only select exactly 9 subjects");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSubjects.length !== 9) {
      alert("Please select exactly 9 subjects");
      return;
    }

    setLoading(true);
    try {
    const isDevelopment = process.env.NODE_ENV === 'development'
    const baseURL = isDevelopment
      ? process.env.REACT_APP_API_BASE_URL_LOCAL
      : process.env.REACT_APP_API_BASE_URL_PROD;
      const response = await axios.post(`${baseURL}pay/`, {
        full_name: fullName,
        email,
        student_class: studentClass,
        product_ids: productIds,
        subject_ids: selectedSubjects
      });

      window.location.href = response.data.authorization_url;
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="hero">
    <div className="hero-content">

      <div className="form-container">
        <h2 style={{color: "green"}}>Complete Your Order</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Enter Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="Enter valid email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label>Class:</label>
          <select
            value={studentClass}
            onChange={e => setStudentClass(e.target.value)}
          >
            <option value="science">Science</option>
            <option value="art">Art</option>
          </select>

          <label>Select 9 Subjects:</label>

          <div className={`subject-wrapper ${expanded ? "expanded" : ""}`}>
            <div className="subject-grid">
              {subjects.map(sub => (
                <button
                  type="button"
                  key={sub.id}
                  className={
                    selectedSubjects.includes(sub.id)
                      ? "subject-btn selected"
                      : "subject-btn"
                  }
                  onClick={() => toggleSubject(sub.id)}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="toggle-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
          </button>


          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Continue to Pay"}
          </button>
        </form>
      </div>

    </div>
  </div>
);
}
