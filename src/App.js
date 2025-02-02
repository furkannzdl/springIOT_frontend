import React, { useState } from "react";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import InfluxDataFetcher from "./InfluxDataFetcher";

const App = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <h2>Welcome, {user.username}</h2>
          <button onClick={handleLogout} style={{ marginBottom: "20px" }}>Logout</button>
          <InfluxDataFetcher />
        </div>
      ) : (
        <>
          {showRegister ? (
            <RegisterPage onRegisterSuccess={() => setShowRegister(false)} />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )}
          <button 
            onClick={() => setShowRegister(!showRegister)} 
            style={{ marginTop: "10px", display: "block", margin: "auto", padding: "10px", background: "gray", color: "white" }}
          >
            {showRegister ? "Back to Login" : "Go to Register"}
          </button>
        </>
      )}
    </div>
  );
};

export default App;
