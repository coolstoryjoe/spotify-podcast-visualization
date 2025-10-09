'use client';

import { useEffect, useState } from 'react';
import PodcastChart from '@/components/PodcastChart';
import ChatInterface from '@/components/ChatInterface';
import QuarterlyNarrative from '@/components/QuarterlyNarrative';
import { PodcastEntry, YearlyData, QuarterlyData } from '@/types/podcast';
import { processYearlyData, processQuarterlyData, getTopPodcastsByYear, createChartDataQuarterly, formatHours } from '@/utils/dataProcessor';

export default function Dashboard() {
  const [podcastData, setPodcastData] = useState<PodcastEntry[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [quarterlyData, setQuarterlyData] = useState<QuarterlyData[]>([]);
  const [topPodcastsByYear, setTopPodcastsByYear] = useState<{ [year: number]: string[] }>({});
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(1);
  const [selectedPodcasts, setSelectedPodcasts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/spotify_podcast_history.json');
        const data: PodcastEntry[] = await response.json();

        setPodcastData(data);
        const yearly = processYearlyData(data);
        setYearlyData(yearly);

        const quarterly = processQuarterlyData(data);
        setQuarterlyData(quarterly);

        const topByYear = getTopPodcastsByYear(yearly);
        setTopPodcastsByYear(topByYear);

        // Set the most recent year as default
        const mostRecentYear = yearly[yearly.length - 1]?.year;
        setSelectedYear(mostRecentYear);
        setSelectedPodcasts(new Set(topByYear[mostRecentYear] || []));

        setLoading(false);
      } catch (error) {
        console.error('Error loading podcast data:', error);
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fafafa' }}>
        <div className="text-center">
          <div className="animate-spin h-12 w-12 mx-auto mb-6 rounded-full"
               style={{
                 borderWidth: '3px',
                 borderStyle: 'solid',
                 borderColor: '#e5e5e5',
                 borderTopColor: '#0a0a0a'
               }}>
          </div>
          <h2 className="text-2xl font-semibold mb-2" style={{
            fontFamily: 'system-ui, sans-serif',
            color: '#0a0a0a',
            letterSpacing: '-0.02em'
          }}>
            Loading...
          </h2>
          <p className="text-sm font-medium" style={{
            color: '#666',
            fontFamily: 'system-ui, sans-serif'
          }}>
            Preparing your podcast journey
          </p>
        </div>
      </div>
    );
  }

  const chartData = createChartDataQuarterly(quarterlyData, selectedPodcasts);
  const totalHours = podcastData.reduce((sum, entry) => sum + entry.ms_played / (1000 * 60 * 60), 0);
  const totalEpisodes = podcastData.length;
  const uniqueShows = new Set(podcastData.map(entry => entry.episode_show_name)).size;

  return (
    <div className="min-h-screen" style={{
      background: '#fafafa',
      color: '#1a1a1a'
    }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e5e5e5'
      }}>
        <div className="max-w-7xl mx-auto px-12 py-12 text-center">
          <h1 className="text-5xl font-semibold tracking-tight mb-3" style={{
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: '#0a0a0a',
            letterSpacing: '-0.02em'
          }}>
            Podcast Listening Journey
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-12 py-16">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div className="text-center">
              <p className="text-sm font-medium mb-3" style={{
                color: '#666',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.02em'
              }}>
                Time Spent Listening
              </p>
              <p className="text-4xl font-semibold" style={{
                color: '#0a0a0a',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}>
                {formatHours(totalHours)}
              </p>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div className="text-center">
              <p className="text-sm font-medium mb-3" style={{
                color: '#666',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.02em'
              }}>
                Episodes Explored
              </p>
              <p className="text-4xl font-semibold" style={{
                color: '#0a0a0a',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}>
                {totalEpisodes.toLocaleString()}
              </p>
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div className="text-center">
              <p className="text-sm font-medium mb-3" style={{
                color: '#666',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.02em'
              }}>
                Unique Shows
              </p>
              <p className="text-4xl font-semibold" style={{
                color: '#0a0a0a',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '-0.02em'
              }}>
                {uniqueShows}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-16">
          <div style={{
            background: '#ffffff',
            border: '1px solid #e5e5e5',
            borderRadius: '12px',
            padding: '40px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-semibold mb-2" style={{
                  fontFamily: 'system-ui, sans-serif',
                  color: '#0a0a0a',
                  letterSpacing: '-0.02em'
                }}>
                  Quarterly Overview
                </h2>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium" style={{
                  color: '#666',
                  fontFamily: 'system-ui, sans-serif'
                }}>
                  {selectedPodcasts.size} show{selectedPodcasts.size !== 1 ? 's' : ''} selected
                </div>
              </div>
            </div>

            {selectedPodcasts.size > 0 ? (
              <PodcastChart data={chartData} />
            ) : (
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-base font-medium" style={{
                    color: '#999',
                    fontFamily: 'system-ui, sans-serif'
                  }}>
                    Select shows below to visualize your listening journey
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Podcast Selector by Year */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          marginBottom: '64px'
        }}>
          <h3 className="text-2xl font-semibold mb-8" style={{
            fontFamily: 'system-ui, sans-serif',
            color: '#0a0a0a',
            letterSpacing: '-0.02em'
          }}>
            Top Podcasts by Year
          </h3>

          {/* Year Selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            {yearlyData.map(year => (
              <button
                key={year.year}
                onClick={() => {
                  setSelectedYear(year.year);
                  setSelectedPodcasts(new Set(topPodcastsByYear[year.year] || []));
                }}
                className="px-5 py-2.5 font-medium transition-all duration-150"
                style={{
                  background: selectedYear === year.year ? '#0a0a0a' : '#ffffff',
                  color: selectedYear === year.year ? '#ffffff' : '#0a0a0a',
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {year.year}
              </button>
            ))}
          </div>

          {/* Podcast List for Selected Year */}
          {selectedYear && topPodcastsByYear[selectedYear] && (
            <div className="space-y-2">
              {topPodcastsByYear[selectedYear].map((podcast) => {
                const isSelected = selectedPodcasts.has(podcast);
                const totalHoursForPodcast = yearlyData
                  .find(y => y.year === selectedYear)
                  ?.podcasts[podcast] || 0;

                return (
                  <label
                    key={podcast}
                    className="flex items-center space-x-4 cursor-pointer p-4 transition-all duration-150"
                    style={{
                      background: isSelected ? '#f5f5f5' : '#ffffff',
                      border: '1px solid #e5e5e5',
                      borderRadius: '8px'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        const newSelection = new Set(selectedPodcasts);
                        if (newSelection.has(podcast)) {
                          newSelection.delete(podcast);
                        } else {
                          newSelection.add(podcast);
                        }
                        setSelectedPodcasts(newSelection);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className="w-5 h-5 flex items-center justify-center"
                        style={{
                          border: '2px solid #0a0a0a',
                          backgroundColor: isSelected ? '#0a0a0a' : 'transparent',
                          borderRadius: '4px'
                        }}
                      >
                        {isSelected && (
                          <svg className="w-3 h-3" fill="white" viewBox="0 0 8 8">
                            <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <span className="font-medium text-sm" style={{
                          color: '#0a0a0a',
                          fontFamily: 'system-ui, sans-serif'
                        }}>
                          {podcast}
                        </span>
                        <span className="text-sm ml-4" style={{
                          color: '#666',
                          fontFamily: 'system-ui, sans-serif'
                        }}>
                          {formatHours(totalHoursForPodcast)}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <ChatInterface />

          {/* Quarterly Narrative */}
          <div className="space-y-6">
            {selectedYear && (
              <>
                {/* Quarter Selector */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <h4 className="text-sm font-medium mb-4 text-center" style={{
                    fontFamily: 'system-ui, sans-serif',
                    color: '#666'
                  }}>
                    Select Quarter for AI Narrative
                  </h4>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4].map(q => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuarter(q)}
                        className="px-5 py-2.5 font-medium transition-all duration-150"
                        style={{
                          background: selectedQuarter === q ? '#0a0a0a' : '#ffffff',
                          color: selectedQuarter === q ? '#ffffff' : '#0a0a0a',
                          border: '1px solid #e5e5e5',
                          borderRadius: '8px',
                          fontFamily: 'system-ui, sans-serif',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        Q{q}
                      </button>
                    ))}
                  </div>
                </div>

                <QuarterlyNarrative year={selectedYear} quarter={selectedQuarter} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
