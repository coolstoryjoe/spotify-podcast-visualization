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
      const response = await fetch('/api/chat', {
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
    <div className="flex flex-col" style={{
      background: '#FFFFFF',
      border: '1px solid #D4D4D4',
      borderRadius: '16px',
      height: '500px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div className="p-6" style={{ borderBottom: '1px solid #D4D4D4' }}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" style={{ color: '#117025' }} />
          <h3 className="text-lg font-semibold" style={{
            fontFamily: '-apple-system, sans-serif',
            color: '#117025',
            letterSpacing: '-0.01em'
          }}>
            AI Chat
          </h3>
        </div>
        <p className="text-sm mt-1 font-medium" style={{
          color: '#666',
          fontFamily: '-apple-system, sans-serif'
        }}>
          Ask questions about your listening history
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm font-medium" style={{ color: '#999', marginTop: '100px', fontFamily: '-apple-system, sans-serif' }}>
            Try asking: &quot;What were my most listened to podcasts?&quot;
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className="max-w-[80%] p-4"
              style={{
                background: message.role === 'user' ? '#85C093' : '#F5F5F5',
                border: `1px solid ${message.role === 'user' ? '#117025' : '#D4D4D4'}`,
                borderRadius: '12px',
                fontFamily: '-apple-system, sans-serif',
                color: message.role === 'user' ? '#FFFFFF' : '#0A0A0A',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
            >
              {message.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="max-w-[80%] p-4"
              style={{
                background: '#F5F5F5',
                border: '1px solid #D4D4D4',
                borderRadius: '12px',
                fontFamily: '-apple-system, sans-serif',
                color: '#666',
                fontSize: '14px'
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4" style={{ borderTop: '1px solid #D4D4D4' }}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3"
            style={{
              background: '#F5F5F5',
              border: '2px solid #D4D4D4',
              borderRadius: '12px',
              color: '#0A0A0A',
              fontFamily: '-apple-system, sans-serif',
              fontSize: '14px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#117025'}
            onBlur={(e) => e.target.style.borderColor = '#D4D4D4'}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-3 font-semibold transition-all duration-150 flex items-center space-x-2"
            style={{
              background: loading || !input.trim() ? '#D4D4D4' : '#117025',
              color: loading || !input.trim() ? '#999' : '#FFFFFF',
              border: '2px solid ' + (loading || !input.trim() ? '#D4D4D4' : '#117025'),
              borderRadius: '12px',
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily: '-apple-system, sans-serif',
              fontSize: '14px'
            }}
            onMouseOver={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.background = '#0d5a1f';
              }
            }}
            onMouseOut={(e) => {
              if (!loading && input.trim()) {
                e.currentTarget.style.background = '#117025';
              }
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
