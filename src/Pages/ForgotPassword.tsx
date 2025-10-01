import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import forgotpasswordIllustration from "../assets/images/forgotpassword.png";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [mockToken, setMockToken] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      // TODO: integrate backend endpoint e.g. POST /api/auth/forgot-password
      await new Promise((r) => setTimeout(r, 900));
      // Simulate a token returned by backend
      const generated = Math.random().toString(36).slice(2, 10);
      setMockToken(generated);
      setStatus("sent");
    } catch (err: any) {
      setError("Unable to send reset link. Please try again.");
      setStatus("error");
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError("");
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

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Forgot Password?</h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                {error}
              </div>
            )}
            {status === "sent" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm space-y-2">
                <p className="font-medium">Reset link sent!</p>
                <p>For demo purposes you can proceed directly.</p>
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${mockToken}`)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition-colors"
                >
                  Continue to Reset Password
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
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
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-sm">
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Back to Sign In
              </Link>
            </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden md:block w-1/2 h-full md:h-screen bg-black/90">
        <img
          alt="Forgot password illustration"
          className="h-full w-full object-cover object-center block"
          src={forgotpasswordIllustration}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;