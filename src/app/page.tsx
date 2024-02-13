"use client"

import React, { useState, useRef, useEffect } from 'react';

const Home: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const askTheAI = async () => {
    setIsSending(true); // Set sending state to true

    // Append user's message to the conversation history
    setMessages(prevMessages => [...prevMessages, `User: ${inputValue}`]);

    try {
      // Make API call to POST /api/openai
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: inputValue })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response from the server.');
      }

      // Get AI response from the server
      const aiResponse = await response.json();

      // Append AI's message to the conversation history
      setMessages(prevMessages => [...prevMessages, `AI: ${aiResponse.response}`]);
    } catch (error) {
      console.error('Error fetching response from server:', error);
      // Handle error scenario, e.g., display a message to the user
    }

    setIsSending(false); // Set sending state to false after request completes

    // Clear the input field after sending the message
    setInputValue('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {/* Conversation history */}
        <div className="mb-6 h-64 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <div className={`bg-${index % 2 === 0 ? 'gray-200' : 'blue-500'} text-${index % 2 === 0 ? 'gray-700' : 'white'} p-2 rounded-lg ${index % 2 === 0 ? 'self-start' : 'self-end'}`}>
                {message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Textarea and button */}
        <div className="mb-6">
          <textarea 
            className="w-full h-32 p-2 border border-gray-300 rounded-lg mb-2"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea>
          <button 
            className={`w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ${isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSending}
            onClick={askTheAI}
          >
            {isSending ? 'Sending...' : 'Ask the AI'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
