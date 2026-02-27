import React, { useState } from "react";
import axios from "axios";

function Register({ onRegisterSuccess, goToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful 🎉 Please login");
      goToLogin();

    } catch (err) {
      console.error("Register error:", err.response?.data || err);
      alert("Registration failed. Email may already exist.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <button onClick={goToLogin}>Login</button>
      </p>
    </div>
  );
}

export default Register;