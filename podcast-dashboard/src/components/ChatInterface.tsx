'use client';

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shadow-lg overflow-hidden flex flex-col" style={{
      background: '#F5EFE6',
      border: '2px solid #C4B5A0',
      height: '500px'
    }}>
      <div className="p-4" style={{ borderBottom: '2px solid #C4B5A0' }}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" style={{ color: '#8B0000' }} />
          <h3 className="text-lg font-bold" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: '#8B0000'
          }}>
            Ask About Your Listening
          </h3>
        </div>
        <p className="text-sm mt-1" style={{
          color: '#6d4c36',
          fontFamily: "'Source Serif Pro', Georgia, serif"
        }}>
          Ask questions about your podcast history
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm italic" style={{ color: '#6d4c36', marginTop: '100px' }}>
            Try asking: &quot;What were my most listened to podcasts?&quot; or &quot;What themes dominated my listening in 2023?&quot;
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] p-3"
              style={{
                background: message.role === 'user' ? '#D4C5A9' : '#FFFFFF',
                border: `1px solid ${message.role === 'user' ? '#8B0000' : '#C4B5A0'}`,
                fontFamily: "'Source Serif Pro', Georgia, serif",
                color: '#4a3728'
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="max-w-[80%] p-3"
              style={{
                background: '#FFFFFF',
                border: '1px solid #C4B5A0',
                fontFamily: "'Source Serif Pro', Georgia, serif",
                color: '#6d4c36'
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4" style={{ borderTop: '2px solid #C4B5A0' }}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2"
            style={{
              background: '#FFFFFF',
              border: '2px solid #C4B5A0',
              color: '#4a3728',
              fontFamily: "'Source Serif Pro', Georgia, serif",
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 font-semibold transition-all duration-200 flex items-center space-x-2"
            style={{
              background: loading || !input.trim() ? '#D4C5A9' : '#8B0000',
              color: '#FFFFFF',
              border: '2px solid #C4B5A0',
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
