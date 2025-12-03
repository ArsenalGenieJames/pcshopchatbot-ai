import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { generatePCRecommendation } from '../services/geminiService';

export default function ChatbotPage({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [pcParts, setPcParts] = useState([]);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Initialize conversation and fetch PC parts
  useEffect(() => {
    initializeConversation();
    fetchPcParts();
  }, [user.id]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeConversation = async () => {
    try {
      const { data, error: err } = await supabase
        .from('conversations')
        .insert([{ user_id: user.id }])
        .select();

      if (err) {
        console.error('Error creating conversation:', err);
        setError('Failed to start conversation');
        return;
      }

      if (data && data[0]) {
        setConversationId(data[0].id);
        // Add welcome message from chatbot
        const welcomeMessage = {
          id: 'welcome',
          sender: 'bot',
          message: `Hi ${user.name}! 👋 I'm your PC Shop Sales Assistant. I'm here to help you find the perfect PC components and parts based on your needs. What are you looking for today? (Gaming PC, Workstation, Budget Build, etc.)`,
        };
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to initialize conversation');
    }
  };

  const fetchPcParts = async () => {
    try {
      const { data, error: err } = await supabase
        .from('pc_parts')
        .select('*');

      if (err) {
        console.error('Error fetching PC parts:', err);
        return;
      }

      if (data) {
        setPcParts(data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const generateRecommendation = async (userMessage) => {
    try {
      // Filter out the welcome message and only send actual user/bot exchanges
      const historyForAI = messages.filter(m => m.id !== 'welcome' && m.sender !== undefined);
      const aiResponse = await generatePCRecommendation(userMessage, pcParts, historyForAI);
      return aiResponse;
    } catch (err) {
      console.error('Error generating response:', err);
      throw err;
    }
  };

  const saveMessage = async (message, sender) => {
    try {
      if (!conversationId) return;

      await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender: sender,
            message: message,
          },
        ]);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading || !conversationId) {
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message to UI
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      message: userMessage,
    }]);

    // Save user message to database
    await saveMessage(userMessage, 'user');

    setLoading(true);
    setError('');

    try {
      // Generate AI response
      const aiResponse = await generateRecommendation(userMessage);

      // Add AI message to UI
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        message: aiResponse,
      }]);

      // Save AI message to database
      await saveMessage(aiResponse, 'bot');
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.message || 'Failed to get response';
      setError(errorMessage);
      
      // Show error message to user
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        message: errorMessage,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">PC Shop Assistant</h1>
            <p className="text-blue-100 text-sm">Welcome, {user.name}! 👋</p>
          </div>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm md:text-base break-words">{msg.message}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto w-full px-4 mb-2">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about PC components, builds, or recommendations..."
              disabled={loading || !conversationId}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading || !conversationId || !input.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
