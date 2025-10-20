import React, { useState } from "react";
import axios from "axios";

export default function Register({ onRegistered }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8086/api/users/register", form);
      console.log("✅ Registered successfully:", res.data);
      alert("✅ Registration successful! You can now login.");
      onRegistered();
    } catch (err) {
      console.error("❌ Registration failed:", err);
      alert("❌ Something went wrong during registration");
    }
  };

  return (
    <form onSubmit={handleRegister} style={{ padding: 20 }}>
      <h2>Register</h2>
      <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required /><br /><br />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required /><br /><br />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required /><br /><br />
      <button type="submit">Sign Up</button>
    </form>
  );
}
