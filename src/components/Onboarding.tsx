import { useState } from 'react';
import { Heart, MapPin, Shield, UserCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const screens = [
    {
      title: "Welcome to Hukie",
      description: "Your journey to meaningful connections starts here.",
      icon: <img src="/logo.png" alt="Hukie Logo" className="w-20 h-20 mb-6" />,
      background: "/onboarding_1.png"
    },
    {
      title: "Create Your Profile",
      description: "Tell us about yourself! Create a profile to find matches that suit you.",
      icon: <UserCircle className="w-20 h-20 text-teal-600 mb-3" />,
      background: "/onboarding_2.png"
    },
    {
      title: "Enable Location",
      description: "Enable location services to find matches near you.",
      icon: <MapPin className="w-20 h-20 text-teal-600 mb-3" />,
      background: "/onboarding_3.png"
    },
    {
      title: "Stay Safe",
      description: "Your safety is our priority! Use our check-in feature during meetups.",
      icon: <Shield className="w-20 h-20 text-teal-600 mb-3" />,
      background: "/onboarding_4.png"
    },
    {
      title: "You're All Set!",
      description: "Start exploring and finding your match.",
      icon: <Heart className="w-20 h-20 text-teal-500 mb-3 animate-bounce" />,
      background: "/onboarding_5.png"
    },
  ];

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Complete onboarding and move to login
      console.log('Completing onboarding...');
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  const handleSkip = () => {
    // Complete onboarding and move to login
    console.log('Skipping to login screen...');
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  // fadeOut state is already declared above

  const handleLoginSuccess = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSignupSuccess = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  // If showing login or signup, render those instead of onboarding screens
  if (showLogin) {
    console.log('Rendering login screen');
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-teal-700 flex flex-col items-center justify-center p-4">
        <Login onSuccess={handleLoginSuccess} onSignupClick={switchToSignup} />
      </div>
    );
  }

  if (showSignup) {
    console.log('Rendering signup screen');
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500 to-teal-700 flex flex-col items-center justify-center p-4">
        <Signup onSuccess={handleSignupSuccess} onLoginClick={switchToLogin} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 bg-opacity-70 relative z-10">
        <div
          className="h-full bg-teal-600 transition-all duration-300 shadow-sm"
          style={{ width: `${((currentScreen + 1) / screens.length) * 100}%` }}
        />
      </div>

      {/* Background Image or Color */}
      {screens[currentScreen].background && (
        <div className="absolute inset-0 w-full h-full">
          {typeof screens[currentScreen].background === 'string' && screens[currentScreen].background.startsWith('/') ? (
            <>
              <img
                src={screens[currentScreen].background}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
            </>
          ) : screens[currentScreen].background === 'teal' ? (
            <div className="absolute inset-0 bg-teal-600"></div>
          ) : screens[currentScreen].background === 'light-teal' ? (
            <div className="absolute inset-0 bg-teal-100"></div>
          ) : screens[currentScreen].background === 'teal-gradient' ? (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-teal-700"></div>
          ) : null}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center relative z-10">
        <div className="max-w-md w-full space-y-6 pt-8 pb-6 px-6 sm:pt-10 sm:pb-8 sm:px-8 rounded-2xl flex flex-col items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm shadow-xl">

          <div className="flex justify-center items-center w-full mb-2">
            <div className="flex justify-center items-center">
              {screens[currentScreen].icon}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-5 text-center mx-auto text-teal-600">
            {screens[currentScreen].title}
          </h1>

          <p className="text-lg mb-8 text-center mx-auto max-w-sm text-gray-700">
            {screens[currentScreen].description}
          </p>

          {/* Navigation buttons */}
          <div className="space-y-4 pt-2 w-full max-w-xs mx-auto">
            <button
              onClick={handleNext}
              className="w-full py-3 px-6 rounded-full font-semibold transition-colors shadow-md bg-teal-500 text-white hover:bg-teal-600"
            >
              {currentScreen === screens.length - 1 ? "Get Started" : "Next"}
            </button>

            {currentScreen < screens.length - 1 && (
              <button
                onClick={handleSkip}
                className="w-full py-3 px-6 rounded-full font-semibold transition-all shadow-md bg-white bg-opacity-60 text-teal-700 hover:bg-opacity-80 border border-teal-300"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <div className="flex justify-center space-x-2">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? 'bg-teal-500 w-6'
                  : index < currentScreen
                  ? 'bg-teal-500 opacity-70'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;