'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { PODCAST_COLORS } from '@/utils/dataProcessor';

interface PodcastSelectorProps {
  allPodcasts: string[];
  selectedPodcasts: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
}

export default function PodcastSelector({
  allPodcasts,
  selectedPodcasts,
  onSelectionChange
}: PodcastSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPodcasts = allPodcasts.filter(podcast =>
    podcast.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const togglePodcast = (podcast: string) => {
    const newSelection = new Set(selectedPodcasts);
    if (newSelection.has(podcast)) {
      newSelection.delete(podcast);
    } else {
      newSelection.add(podcast);
    }
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    onSelectionChange(new Set());
  };

  const selectTop10 = () => {
    const top10 = new Set(allPodcasts.slice(0, 10));
    onSelectionChange(top10);
  };

  return (
    <div className="rounded-2xl shadow-lg overflow-hidden" style={{
      background: 'var(--warm-beige)',
      border: '2px solid var(--sand)'
    }}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: 'var(--dark-coffee)'
          }}>
            Choose Your Journey
          </h3>
          <div className="flex gap-3">
            <button
              onClick={selectTop10}
              className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--dark-coffee)',
                border: '1px solid var(--warm-brown)'
              }}
            >
              Top 10
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              style={{
                background: 'var(--sand)',
                color: 'var(--text-primary)',
                border: '1px solid var(--warm-brown)'
              }}
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--warm-brown)' }} />
          <input
            type="text"
            placeholder="Search for your favorite shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-3 rounded-xl border-2 font-serif transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{
              background: 'var(--cream)',
              borderColor: 'var(--sand)',
              color: 'var(--text-primary)',
              fontFamily: "'Source Serif Pro', Georgia, serif"
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--warm-brown)' }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {filteredPodcasts.map((podcast) => {
            const isSelected = selectedPodcasts.has(podcast);
            const colorIndex = allPodcasts.indexOf(podcast) % PODCAST_COLORS.length;

            return (
              <label
                key={podcast}
                className="flex items-center space-x-4 cursor-pointer p-3 rounded-xl transition-all duration-200 hover:shadow-sm transform hover:-translate-y-0.5"
                style={{
                  background: isSelected ? 'var(--sand)' : 'var(--cream)',
                  border: isSelected ? '2px solid var(--warm-brown)' : '1px solid var(--warm-beige)'
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePodcast(podcast)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-4 flex-1">
                  <div
                    className="w-5 h-5 rounded-full border-3 flex items-center justify-center shadow-sm"
                    style={{
                      borderColor: PODCAST_COLORS[colorIndex],
                      backgroundColor: isSelected ? PODCAST_COLORS[colorIndex] : 'transparent',
                      borderWidth: '2px'
                    }}
                  >
                    {isSelected && (
                      <svg className="w-3 h-3" fill="white" viewBox="0 0 8 8">
                        <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-sm truncate font-serif" style={{
                    color: 'var(--text-primary)',
                    fontFamily: "'Source Serif Pro', Georgia, serif"
                  }}>
                    {podcast}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t-2" style={{ borderColor: 'var(--sand)' }}>
          <p className="text-sm font-light italic text-center" style={{
            color: 'var(--text-muted)',
            fontFamily: "'Source Serif Pro', Georgia, serif"
          }}>
            {selectedPodcasts.size} of {allPodcasts.length} voices chosen for your story
          </p>
        </div>
      </div>
    </div>
  );
}