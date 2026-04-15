import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader, CheckCircle } from 'lucide-react';

/**
 * SetPasswordModal Component
 * 
 * Second step of the onboarding flow.
 * Allows user to set a password for shared device access.
 * 
 * This modal IS skippable - users can log in without setting a password.
 */
export default function SetPasswordModal({ 
  userId,
  email,
  onComplete,
  onSkip
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "",
  });

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");

    // Evaluate password strength
    if (field === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    let score = 0;
    let feedback = "";

    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/\d/)) score++;
    if (password.match(/[^a-zA-Z\d]/)) score++;

    if (score === 0) {
      feedback = "Very weak";
    } else if (score === 1) {
      feedback = "Weak";
    } else if (score === 2) {
      feedback = "Fair";
    } else if (score === 3) {
      feedback = "Good";
    } else {
      feedback = "Strong";
    }

    setPasswordStrength({ score, feedback });
  };

  const validateForm = () => {
    if (!form.password) {
      setError("Password is required");
      return false;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("📤 Setting password for user:", userId);

      const response = await fetch("/api/onboarding/set-password", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({
          user_id: userId,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Password set error:", errorData);
        throw new Error(errorData.message || "Failed to set password");
      }

      const data = await response.json();
      console.log("✅ Password set successfully:", data);

      setSuccess(true);

      // Keep a short success confirmation, then continue.
      // setTimeout(() => {
      //   if (onComplete) {
      //     onComplete();
      //   }
      // }, 600);
    } catch (err) {
      console.error("Password set error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Password Set Successfully!
          </h3>
          <p className="text-gray-600">
            You can now log in using this password on shared devices.
          </p>
          <button
            type="button"
            onClick={onComplete}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Set a Password (Optional)
          </h2>
          <p className="text-gray-600">
            This allows you to log in on shared devices without signing in to your Google Account.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength */}
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition ${
                        i <= passwordStrength.score
                          ? i <= 2
                            ? "bg-red-500"
                            : i <= 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  passwordStrength.score <= 2
                    ? "text-red-600"
                    : passwordStrength.score === 3
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}>
                  {passwordStrength.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Match indicator */}
            {form.password && form.confirmPassword && (
              <p className={`text-xs mt-1 ${
                form.password === form.confirmPassword
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {form.password === form.confirmPassword
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Why set a password?</p>
            <ul className="space-y-1 text-xs">
              <li>• Access your account on shared devices</li>
              <li>• No need to sign in to Google Account</li>
              <li>• Faster login for group study sessions</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Skip for Now
            </button>

            <button
              type="submit"
              disabled={isLoading || !form.password || !form.confirmPassword}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Setting..." : "Set Password"}
            </button>
          </div>
        </form>

        {/* Additional Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          You can always set a password later in your account settings.
        </p>
      </div>
    </div>
  );
}
