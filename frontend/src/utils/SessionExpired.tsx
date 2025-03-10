import React, { useEffect, useState } from 'react';

interface SessionExpiredProps {
  onRedirect?: () => void;
}

const SessionExpired: React.FC<SessionExpiredProps> = ({ onRedirect }) => {
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [countdownInterval, setCountdownIntervalState] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if we're already handling a session expired event
    const sessionExpiredHandled = sessionStorage.getItem('sessionExpiredHandled');
    
    // Clear any existing intervals first
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownIntervalState(null);
    }
    
    // Listen for session expired events
    const handleSessionExpired = () => {
      // Prevent duplicate handling
      if (sessionStorage.getItem('sessionExpiredHandled') === 'true') {
        // If already handled in this session, don't show again
        if (showModal) {
          setShowModal(false);
        }
        return;
      }
      
      console.log('Session expired event received in modal component');
      
      // Mark as handled to prevent multiple modals
      sessionStorage.setItem('sessionExpiredHandled', 'true');
      
      setShowModal(true);
      setCountdown(5); // Reset countdown to 5
      
      // Start countdown - using 1000ms (1 second) for the interval
      const interval = setInterval(() => {
        setCountdown(prevCount => {
          const newCount = prevCount - 1;
          if (newCount <= 0) {
            clearInterval(interval);
            // Don't redirect automatically
          }
          return newCount;
        });
      }, 1000); // 1 second interval
      
      setCountdownIntervalState(interval);
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    
    // Check if we were redirected here due to session expiration
    if (sessionExpiredHandled === 'true' && !showModal) {
      // Show the modal right away
      handleSessionExpired();
    }
    
    return () => {
      window.removeEventListener('auth:session-expired', handleSessionExpired);
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownInterval, showModal]);

  const redirectToLogin = () => {
    // Clean up
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    setShowModal(false);
    
    // Clear the handled flag so we can show the modal again if needed
    sessionStorage.removeItem('sessionExpiredHandled');
    
    if (onRedirect) {
      onRedirect();
    } else {
      // Use a flag to prevent redirect loops
      localStorage.setItem('loginRedirect', 'true');
      window.location.href = '/auth/login?expired=true';
    }
  };
  
  const stayOnPage = () => {
    // Clean up
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
    setShowModal(false);
    
    // Allow future session expired events
    sessionStorage.removeItem('sessionExpiredHandled');
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Session Expired</h2>
        <p className="mb-4">
          Your session has expired due to inactivity. 
          {countdown > 0 ? ` You will be redirected to the login page in ${countdown} seconds.` : ''}
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={stayOnPage}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Stay on Page
          </button>
          <button
            onClick={redirectToLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionExpired;