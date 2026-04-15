import { useState } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import OnboardingModal from './OnboardingModal';
import SetPasswordModal from './SetPasswordModal';

/**
 * OnboardingFlow Component
 * 
 * Manages the complete onboarding flow after Google Sign-In:
 * 1. Check if user profile is incomplete
 * 2. Show role selection modal (mandatory)
 * 3. Show password setup modal (optional/skippable)
 * 4. Redirect to dashboard
 * 
 * Usage: Wrap this in OAuthCallback or as a separate route check
 */
// export default function OnboardingFlow({ 
//   userId, 
//   email,
//   profileCompleted = false,
//   onOnboardingComplete 
// }) {
export default function OnboardingFlow({
  userId,
  email,
  courses = [],    // Received from OAuthCallback
  institutes = [], // Received from OAuthCallback
  profileCompleted = false,
  onOnboardingComplete
}) {
  const { user } = useSupabase();

  const [currentStep, setCurrentStep] = useState('onboarding'); // 'onboarding' | 'password' | 'complete'

  // If profile is already completed, don't show onboarding
  if (profileCompleted) {
    if (onOnboardingComplete) {
      onOnboardingComplete({ step: 'completed' });
    }
    return null;
  }

  // Step 1: Onboarding modal (role selection + details)
  if (currentStep === 'onboarding') {
    return (
      <OnboardingModal
        userId={userId}
        email={email}
        courses={courses}
        institutes={institutes}
        onComplete={(data) => {
          console.log('✅ Onboarding modal completed:', data);
          // Move to password setup step
          setCurrentStep('password');
        }}
      />
    );
  }

  // Step 2: Password setup modal (optional)
  if (currentStep === 'password') {
    return (
      <SetPasswordModal
        userId={userId}
        email={email}
        onComplete={() => {
          console.log('✅ Password modal completed');
          setCurrentStep('complete');
          // Trigger the callback or redirect
          if (onOnboardingComplete) {
            onOnboardingComplete({ step: 'completed' });
          }
        }}
        onSkip={() => {
          console.log('⏭️  Password modal skipped');
          setCurrentStep('complete');
          // Trigger the callback or redirect
          if (onOnboardingComplete) {
            onOnboardingComplete({ step: 'completed' });
          }
        }}
      />
    );
  }

  // Step 3: Completed (component will unmount or redirect happens)
  return null;
}
