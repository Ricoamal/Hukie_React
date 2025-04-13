import { useState } from 'react';
import { X, Users, Shield, Check, AlertCircle } from 'lucide-react';

interface ContactsPermissionModalProps {
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export default function ContactsPermissionModal({ onClose, onAllow, onDeny }: ContactsPermissionModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAllow = () => {
    setStatus('loading');
    
    // Simulate permission request
    setTimeout(() => {
      try {
        // In a real app, this would use the Contacts API
        // For demo purposes, we'll simulate success
        setStatus('success');
        
        // Notify parent component after a short delay
        setTimeout(() => {
          onAllow();
        }, 1000);
      } catch (error) {
        setStatus('error');
        setErrorMessage('Failed to access contacts. Please try again.');
      }
    }, 1500);
  };

  const handleDeny = () => {
    onDeny();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {status === 'idle' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Access Contacts</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-teal-600" />
              </div>
              
              <p className="text-gray-700 mb-4 text-center">
                Hukie would like to access your contacts to help you connect with friends and send gifts.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Shield size={16} className="text-teal-600 mr-2" />
                  Privacy Information
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>Your contacts will only be used within the app</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>We will never share your contacts with third parties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-teal-500 mr-2">•</span>
                    <span>You can revoke access at any time in settings</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                onClick={handleDeny}
              >
                Deny
              </button>
              <button
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                onClick={handleAllow}
              >
                Allow Access
              </button>
            </div>
          </>
        )}
        
        {status === 'loading' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Requesting Access</h3>
            <p className="text-gray-600">Please wait while we request access to your contacts...</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access Granted</h3>
            <p className="text-gray-600">You've successfully granted access to your contacts.</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex space-x-3">
              <button
                className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
