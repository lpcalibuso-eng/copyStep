import { useState, useEffect } from "react";
import ProfileCompletionModal from "../Components/ProfileCompletionModal";

/**
 * RegistrationFlowWrapper
 * Handles the complete registration flow:
 * 1. User registration via OTP
 * 2. Email verification
 * 3. Profile completion modal
 */
export default function useRegistrationFlow() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  /**
   * Check if user profile is complete
   */
  const checkProfileCompletion = async () => {
    try {
      const response = await fetch("/api/profile/status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
        },
      });

      if (!response.ok) {
        console.log("Not authenticated yet");
        return { profile_completed: false };
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Profile status check error:", err);
      return { profile_completed: false };
    }
  };

  /**
   * Handle OTP verification success
   * Sets user and shows profile completion modal if needed
   */
  const handleOTPVerifySuccess = async (userData) => {
    console.log("✅ OTP verified, user data:", userData);

    setCurrentUser(userData.user);

    // Check if profile needs completion
    if (userData.profile_completed === false) {
      setShowProfileModal(true);
    } else {
      // Profile already complete, redirect to dashboard
      redirectToDashboard(userData.user);
    }
  };

  /**
   * Handle profile completion
   */
  const handleProfileComplete = (completedUserData) => {
    console.log("✅ Profile completed:", completedUserData);
    setShowProfileModal(false);

    // Redirect to appropriate dashboard based on role
    redirectToDashboard(completedUserData.user);
  };

  /**
   * Handle profile completion skip
   */
  const handleProfileSkip = () => {
    console.log("⏭️ Profile completion skipped");
    setShowProfileModal(false);

    // Still redirect to dashboard even if profile not completed
    redirectToDashboard(currentUser);
  };

  /**
   * Redirect to appropriate dashboard based on user role
   */
  const redirectToDashboard = (user) => {
    try {
      if (user?.role?.name === "student") {
        window.location.href = "/dashboard/student";
      } else if (user?.role?.name === "teacher") {
        window.location.href = "/dashboard/adviser";
      } else {
        window.location.href = "/user";
      }
    } catch (err) {
      console.error("Redirect error:", err);
      window.location.href = "/user";
    }
  };

  return {
    currentUser,
    showProfileModal,
    setShowProfileModal,
    checkProfileCompletion,
    handleOTPVerifySuccess,
    handleProfileComplete,
    handleProfileSkip,
  };
}

/**
 * RegistrationFlowProvider Component
 * Wraps the registration UI with profile completion logic
 */
export function RegistrationFlowWrapper({ children, onOTPVerifySuccess }) {
  const {
    currentUser,
    showProfileModal,
    setShowProfileModal,
    handleOTPVerifySuccess,
    handleProfileComplete,
    handleProfileSkip,
  } = useRegistrationFlow();

  const handleOTPSuccess = (userData) => {
    // Call parent handler if provided
    if (onOTPVerifySuccess) {
      onOTPVerifySuccess(userData);
    }
    // Then handle profile flow
    handleOTPVerifySuccess(userData);
  };

  return (
    <>
      {children(handleOTPSuccess)}
      <ProfileCompletionModal
        isOpen={showProfileModal}
        user={currentUser}
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    </>
  );
}
