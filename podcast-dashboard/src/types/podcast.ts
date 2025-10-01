export interface PodcastEntry {
  ts: string;
  platform: string;
  ms_played: number;
  conn_country: string;
  episode_name: string;
  episode_show_name: string;
  spotify_episode_uri: string;
  reason_start: string;
  reason_end: string;
  shuffle: boolean;
  skipped: boolean;
  offline: boolean;
  incognito_mode: boolean;
}

export interface YearlyData {
  year: number;
  podcasts: { [showName: string]: number };
  totalHours: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}