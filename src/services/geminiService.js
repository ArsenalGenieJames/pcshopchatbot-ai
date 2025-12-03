import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generatePCRecommendation = async (userMessage, pcParts, conversationHistory) => {
  try {
    // Check if API key is configured
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env.local file.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build context for the model with available PC parts
    const partsContext = pcParts.length > 0
      ? `\n\nAvailable PC Parts in our shop:\n${pcParts
          .map(
            (p) =>
              `- ${p.type}: ${p.name} (Specs: ${p.specs}) - Price: $${parseFloat(p.price).toFixed(2)}`
          )
          .join('\n')}`
      : '\n\nNote: No PC parts currently available in the system.';

    const systemPrompt = `You are an expert PC Shop Sales Assistant. You are knowledgeable about PC components, gaming rigs, workstations, and budget builds.

Your role is to:
1. Understand customer needs, budget, and use case (gaming, streaming, editing, work, etc.)
2. Recommend appropriate PC parts and specifications from our inventory
3. Explain technical specifications in an easy-to-understand way
4. Provide honest recommendations based on budget and use case
5. Be friendly, professional, and helpful
6. Ask clarifying questions if needed
7. Suggest complete builds or individual components

${partsContext}

Always respond concisely and engage with customers naturally. Focus on making the best recommendations from our available inventory. If we don't have a specific part in stock, suggest alternatives or ask if they'd like to hear about other options.`;

    // Filter and map conversation history - only include actual user/bot exchanges
    const validHistory = conversationHistory
      .filter(msg => msg.sender && msg.message && msg.id !== 'welcome')
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }],
      }));

    console.log('Valid history for Gemini:', validHistory);
    console.log('User message:', userMessage);

    // Start chat with the model
    const chat = model.startChat({
      history: validHistory,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();
    
    console.log('AI Response:', responseText);
    return responseText;
  } catch (error) {
    console.error('Detailed error generating recommendation:', error);
    
    // Provide specific error messages based on error type
    if (error.message?.includes('API key')) {
      throw new Error('❌ Gemini API key not configured. Check your .env.local file.');
    } else if (error.message?.includes('First content should be with role')) {
      throw new Error('❌ Chat history format error. Try refreshing the page.');
    } else if (error.message?.includes('403') || error.message?.includes('permission')) {
      throw new Error('❌ API key is invalid or does not have permission. Check your Gemini API key.');
    } else if (error.message?.includes('Failed to fetch')) {
      throw new Error('❌ Network error. Check your internet connection.');
    } else if (error.message?.includes('not found') || error.message?.includes('not supported')) {
      throw new Error('❌ Gemini model error. The model may be unavailable. Please try again later.');
    }
    
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};
