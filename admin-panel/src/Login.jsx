import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from "./config";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // avval xatolikni tozalaymiz

    try {
      const response = await axios.post(`${BASE_API_URL}/auth/login`, {
        username,
        password,
      });

      const token = response.data?.token;
      if (!token) {
        setErrorMessage("Token qaytmadi, backendni tekshiring.");
        return;
      }

      localStorage.setItem("token", token);
      onLogin?.(); // agar o‘tilgan bo‘lsa ishlaydi

      navigate("/"); // ✅ logindan keyin admin dashboardga yo‘naltiramiz
    } catch (err) {
      console.error("❌ Login error:", err);

      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login yoki parol noto‘g‘ri.";

      setErrorMessage(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
        whileHover={{ scale: 1.02 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">
          Admin Login
        </h2>

        {errorMessage && (
          <motion.div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMessage}
          </motion.div>
        )}

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter username"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter password"
            required
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Login
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Login;
