import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import resetIllustration from "../assets/images/reset.png"; // ensure this image exists; otherwise replace path

// NOTE: In a real implementation you'd parse a token from query params and send it with the API request.
// Example: const token = new URLSearchParams(location.search).get('token');

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string>("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Missing or invalid reset token");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      // TODO: POST /api/auth/reset-password { token, password }
      await new Promise((r) => setTimeout(r, 900));
      setStatus("success");
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setStatus("error");
      setError("Unable to reset password. Try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden font-sans">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 py-10 bg-white">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                fill="currentColor"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">AutoCare</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Reset Password</h2>
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            Please enter your new password and confirm it below.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {error}
            </div>
          )}
          {status === "success" && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
              Password reset successful. Redirecting to sign in...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={onChange}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={onChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {status === "loading" ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-6 text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:block w-1/2 h-full md:h-screen bg-black/90">
        <img
          alt="Reset password illustration"
          className="h-full w-full object-cover object-center block"
          src={resetIllustration}
        />
      </div>
    </div>
  );
};

export default ResetPassword;