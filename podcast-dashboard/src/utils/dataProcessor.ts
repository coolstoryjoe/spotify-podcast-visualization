import { PodcastEntry, YearlyData, ChartData } from '@/types/podcast';

export const PODCAST_COLORS = [
  '#D2B48C', '#DEB887', '#F4A460', '#DAA520', '#B8860B',
  '#CD853F', '#A0522D', '#8B4513', '#D2691E', '#BC8F8F',
  '#F5DEB3', '#DDD6C1', '#C19A6B', '#E3C16F', '#CFBF87',
  '#D4A574', '#C2926C', '#B5906A', '#A67C52', '#9B8662',
  '#BDB76B', '#F0E68C', '#EEE8AA', '#FFE4B5', '#FFDAB9',
  '#FFE4E1', '#FDF5E6', '#FAF0E6', '#FFF8DC', '#FFFACD',
  '#FFFFE0', '#F5F5DC', '#FDF5E6', '#FAEBD7', '#F5DEB3',
  '#DDD6C1', '#D2B48C', '#BC8F8F', '#F4A460', '#DAA520',
  '#CD853F', '#D2691E', '#A0522D', '#8B4513', '#DEB887',
  '#CFBF87', '#C19A6B', '#B5906A', '#A67C52', '#9B8662',
  '#E6D3A3', '#E0C097', '#D4B896', '#C8AC89', '#BCA082',
  '#B5947B', '#A88874', '#9B7C6D', '#8E7066', '#81645F',
  '#745858', '#674C51', '#5A404A', '#4D3443', '#40283C',
  '#8B7355', '#A0825C', '#B59163', '#CAA06A', '#DFAF71',
  '#F4BE78', '#D4A574', '#C2926C', '#B5906A', '#A67C52',
  '#E8D5B7', '#E3D0B2', '#DECBAD', '#D9C6A8', '#D4C1A3',
  '#CFBC9E', '#CAB799', '#C5B294', '#C0AD8F', '#BBA88A',
  '#B6A385', '#B19E80', '#AC997B', '#A79476', '#A28F71',
  '#9D8A6C', '#988567', '#938062', '#8E7B5D', '#897658'
];

export function processYearlyData(entries: PodcastEntry[]): YearlyData[] {
  const yearlyMap: { [year: number]: { [showName: string]: number } } = {};

  entries.forEach(entry => {
    const year = new Date(entry.ts).getFullYear();
    const showName = entry.episode_show_name;
    const hours = entry.ms_played / (1000 * 60 * 60);

    if (!yearlyMap[year]) {
      yearlyMap[year] = {};
    }

    if (!yearlyMap[year][showName]) {
      yearlyMap[year][showName] = 0;
    }

    yearlyMap[year][showName] += hours;
  });

  return Object.keys(yearlyMap)
    .map(year => {
      const yearNum = parseInt(year);
      const podcasts = yearlyMap[yearNum];
      const totalHours = Object.values(podcasts).reduce((sum, hours) => sum + hours, 0);

      return {
        year: yearNum,
        podcasts,
        totalHours
      };
    })
    .sort((a, b) => a.year - b.year);
}

export function getTopPodcasts(yearlyData: YearlyData[], limit: number = 100): string[] {
  const podcastTotals: { [showName: string]: number } = {};

  yearlyData.forEach(yearData => {
    Object.entries(yearData.podcasts).forEach(([showName, hours]) => {
      if (!podcastTotals[showName]) {
        podcastTotals[showName] = 0;
      }
      podcastTotals[showName] += hours;
    });
  });

  return Object.entries(podcastTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([showName]) => showName);
}

export function createChartData(
  yearlyData: YearlyData[],
  selectedPodcasts: Set<string>
): ChartData {
  const years = yearlyData.map(d => d.year.toString());
  const podcastList = Array.from(selectedPodcasts);

  const datasets = podcastList.map((podcast, index) => ({
    label: podcast,
    data: yearlyData.map(yearData => yearData.podcasts[podcast] || 0),
    backgroundColor: PODCAST_COLORS[index % PODCAST_COLORS.length],
    borderColor: PODCAST_COLORS[index % PODCAST_COLORS.length],
    borderWidth: 1
  }));

  return {
    labels: years,
    datasets
  };
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  return `${Math.round(hours * 10) / 10}h`;
}