import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage.jsx';

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

  if (isLoading) {
    return <div className="min-h-screen bg-white"></div>;
  }

  return (
    <>
      {!user ? (
        <LandingPage onUserCreated={handleUserCreated} />
      ) : (
        <div className="min-h-screen bg-gray-100 p-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">Chat with our PC Shop assistant</p>
          {/* Your chatbot content goes here */}
        </div>
      )}
    </>
  );
}
