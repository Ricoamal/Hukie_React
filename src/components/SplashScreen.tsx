import { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [splashActive, setSplashActive] = useState(false);

  useEffect(() => {
    // Start the splash animation after a short delay
    const splashStartTimer = setTimeout(() => {
      setSplashActive(true);
    }, 100);

    // Start fading out after 2.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Complete after fade out animation (0.5s)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(splashStartTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center transition-opacity duration-500 overflow-hidden relative ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Teal color splash animation */}
      {splashActive && (
        <div
          className="absolute rounded-full bg-gradient-to-br from-teal-400 to-teal-600 splash-circle"
          style={{
            width: '300vw',
            height: '300vw',
            maxWidth: '2000px',
            maxHeight: '2000px',
            zIndex: 0
          }}
        ></div>
      )}

      {/* Logo and content */}
      <div className="text-center z-10 relative">
        <img
          src="/logo.png"
          alt="Hukie Logo"
          className="h-24 w-24 mx-auto relative z-10 drop-shadow-lg splash-logo"
        />
        <h1 className="mt-4 text-4xl font-bold text-white drop-shadow-md animate-fade-in" style={{ animationDelay: '300ms' }}>Hukie</h1>
        <div className="mt-6 flex justify-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-3 w-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;