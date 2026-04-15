import { useState } from 'react';
import { AlertCircle, Loader } from 'lucide-react';

/**
 * OnboardingModal Component
 * 
 * First step of the onboarding flow after first-time Google Sign-In.
 * Collects user role and role-specific information.
 * 
 * Not skippable - backdrop prevents closing.
 */
export default function OnboardingModal({
  userId,
  email,
  onComplete,
  courses = [],
  institutes = []
}) {
  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Role-specific fields
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    role: "",
    // Student fields
    student_id: "",
    course_id: "",
    // Professor/Teacher fields
    employee_id: "",
    institute_id: "",
    // Shared field
    phone_number: "",
  });

  const handleRoleSelect = (selectedRole) => {
    setForm({
      ...form,
      role: selectedRole,
      // Clear role-specific fields when role changes
      student_id: "",
      course_id: "",
      employee_id: "",
      institute_id: "",
    });
    setError("");
    setStep(2); // Move to step 2
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setError("");
  };

  const handleBack = () => {
    setStep(1);
    setForm({ ...form, role: "" });
    setError("");
  };

  const validateForm = () => {
    // Common validation
    if (!form.role) {
      setError("Please select a role");
      return false;
    }

    // Student validation
    if (form.role === "student") {
      if (!form.student_id) {
        setError("Student ID is required");
        return false;
      }
      if (!form.course_id) {
        setError("Course is required");
        return false;
      }
    }

    // Teacher validation
    if (form.role === "teacher") {
      if (!form.employee_id) {
        setError("Employee ID is required");
        return false;
      }
      if (!form.institute_id) {
        setError("Institute is required");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      console.log("📤 Submitting onboarding data:", {
        userId,
        email,
        ...form,
      });

      const response = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content,
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
          role: form.role,
          student_id: form.role === "student" ? form.student_id : null,
          course_id: form.role === "student" ? form.course_id : null,
          employee_id: form.role === "teacher" ? form.employee_id : null,
          institute_id: form.role === "teacher" ? form.institute_id : null,
          phone_number: form.phone_number || null,
        }),
      });

      // Ensure response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ Non-JSON response:", response.status, text);
        throw new Error(`Server returned an unexpected response (${response.status}). Please try again.`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Onboarding error:", errorData);
        throw new Error(errorData.message || "Failed to complete onboarding");
      }

      const data = await response.json();
      console.log("✅ Onboarding completed:", data);

      // Call the callback to show the password modal or redirect
      if (onComplete) {
        onComplete(data);
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Role Selection
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to STEP!
            </h2>
            <p className="text-gray-600">
              Let's set up your account. First, tell us your role.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Role Selection Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => handleRoleSelect("student")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left"
            >
              <p className="font-semibold text-gray-900">Student</p>
              <p className="text-sm text-gray-600">I'm a student at the institution</p>
            </button>

            <button
              onClick={() => handleRoleSelect("teacher")}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition text-left"
            >
              <p className="font-semibold text-gray-900">Professor / Teacher</p>
              <p className="text-sm text-gray-600">I'm a faculty member or adviser</p>
            </button>
          </div>

          {/* Info */}
          <p className="text-center text-xs text-gray-500 mt-6">
            You cannot skip this step. We need to know your role to set up your account properly.
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Role-Specific Information
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h2>
          <p className="text-gray-600">
            {form.role === "student"
              ? "Tell us about your student information"
              : "Tell us about your faculty information"}
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
          {/* Student Fields */}
          {form.role === "student" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., STU001"
                  value={form.student_id}
                  onChange={(e) => handleInputChange("student_id", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.course_id}
                  onChange={(e) => handleInputChange("course_id", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select your course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Professor/Teacher Fields */}
          {form.role === "teacher" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., EMP001"
                  value={form.employee_id}
                  onChange={(e) => handleInputChange("employee_id", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Institute <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.institute_id}
                  onChange={(e) => handleInputChange("institute_id", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Select your institute</option>
                  {institutes.map((institute) => (
                    <option key={institute.id} value={institute.id}>
                      {institute.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Shared: Phone Number (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="tel"
              placeholder="e.g., 09xxxxxxxxx"
              value={form.phone_number}
              onChange={(e) => handleInputChange("phone_number", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-4 h-4 animate-spin" />}
              {isLoading ? "Setting up..." : "Continue"}
            </button>
          </div>
        </form>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-4">
          This information helps us organize the system properly.
        </p>
      </div>
    </div>
  );
}
