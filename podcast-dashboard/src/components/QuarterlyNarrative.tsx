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
  }, [year, quarter]);

  const fetchNarrative = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/narrative`, {
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
    <div className="shadow-lg overflow-hidden" style={{
      background: '#F5EFE6',
      border: '2px solid #C4B5A0'
    }}>
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="w-5 h-5" style={{ color: '#8B0000' }} />
          <h3 className="text-xl font-bold" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: '#8B0000'
          }}>
            Narrative: {getQuarterLabel()}
          </h3>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#8B0000' }} />
            <span className="ml-2" style={{
              color: '#6d4c36',
              fontFamily: "'Source Serif Pro', Georgia, serif"
            }}>
              Generating narrative...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 text-sm" style={{
            background: '#FFE4E1',
            border: '1px solid #C4B5A0',
            color: '#8B0000',
            fontFamily: "'Source Serif Pro', Georgia, serif"
          }}>
            {error}
          </div>
        )}

        {!loading && !error && narrative && (
          <div
            className="prose prose-sm max-w-none"
            style={{
              color: '#4a3728',
              fontFamily: "'Source Serif Pro', Georgia, serif",
              lineHeight: '1.8',
              whiteSpace: 'pre-wrap'
            }}
          >
            {narrative}
          </div>
        )}

        {!loading && !error && !narrative && (
          <div className="text-center text-sm italic py-4" style={{ color: '#6d4c36' }}>
            Select a year to generate a narrative for {getQuarterLabel()}
          </div>
        )}

        {!loading && narrative && (
          <button
            onClick={fetchNarrative}
            className="mt-4 px-4 py-2 text-sm font-semibold transition-all duration-200"
            style={{
              background: '#D4C5A9',
              color: '#4a3728',
              border: '2px solid #C4B5A0',
              fontFamily: "'Source Serif Pro', Georgia, serif"
            }}
          >
            Regenerate Narrative
          </button>
        )}
      </div>
    </div>
  );
}
