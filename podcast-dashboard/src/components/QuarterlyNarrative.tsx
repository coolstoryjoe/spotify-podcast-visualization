'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';

interface QuarterlyNarrativeProps {
  year: number;
  quarter: number;
}

export default function QuarterlyNarrative({ year, quarter }: QuarterlyNarrativeProps) {
  const [narrative, setNarrative] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (year && quarter) {
      fetchNarrative();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, quarter]);

  const fetchNarrative = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/narrative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, quarter }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch narrative');
      }

      const data = await response.json();
      setNarrative(data.narrative);
    } catch (err) {
      console.error('Error fetching narrative:', err);
      setError('Unable to generate narrative. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getQuarterLabel = () => {
    return `Q${quarter} ${year}`;
  };

  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid #e5e5e5',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-5 h-5" style={{ color: '#0a0a0a' }} />
          <h3 className="text-lg font-semibold" style={{
            fontFamily: 'system-ui, sans-serif',
            color: '#0a0a0a',
            letterSpacing: '-0.01em'
          }}>
            {getQuarterLabel()} Narrative
          </h3>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#0a0a0a' }} />
            <span className="ml-3 text-sm font-medium" style={{
              color: '#666',
              fontFamily: 'system-ui, sans-serif'
            }}>
              Generating narrative...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 text-sm" style={{
            background: '#fff5f5',
            border: '1px solid #fee',
            borderRadius: '8px',
            color: '#c53030',
            fontFamily: 'system-ui, sans-serif'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && narrative && (
          <div
            className="prose prose-sm max-w-none"
            style={{
              color: '#0a0a0a',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              fontSize: '14px'
            }}
          >
            {narrative}
          </div>
        )}

        {!loading && !error && !narrative && (
          <div className="text-center text-sm py-12" style={{
            color: '#999',
            fontFamily: 'system-ui, sans-serif'
          }}>
            Select a year to generate a narrative for {getQuarterLabel()}
          </div>
        )}

        {!loading && narrative && (
          <button
            onClick={fetchNarrative}
            className="mt-6 px-4 py-2.5 text-sm font-medium transition-all duration-150"
            style={{
              background: '#ffffff',
              color: '#0a0a0a',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontFamily: 'system-ui, sans-serif',
              cursor: 'pointer'
            }}
          >
            Regenerate Narrative
          </button>
        )}
      </div>
    </div>
  );
}
