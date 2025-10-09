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

interface ShowStats {
  hours: number;
  episodes: number;
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

// Initialize OpenAI
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
  maxRetries: 2,
});

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get summary statistics
    const shows: Record<string, ShowStats> = {};
    podcastData.forEach((entry) => {
      const show = entry.episode_show_name;
      if (!shows[show]) {
        shows[show] = { hours: 0, episodes: 0 };
      }
      shows[show].hours += entry.ms_played / (1000 * 60 * 60);
      shows[show].episodes++;
    });

    const topShows = Object.entries(shows)
      .sort(([, a], [, b]) => b.hours - a.hours)
      .slice(0, 20)
      .map(([name, stats]) => `${name}: ${Math.round(stats.hours)}h (${stats.episodes} eps)`);

    const totalHours = Object.values(shows).reduce((sum, s) => sum + s.hours, 0);
    const totalEpisodes = podcastData.length;

    const prompt = `You are an AI assistant helping a user understand their podcast listening history.

User's question: "${message}"

Available data summary:
- Total listening time: ${Math.round(totalHours)} hours
- Total episodes: ${totalEpisodes}
- Unique shows: ${Object.keys(shows).length}
- Top 20 shows by listening time:
${topShows.join('\n')}

Provide a helpful, conversational response to the user's question based on this data. If you need more specific data to answer accurately, mention that the user can ask more specific questions about particular time periods or shows.`;

    const response = await model.invoke(prompt);

    return NextResponse.json({
      response: response.content
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error processing chat:', message);
    return NextResponse.json({ error: 'Failed to process message: ' + message }, { status: 500 });
  }
}
