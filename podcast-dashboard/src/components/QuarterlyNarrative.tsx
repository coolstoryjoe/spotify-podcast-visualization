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
      background: '#FFFFFF',
      border: '1px solid #D4D4D4',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <BookOpen className="w-5 h-5" style={{ color: '#117025' }} />
          <h3 className="text-lg font-semibold" style={{
            fontFamily: '-apple-system, sans-serif',
            color: '#117025',
            letterSpacing: '-0.01em'
          }}>
            {getQuarterLabel()} Narrative
          </h3>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#117025' }} />
            <span className="ml-3 text-sm font-semibold" style={{
              color: '#666',
              fontFamily: '-apple-system, sans-serif'
            }}>
              Generating narrative...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 text-sm font-medium" style={{
            background: '#FFF5F5',
            border: '1px solid #FEE',
            borderRadius: '12px',
            color: '#C53030',
            fontFamily: '-apple-system, sans-serif'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && narrative && (
          <div
            className="prose prose-sm max-w-none"
            style={{
              color: '#0A0A0A',
              fontFamily: '-apple-system, sans-serif',
              lineHeight: '1.7',
              whiteSpace: 'pre-wrap',
              fontSize: '14px'
            }}
          >
            {narrative}
          </div>
        )}

        {!loading && !error && !narrative && (
          <div className="text-center text-sm font-medium py-12" style={{
            color: '#999',
            fontFamily: '-apple-system, sans-serif'
          }}>
            Select a year to generate a narrative for {getQuarterLabel()}
          </div>
        )}

        {!loading && narrative && (
          <button
            onClick={fetchNarrative}
            className="mt-6 px-4 py-2.5 text-sm font-semibold transition-all duration-150"
            style={{
              background: '#FFFFFF',
              color: '#117025',
              border: '2px solid #117025',
              borderRadius: '12px',
              fontFamily: '-apple-system, sans-serif',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#85C093';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#117025';
            }}
          >
            Regenerate Narrative
          </button>
        )}
      </div>
    </div>
  );
}
