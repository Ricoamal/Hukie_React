import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // First show the splash screen for 2 seconds
    const timer1 = setTimeout(() => {
      // Then start fading out
      setFadeOut(true);
    }, 2000);

    // After fade out animation (0.5s), complete
    const timer2 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center animate-fade-in">
        <img src="/logo.png" alt="Hukie Logo" className="h-20 w-20 mx-auto" />
        <h1 className="mt-4 text-4xl font-bold text-teal-900">Hukie</h1>
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="h-3 w-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;