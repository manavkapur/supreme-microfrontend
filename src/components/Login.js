import React, { useState } from "react";
import axios from "axios";

export default function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8086/api/users/login", {
        email,
        password,
      });

      const { token, userId, email: userEmail } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userId", userId);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      alert("✅ Login successful!");
      onLogin(userEmail);
    } catch (err) {
      console.error("❌ Login failed:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button type="submit">Login</button>
      <p style={{ marginTop: 10 }}>
        Don’t have an account?{" "}
        <span
          onClick={onSwitchToRegister}
          style={{ color: "#007bff", cursor: "pointer" }}
        >
          Register here
        </span>
      </p>
    </form>
  );
}
