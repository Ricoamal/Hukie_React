import { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface LoginPageProps {
  onComplete: () => void;
}

export default function LoginPage({ onComplete }: LoginPageProps) {
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginSuccess = () => {
    onComplete();
  };

  const handleSignupSuccess = () => {
    onComplete();
  };

  const switchToSignup = () => {
    setShowSignup(true);
  };

  const switchToLogin = () => {
    setShowSignup(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-4">
      <div className="w-full max-w-md">
        {showSignup ? (
          <Signup onSuccess={handleSignupSuccess} onLoginClick={switchToLogin} />
        ) : (
          <Login onSuccess={handleLoginSuccess} onSignupClick={switchToSignup} />
        )}
      </div>
    </div>
  );
}
