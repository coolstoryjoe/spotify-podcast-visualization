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
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      height: '500px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="p-6" style={{ borderBottom: '1px solid #e5e5e5' }}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" style={{ color: '#0a0a0a' }} />
          <h3 className="text-lg font-semibold" style={{
            fontFamily: 'system-ui, sans-serif',
            color: '#0a0a0a',
            letterSpacing: '-0.01em'
          }}>
            AI Chat
          </h3>
        </div>
        <p className="text-sm mt-1" style={{
          color: '#666',
          fontFamily: 'system-ui, sans-serif'
        }}>
          Ask questions about your listening history
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-sm" style={{ color: '#999', marginTop: '100px', fontFamily: 'system-ui, sans-serif' }}>
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
                background: message.role === 'user' ? '#f5f5f5' : '#ffffff',
                border: `1px solid #e5e5e5`,
                borderRadius: '8px',
                fontFamily: 'system-ui, sans-serif',
                color: '#0a0a0a',
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
                background: '#f5f5f5',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                fontFamily: 'system-ui, sans-serif',
                color: '#666',
                fontSize: '14px'
              }}
            >
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="p-4" style={{ borderTop: '1px solid #e5e5e5' }}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3"
            style={{
              background: '#fafafa',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              color: '#0a0a0a',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-3 font-medium transition-all duration-150 flex items-center space-x-2"
            style={{
              background: loading || !input.trim() ? '#e5e5e5' : '#0a0a0a',
              color: loading || !input.trim() ? '#999' : '#ffffff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '14px'
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
