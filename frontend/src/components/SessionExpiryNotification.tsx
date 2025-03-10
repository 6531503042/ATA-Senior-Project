// src/components/SessionExpiryNotification.tsx
import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/api/auth';

const formatTimeRemaining = (ms: number): string => {
  if (ms <= 0) return 'Expired';
  
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

const SessionExpiryNotification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  useEffect(() => {
    const checkTokenExpiration = () => {
      if (auth.isAuthenticated()) {
        const remaining = auth.getTimeUntilExpiration();
        setTimeRemaining(remaining);
        
        // Show notification if less than 5 minutes remaining
        const fiveMinutes = 5 * 60 * 1000;
        if (remaining !== null && remaining < fiveMinutes && remaining > 0) {
          setShowNotification(true);
        } else {
          setShowNotification(false);
        }
      } else {
        setShowNotification(false);
      }
    };
    
    // Check immediately and then every 30 seconds
    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 30000);
    
    // Listen for session expired event from axios interceptor
    const handleSessionExpired = () => {
      setShowNotification(false);
    };
    
    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);
  
  const handleExtendSession = async () => {
    try {
      const success = await auth.refreshToken();
      if (success) {
        setShowNotification(false);
      }
    } catch (error) {
      console.error('Failed to extend session:', error);
    }
  };
  
  if (!showNotification || timeRemaining === null) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-md border border-orange-200 z-50">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-orange-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-medium text-gray-800">Session Expiring Soon</h3>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setShowNotification(false)}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          Your session will expire in{' '}
          <span className="font-medium text-orange-600">
            {formatTimeRemaining(timeRemaining)}
          </span>
          . Would you like to extend your session?
        </p>
        
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800"
            onClick={() => setShowNotification(false)}
          >
            Dismiss
          </button>
          <button
            className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleExtendSession}
          >
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiryNotification;