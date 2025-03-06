// components/TokenExpirationWarning.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface TokenExpirationWarningProps {
  showWarningAt?: number; // Show warning when token has this many seconds left (default: 5 minutes)
}

export const TokenExpirationWarning: React.FC<TokenExpirationWarningProps> = ({
  showWarningAt = 300, // 5 minutes in seconds
}) => {
  const { tokenExpiresIn, refreshToken, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show warning if authenticated and expiration time is available
    if (isAuthenticated && tokenExpiresIn !== null) {
      setIsVisible(tokenExpiresIn <= showWarningAt && tokenExpiresIn > 0);
    } else {
      setIsVisible(false);
    }
  }, [tokenExpiresIn, showWarningAt, isAuthenticated]);

  const handleRefresh = async () => {
    const success = await refreshToken();
    if (!success) {
      // Handle failed refresh - maybe show an error message
      console.error('Failed to refresh token');
    }
  };

  if (!isVisible) return null;

  // Format remaining time for display
  const minutes = Math.floor(tokenExpiresIn! / 60);
  const seconds = tokenExpiresIn! % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-md flex items-center z-50">
      <div className="mr-3">
        <p className="font-bold">Session Expiring</p>
        <p className="text-sm">
          Your session will expire in {timeDisplay}. Would you like to stay logged in?
        </p>
      </div>
      <button
        onClick={handleRefresh}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Extend Session
      </button>
    </div>
  );
};