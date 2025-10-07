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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#E8DCC8' }}>
        <div className="text-center">
          <div className="animate-spin h-20 w-20 mx-auto mb-8"
               style={{
                 borderWidth: '4px',
                 borderStyle: 'solid',
                 borderColor: '#D4C5A9',
                 borderBottomColor: '#8B4513'
               }}>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: '#8B0000'
          }}>
            Preparing Your Journey
          </h2>
          <p className="font-light italic text-lg" style={{
            color: '#6d4c36',
            fontFamily: "'Source Serif Pro', Georgia, serif"
          }}>
            Gathering the voices that shaped your days...
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
      background: 'linear-gradient(135deg, #E8DCC8 0%, #D4C5A9 100%)',
      backgroundAttachment: 'fixed',
      color: '#4a3728'
    }}>
      {/* Header */}
      <header className="border-b-2" style={{ borderColor: '#C4B5A0' }}>
        <div className="max-w-6xl mx-auto px-8 py-8 text-center">
          <h1 className="text-5xl font-bold tracking-wide" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: '#8B0000',
            fontWeight: '900'
          }}>
            Podcast Listening Journey
          </h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="shadow-lg overflow-hidden" style={{
            background: '#F5EFE6',
            border: '2px solid #C4B5A0'
          }}>
            <div className="p-8">
              <div className="text-center">
                <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                  color: '#6d4c36',
                  fontFamily: "'Source Serif Pro', Georgia, serif"
                }}>
                  Time Spent Listening
                </p>
                <p className="text-3xl font-bold" style={{
                  color: '#4a3728',
                  fontFamily: "'Crimson Text', Georgia, serif"
                }}>
                  {formatHours(totalHours)}
                </p>
              </div>
            </div>
          </div>

          <div className="shadow-lg overflow-hidden" style={{
            background: '#F5EFE6',
            border: '2px solid #C4B5A0'
          }}>
            <div className="p-8">
              <div className="text-center">
                <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                  color: '#6d4c36',
                  fontFamily: "'Source Serif Pro', Georgia, serif"
                }}>
                  Episodes Explored
                </p>
                <p className="text-3xl font-bold" style={{
                  color: '#4a3728',
                  fontFamily: "'Crimson Text', Georgia, serif"
                }}>
                  {totalEpisodes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="shadow-lg overflow-hidden" style={{
            background: '#F5EFE6',
            border: '2px solid #C4B5A0'
          }}>
            <div className="p-8">
              <div className="text-center">
                <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                  color: '#6d4c36',
                  fontFamily: "'Source Serif Pro', Georgia, serif"
                }}>
                  Unique Voices
                </p>
                <p className="text-3xl font-bold" style={{
                  color: '#4a3728',
                  fontFamily: "'Crimson Text', Georgia, serif"
                }}>
                  {uniqueShows}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-12">
          <div className="shadow-lg overflow-hidden" style={{
            background: '#F5EFE6',
            border: '2px solid #C4B5A0'
          }}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{
                    fontFamily: "'Crimson Text', Georgia, serif",
                    color: '#8B0000'
                  }}>
                    Quarterly Listening Overview
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold" style={{ color: '#6d4c36' }}>
                    Showing {selectedPodcasts.size} show{selectedPodcasts.size !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {selectedPodcasts.size > 0 ? (
                <PodcastChart data={chartData} />
              ) : (
                <div className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-light italic" style={{ color: '#6d4c36' }}>
                      Choose your voices to see the story unfold...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Podcast Selector by Year */}
        <div className="shadow-lg overflow-hidden" style={{
          background: '#F5EFE6',
          border: '2px solid #C4B5A0'
        }}>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-center" style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              color: '#8B0000'
            }}>
              Top 10 Podcasts by Year
            </h3>

            {/* Year Selector */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {yearlyData.map(year => (
                <button
                  key={year.year}
                  onClick={() => {
                    setSelectedYear(year.year);
                    setSelectedPodcasts(new Set(topPodcastsByYear[year.year] || []));
                  }}
                  className="px-6 py-2 font-semibold transition-all duration-200"
                  style={{
                    background: selectedYear === year.year ? '#8B0000' : '#D4C5A9',
                    color: selectedYear === year.year ? '#FFFFFF' : '#4a3728',
                    border: '2px solid #C4B5A0',
                    fontFamily: "'Source Serif Pro', Georgia, serif"
                  }}
                >
                  {year.year}
                </button>
              ))}
            </div>

            {/* Podcast List for Selected Year */}
            {selectedYear && topPodcastsByYear[selectedYear] && (
              <div className="space-y-3">
                {topPodcastsByYear[selectedYear].map((podcast) => {
                  const isSelected = selectedPodcasts.has(podcast);
                  const totalHoursForPodcast = yearlyData
                    .find(y => y.year === selectedYear)
                    ?.podcasts[podcast] || 0;

                  return (
                    <label
                      key={podcast}
                      className="flex items-center space-x-4 cursor-pointer p-3 transition-all duration-200"
                      style={{
                        background: isSelected ? '#D4C5A9' : '#FFFFFF',
                        border: isSelected ? '2px solid #8B0000' : '1px solid #C4B5A0'
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
                            border: '2px solid #8B0000',
                            backgroundColor: isSelected ? '#8B0000' : 'transparent'
                          }}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3" fill="white" viewBox="0 0 8 8">
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm font-serif" style={{
                            color: '#4a3728',
                            fontFamily: "'Source Serif Pro', Georgia, serif"
                          }}>
                            {podcast}
                          </span>
                          <span className="text-xs ml-2" style={{ color: '#6d4c36' }}>
                            ({formatHours(totalHoursForPodcast)})
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          {/* Chat Interface */}
          <ChatInterface />

          {/* Quarterly Narrative */}
          <div className="space-y-4">
            {selectedYear && (
              <>
                {/* Quarter Selector */}
                <div className="shadow-lg overflow-hidden p-4" style={{
                  background: '#F5EFE6',
                  border: '2px solid #C4B5A0'
                }}>
                  <h4 className="text-sm font-bold mb-3 text-center" style={{
                    fontFamily: "'Crimson Text', Georgia, serif",
                    color: '#8B0000'
                  }}>
                    Select Quarter for Narrative
                  </h4>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4].map(q => (
                      <button
                        key={q}
                        onClick={() => setSelectedQuarter(q)}
                        className="px-4 py-2 font-semibold transition-all duration-200"
                        style={{
                          background: selectedQuarter === q ? '#8B0000' : '#D4C5A9',
                          color: selectedQuarter === q ? '#FFFFFF' : '#4a3728',
                          border: '2px solid #C4B5A0',
                          fontFamily: "'Source Serif Pro', Georgia, serif",
                          fontSize: '14px'
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
