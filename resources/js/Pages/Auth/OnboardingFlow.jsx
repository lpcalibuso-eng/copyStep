import { useEffect, useState } from 'react';
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
  onOnboardingComplete
}) {
  // DELETE the entire useEffect that fetches /api/onboarding/courses
  // Set loading to false immediately since data comes from props
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { user } = useSupabase();

  const [currentStep, setCurrentStep] = useState('onboarding'); // 'onboarding' | 'password' | 'complete'
  const [courses, setCourses] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  // const [isLoadingData, setIsLoadingData] = useState(true);

  // Fetch courses and institutes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        console.log('📥 Fetching courses and institutes...');

        const [coursesRes, institutesRes] = await Promise.all([
          fetch('/api/onboarding/courses', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }),
          fetch('/api/onboarding/institutes', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }),
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses || []);
          console.log('✅ Courses loaded:', coursesData.courses.length);
        }

        if (institutesRes.ok) {
          const institutesData = await institutesRes.json();
          setInstitutes(institutesData.institutes || []);
          console.log('✅ Institutes loaded:', institutesData.institutes.length);
        }
      } catch (err) {
        console.error('Failed to fetch dropdown data:', err);
      } finally {
        setIsLoadingData(false);
      }
    };

    // Only fetch if profile is not completed
    if (!profileCompleted) {
      fetchData();
    }
  }, [profileCompleted]);

  // If profile is already completed, don't show onboarding
  if (profileCompleted) {
    if (onOnboardingComplete) {
      onOnboardingComplete({ step: 'completed' });
    }
    return null;
  }

  // Loading data
  if (isLoadingData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mx-4 text-center">
          <div className="animate-spin inline-flex items-center justify-center w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
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
