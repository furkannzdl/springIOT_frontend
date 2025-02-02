import React, { useState } from "react";
import axios from "axios";

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", null, {
        params: { username, password },
      });

      console.log("Login Response:", response.data);

      // Save user data in local storage (or context)
      localStorage.setItem("user", JSON.stringify(response.data));

      onLoginSuccess(response.data); // Call parent function to update UI

    } catch (error) {
      setErrorMessage("Invalid username or password");
      console.error("Login error:", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" }}>
      <h2>Login</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "blue", color: "white" }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
