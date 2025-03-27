import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Hide scrollbar when on the Login page
    document.body.style.overflow = "hidden";

    return () => {
      // Reset overflow when leaving the Login page
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hardcoded passwords for different users
    const adminPassword = "admin123";
    const userPassword = "sammy123";

    if (email === "admin@gmail.com" && password === adminPassword) {
      navigate("/Dashboard");
    } else if (email === "Sammy@example.com" && password === userPassword) {
      navigate("/profile_user");
    } else {
      alert("Invalid credentials. Please try again.");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          maxWidth: "300px",
          width: "100%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "90%",
              padding: "8px",
              marginBottom: "16px",
              alignItems: "center",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "90%",
              padding: "8px",
              marginBottom: "16px",
            }}
          />
          <button type="submit" className="buttonlogin">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
