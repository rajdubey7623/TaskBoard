import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket
} from "react-icons/fa";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await api.post(
        "/auth/register",
        formData
      );

      setMessage(response.data.message);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-[150px] opacity-20 top-0 left-0"></div>
      <div className="absolute w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 bottom-0 right-0"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10">

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <FaRocket className="text-3xl text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          FocusBoard
        </h1>

        <p className="text-center text-gray-300 mt-3 mb-8">
          Create your account and start managing tasks smarter.
        </p>

        {message && (
          <div
            className={`mb-5 p-3 rounded-xl text-center font-medium ${
              message.toLowerCase().includes("success")
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block mb-2 text-gray-300">
              Full Name
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4">
              <FaUser className="text-cyan-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-4 bg-transparent text-white outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-gray-300">
              Email Address
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4">
              <FaEnvelope className="text-cyan-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-4 bg-transparent text-white outline-none placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-gray-300">
              Password
            </label>

            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4">
              <FaLock className="text-purple-400" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full p-4 bg-transparent text-white outline-none placeholder-gray-500"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="text-gray-400 hover:text-white transition"
              >
                {showPassword
                  ? <FaEyeSlash />
                  : <FaEye />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 transition-all duration-300 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-8">
          Already have an account?

          <Link
            to="/"
            className="text-cyan-400 font-semibold ml-2 hover:text-cyan-300"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}