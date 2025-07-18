import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import medibot_logo from "../assets/medibot_logo.jpg";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError("");

      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Navigate to chat page instead of dashboard
      navigate("/chat");
    } catch (error) {
      console.error("Error signing in:", error);
      // Handle error cases
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError("");

      // Sign in with Google - no need to store result if unused
      await signInWithPopup(auth, googleProvider);

      // Navigate to chat page instead of dashboard
      navigate("/chat");
    } catch (error) {
      // Handle errors
      setError("Failed to sign in with Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-[#121212] to-[#1a1a1a]">
      {/* Background pattern */}
      <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 800"
        >
          <circle
            cx="400"
            cy="400"
            r="350"
            stroke="#6366f1"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="400"
            cy="400"
            r="250"
            stroke="#6366f1"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="400"
            cy="400"
            r="150"
            stroke="#6366f1"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-white p-2 shadow-lg">
            <img
              className="h-full w-full rounded-full object-cover"
              src={medibot_logo}
              alt="Medibot"
            />
          </div>
        </div>
        <h2
          className="mt-6 text-center text-3xl font-extrabold"
          style={{ color: "#6366f1" }}
        >
          Welcome Back
        </h2>
        <p
          id="login-heading"
          className="mt-2 text-center text-sm"
          style={{ color: "#d6d4d4" }}
        >
          Sign in to your Medibot account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1a1a1a] py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-[#2a2a2a]">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            aria-labelledby="login-heading"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium"
                style={{ color: "#d6d4d4" }}
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5"
                    style={{ color: "#818cf8" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  aria-required="true"
                  aria-labelledby="email-label"
                  aria-describedby="email-desc"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium flex justify-between"
                style={{ color: "#d6d4d4" }}
              >
                <span>Password</span>
                <Link
                  to="/forgot-password"
                  className="text-[#6366f1] hover:text-[#4f46e5] font-medium text-sm transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5"
                    style={{ color: "#818cf8" }}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  aria-required="true"
                  aria-labelledby="password-label"
                  aria-describedby="password-desc"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#2a2a2a] bg-[#121212] rounded-md shadow-sm placeholder-gray-500 text-[#d6d4d4] focus:ring-[#6366f1] focus:border-[#6366f1]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  aria-checked="false"
                  aria-labelledby="remember-me-label"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#6366f1] focus:ring-[#6366f1] border-[#2a2a2a] rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm"
                  style={{ color: "#d6d4d4" }}
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg bg-[#6366f1] text-[#d6d4d4] font-medium text-sm hover:bg-[#4f46e5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1] transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2a2a]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1a1a1a] text-[#d6d4d4]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-[#2a2a2a] rounded-md shadow-sm bg-[#121212] text-sm font-medium text-[#d6d4d4] hover:bg-[#232323] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366f1] transition-colors"
              >
                {isGoogleLoading ? (
                  <>
                    <svg
                      className="animate-spin mr-2 h-5 w-5 text-[#6366f1]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      className="mr-2"
                      viewBox="0 0 48 48"
                    >
                      <g>
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        ></path>
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        ></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </g>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sign up link */}
        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: "#d6d4d4" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Return to home link */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-[#d6d4d4] hover:text-[#6366f1] transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Signin;
