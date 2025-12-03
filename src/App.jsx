import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage on mount
    const savedUserId = localStorage.getItem('userId');
    const savedUserName = localStorage.getItem('userName');
    
    if (savedUserId && savedUserName) {
      setUser({ id: savedUserId, name: savedUserName });
    }
    
    setIsLoading(false);
  }, []);

  const handleUserCreated = (userData) => {
    setUser(userData);
    // Store user ID in localStorage for persistence
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userName', userData.name);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <LandingPage onUserCreated={handleUserCreated} />
      ) : (
        <ChatbotPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
}
