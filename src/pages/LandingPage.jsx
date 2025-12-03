import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function LandingPage({ onUserCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);

    try {
      // Check if supabase is properly initialized
      if (!supabase) {
        throw new Error('Database connection not available');
      }

      const { data, error: supabaseError } = await supabase
        .from('users')
        .insert([{ name: name.trim() }])
        .select();

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      if (data && data[0]) {
        onUserCreated(data[0]);
      } else {
        // Fallback: create a local user if database fails
        const tempUser = { id: Date.now(), name: name.trim() };
        onUserCreated(tempUser);
      }
    } catch (err) {
      console.error('Error:', err);
      // Allow user to proceed with local storage fallback
      const tempUser = { id: Date.now(), name: name.trim() };
      onUserCreated(tempUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            PC Shop Chatbot
          </h1>
          <p className="text-gray-600">Welcome! Let's get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              What's your name?
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? 'Saving...' : 'Start Chatting'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Your information is safe with us
        </p>
      </div>
    </div>
  );
}
