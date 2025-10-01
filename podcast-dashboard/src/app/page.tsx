'use client';

import { useEffect, useState } from 'react';
import { Headphones, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import PodcastChart from '@/components/PodcastChart';
import PodcastSelector from '@/components/PodcastSelector';
import { PodcastEntry, YearlyData } from '@/types/podcast';
import { processYearlyData, getTopPodcasts, createChartData, formatHours } from '@/utils/dataProcessor';

export default function Dashboard() {
  const [podcastData, setPodcastData] = useState<PodcastEntry[]>([]);
  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);
  const [topPodcasts, setTopPodcasts] = useState<string[]>([]);
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

        const top = getTopPodcasts(yearly, 100);
        setTopPodcasts(top);
        setSelectedPodcasts(new Set(top.slice(0, 10)));

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 mx-auto mb-8"
               style={{
                 borderWidth: '4px',
                 borderStyle: 'solid',
                 borderColor: 'var(--sand)',
                 borderBottomColor: 'var(--accent-gold)'
               }}>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: 'var(--dark-coffee)'
          }}>
            Preparing Your Journey
          </h2>
          <p className="font-light italic text-lg" style={{
            color: 'var(--text-muted)',
            fontFamily: "'Source Serif Pro', Georgia, serif"
          }}>
            Gathering the voices that shaped your days...
          </p>
        </div>
      </div>
    );
  }

  const chartData = createChartData(yearlyData, selectedPodcasts);
  const totalHours = podcastData.reduce((sum, entry) => sum + entry.ms_played / (1000 * 60 * 60), 0);
  const totalEpisodes = podcastData.length;
  const uniqueShows = new Set(podcastData.map(entry => entry.episode_show_name)).size;

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header className="border-b-2 border-opacity-30" style={{ borderColor: 'var(--sand)' }}>
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-3 rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent-warm), var(--accent-gold))' }}>
              <Headphones className="w-7 h-7" style={{ color: 'var(--dark-coffee)' }} />
            </div>
            <div>
              <h1 className="text-4xl font-bold font-serif tracking-wide" style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                color: 'var(--dark-coffee)'
              }}>
                Podcast Listening Journey
              </h1>
            </div>
          </div>
          <p className="text-lg font-light italic ml-16" style={{
            color: 'var(--text-muted)',
            fontFamily: "'Source Serif Pro', Georgia, serif"
          }}>
            A soulful exploration of your audio adventures
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="rounded-2xl shadow-lg overflow-hidden" style={{
            background: 'linear-gradient(135deg, var(--warm-beige), var(--sand))',
            border: '2px solid var(--accent-warm)'
          }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                    color: 'var(--text-muted)',
                    fontFamily: "'Source Serif Pro', Georgia, serif"
                  }}>
                    Time Spent Listening
                  </p>
                  <p className="text-3xl font-bold" style={{
                    color: 'var(--dark-coffee)',
                    fontFamily: "'Crimson Text', Georgia, serif"
                  }}>
                    {formatHours(totalHours)}
                  </p>
                  <p className="text-sm font-light italic mt-1" style={{ color: 'var(--text-muted)' }}>
                    Hours of wisdom absorbed
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-md" style={{ background: 'var(--accent-gold)' }}>
                  <Clock className="w-7 h-7" style={{ color: 'var(--dark-coffee)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg overflow-hidden" style={{
            background: 'linear-gradient(135deg, var(--warm-beige), var(--sand))',
            border: '2px solid var(--accent-warm)'
          }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                    color: 'var(--text-muted)',
                    fontFamily: "'Source Serif Pro', Georgia, serif"
                  }}>
                    Episodes Explored
                  </p>
                  <p className="text-3xl font-bold" style={{
                    color: 'var(--dark-coffee)',
                    fontFamily: "'Crimson Text', Georgia, serif"
                  }}>
                    {totalEpisodes.toLocaleString()}
                  </p>
                  <p className="text-sm font-light italic mt-1" style={{ color: 'var(--text-muted)' }}>
                    Stories & conversations
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-md" style={{ background: 'var(--accent-gold)' }}>
                  <TrendingUp className="w-7 h-7" style={{ color: 'var(--dark-coffee)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl shadow-lg overflow-hidden" style={{
            background: 'linear-gradient(135deg, var(--warm-beige), var(--sand))',
            border: '2px solid var(--accent-warm)'
          }}>
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-serif font-semibold text-sm tracking-wide uppercase mb-2" style={{
                    color: 'var(--text-muted)',
                    fontFamily: "'Source Serif Pro', Georgia, serif"
                  }}>
                    Unique Voices
                  </p>
                  <p className="text-3xl font-bold" style={{
                    color: 'var(--dark-coffee)',
                    fontFamily: "'Crimson Text', Georgia, serif"
                  }}>
                    {uniqueShows}
                  </p>
                  <p className="text-sm font-light italic mt-1" style={{ color: 'var(--text-muted)' }}>
                    Different perspectives
                  </p>
                </div>
                <div className="p-4 rounded-full shadow-md" style={{ background: 'var(--accent-gold)' }}>
                  <BarChart3 className="w-7 h-7" style={{ color: 'var(--dark-coffee)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl shadow-lg overflow-hidden" style={{
              background: 'var(--warm-beige)',
              border: '2px solid var(--sand)'
            }}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2" style={{
                      fontFamily: "'Crimson Text', Georgia, serif",
                      color: 'var(--dark-coffee)'
                    }}>
                      Your Listening Tapestry
                    </h2>
                    <p className="font-light italic" style={{ color: 'var(--text-muted)' }}>
                      The rhythm of your years through audio
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Showing {selectedPodcasts.size} show{selectedPodcasts.size !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {selectedPodcasts.size > 0 ? (
                  <PodcastChart data={chartData} />
                ) : (
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-20 h-20 mx-auto mb-6 opacity-30" style={{ color: 'var(--text-muted)' }} />
                      <p className="text-lg font-light italic" style={{ color: 'var(--text-muted)' }}>
                        Choose your voices to see the story unfold...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Podcast Selector */}
          <div className="lg:col-span-1">
            <PodcastSelector
              allPodcasts={topPodcasts}
              selectedPodcasts={selectedPodcasts}
              onSelectionChange={setSelectedPodcasts}
            />

            {/* Legend */}
            {selectedPodcasts.size > 0 && (
              <div className="mt-8 rounded-2xl shadow-lg overflow-hidden" style={{
                background: 'var(--warm-beige)',
                border: '2px solid var(--sand)'
              }}>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-4" style={{
                    fontFamily: "'Crimson Text', Georgia, serif",
                    color: 'var(--dark-coffee)'
                  }}>
                    Your Chosen Voices
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Array.from(selectedPodcasts).map((podcast, index) => {
                      const colorIndex = topPodcasts.indexOf(podcast) % 20;
                      const totalHoursForPodcast = yearlyData.reduce(
                        (sum, year) => sum + (year.podcasts[podcast] || 0), 0
                      );

                      return (
                        <div key={podcast} className="flex items-center space-x-4 p-2 rounded-lg" style={{
                          background: 'rgba(218, 165, 32, 0.1)'
                        }}>
                          <div
                            className="w-4 h-4 rounded-full shadow-sm border-2"
                            style={{
                              backgroundColor: chartData.datasets[index]?.backgroundColor,
                              borderColor: 'var(--dark-coffee)'
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                              {podcast}
                            </p>
                            <p className="text-xs font-light italic" style={{ color: 'var(--text-muted)' }}>
                              {formatHours(totalHoursForPodcast)} of listening
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
