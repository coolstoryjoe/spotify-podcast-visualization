import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import fs from 'fs';
import path from 'path';

interface PodcastEntry {
  ts: string;
  episode_show_name: string;
  episode_name: string;
  ms_played: number;
}

// Load podcast data
const podcastDataPath = path.join(process.cwd(), 'public', 'spotify_podcast_history.json');
let podcastData: PodcastEntry[] = [];

try {
  const rawData = fs.readFileSync(podcastDataPath, 'utf-8');
  podcastData = JSON.parse(rawData);
} catch (error) {
  console.error('Error loading podcast data:', error);
}

// Initialize OpenAI with faster model
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
  maxRetries: 2,
});

interface ShowStats {
  episodes: string[];
  totalHours: number;
  episodeCount: number;
}

function getQuarterlyData(year: number, quarter: number) {
  const startMonth = (quarter - 1) * 3;
  const endMonth = startMonth + 3;

  const filtered = podcastData.filter((entry) => {
    const date = new Date(entry.ts);
    const entryYear = date.getFullYear();
    const entryMonth = date.getMonth();

    return entryYear === year && entryMonth >= startMonth && entryMonth < endMonth;
  });

  const showStats: Record<string, ShowStats> = {};
  filtered.forEach((entry) => {
    const show = entry.episode_show_name;
    if (!showStats[show]) {
      showStats[show] = {
        episodes: [],
        totalHours: 0,
        episodeCount: 0
      };
    }
    showStats[show].episodes.push(entry.episode_name);
    showStats[show].totalHours += entry.ms_played / (1000 * 60 * 60);
    showStats[show].episodeCount++;
  });

  const sortedShows = Object.entries(showStats)
    .sort(([, a], [, b]) => b.totalHours - a.totalHours)
    .slice(0, 10);

  return {
    year,
    quarter,
    totalEpisodes: filtered.length,
    totalHours: filtered.reduce((sum, e) => sum + e.ms_played / (1000 * 60 * 60), 0),
    topShows: sortedShows.map(([name, stats]) => ({
      name,
      hours: Math.round(stats.totalHours * 10) / 10,
      episodes: stats.episodeCount
    }))
  };
}

export async function POST(request: NextRequest) {
  try {
    const { year, quarter } = await request.json();

    if (!year || !quarter) {
      return NextResponse.json({ error: 'Year and quarter are required' }, { status: 400 });
    }

    const quarterlyData = getQuarterlyData(year, quarter);

    if (quarterlyData.totalEpisodes === 0) {
      return NextResponse.json({
        narrative: `No podcast listening data available for Q${quarter} ${year}.`
      });
    }

    const prompt = `You are a narrative analyst specializing in podcast listening patterns.

Based on the following podcast listening data for Q${quarter} ${year}, write a thoughtful, engaging narrative (2-3 paragraphs) that:
1. Identifies the main themes and topics explored
2. Reflects on what this listening pattern might reveal about the listener's interests during this period
3. Highlights any particularly notable shows or patterns

Data:
- Total episodes listened: ${quarterlyData.totalEpisodes}
- Total listening hours: ${Math.round(quarterlyData.totalHours)} hours
- Top shows:
${quarterlyData.topShows.map((show, i) => `  ${i + 1}. "${show.name}" - ${show.hours} hours (${show.episodes} episodes)`).join('\n')}

Write in a warm, insightful tone as if you're helping someone reflect on their intellectual journey. Do not use bullet points or lists in your narrative.`;

    const response = await model.invoke(prompt);

    return NextResponse.json({
      narrative: response.content,
      data: quarterlyData
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error generating narrative:', message);
    return NextResponse.json({ error: 'Failed to generate narrative: ' + message }, { status: 500 });
  }
}
