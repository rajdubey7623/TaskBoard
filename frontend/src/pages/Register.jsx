import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
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

      const response = await api.post("/auth/register", formData);

      setMessage(response.data.message);

      // Clear the form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to Login page after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          Join TaskFlow today.
        </p>
        {message && (
  <div
    className={`mb-4 p-3 rounded-lg text-center font-medium ${
      message.toLowerCase().includes("success")
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-red-100 text-red-700 border border-red-300"
    }`}
  >
    {message}
  </div>
)}
        

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-2 font-medium">Full Name</label>

            <div className="flex items-center border rounded-lg px-3">
              <FaUser className="text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <div className="flex items-center border rounded-lg px-3">
              <FaEnvelope className="text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">Password</label>

            <div className="flex items-center border rounded-lg px-3">
              <FaLock className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="w-full p-3 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6">
          Already have an account?
          <Link to="/" className="text-indigo-600 font-semibold ml-2">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}