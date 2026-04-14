import { useState, useEffect } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function VerifyOTPPage({ email, onVerifySuccess, onBackToRegister }) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!otp || otp.length < 6) {
        throw new Error("Please enter a valid 6-digit OTP code.");
      }

      // Call backend to verify OTP
      const response = await fetch("/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "OTP verification failed. Please try again.");
      }

      const data = await response.json();
      setSuccess("OTP verified successfully! Redirecting...");
      
      // Wait a moment then redirect
      setTimeout(() => {
        if (onVerifySuccess) {
          onVerifySuccess(data);
        } else {
          window.location.href = "/user";
        }
      }, 1500);
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/otp/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to resend OTP. Please try again.");
      }

      setSuccess("OTP code sent successfully! Check your email.");
      setResendCooldown(60);
      setOtp("");
    } catch (err) {
      setError(err.message || "Failed to resend OTP.");
      console.error("Resend OTP error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL */}
      <div className="hidden md:flex w-2/5 bg-gradient-to-br from-[#155DFC] to-[#193CB8] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-medium mb-1">Welcome to STEP</h1>
          <p className="text-lg">Verify your email address</p>

          <div className="relative z-10 mt-10 flex justify-center">
            <div className="mt-20 space-y-4 w-1/2">
              <h2 className="text-4xl font-semibold leading-tight">
                Verify.<br />
                Secure.<br />
                Trusted.
              </h2>
              <p className="text-white/80 max-w-md">
                We've sent a verification code to your email. Enter it below to complete registration.
              </p>
            </div>

            <div className="gap-2 overflow-hidden">
              <img
                src="/images/login-bg.png"
                alt="Verify Background"
                className="w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center bg-[#F5F6F8] p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-10">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-20 overflow-hidden px-2">
              <img
                src="/images/Logo.png"
                alt="Step Logo"
                className="w-full object-cover"
              />
            </div>
          </div>

          <h2 className="text-center text-2xl text-gray-800 mb-2">
            Verify Your Email
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            We've sent a 6-digit code to <strong>{email}</strong>
          </p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-sm text-green-600 rounded-lg">
              {success}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            {/* OTP Input */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Verification Code
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full h-10 pl-9 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-200 outline-none transition text-center text-2xl tracking-widest font-mono"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className={`w-full h-10 rounded-xl text-white font-medium transition ${
                isLoading || otp.length < 6
                  ? "opacity-60 cursor-not-allowed pointer-events-none"
                  : ""
              }`}
              style={{
                background:
                  isLoading || otp.length < 6
                    ? "#ccc"
                    : "linear-gradient(90deg, #2563EA 0%, #1E3A8A 100%)",
              }}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Resend OTP */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading || resendCooldown > 0}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : "Resend OTP Code"}
            </button>
          </div>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBackToRegister}
            className="flex items-center justify-center gap-2 w-full mt-6 text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} />
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
}
