import { useState } from "react";
import axios from "axios";

function Login({ setToken, goToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const token = response.data.access_token;

      localStorage.setItem("token", token);
      setToken(token);

      alert("Login successful 🚀");

    } catch (error) {
      console.error("Login error:", error.response?.data || error);
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <button onClick={goToRegister}>
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;