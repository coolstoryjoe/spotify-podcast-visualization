import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface PodcastEntry {
  ts: string;
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

export async function GET() {
  try {
    const quarters = new Set<string>();

    podcastData.forEach((entry) => {
      const date = new Date(entry.ts);
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      quarters.add(`${year}-Q${quarter}`);
    });

    const sortedQuarters = Array.from(quarters).sort();

    return NextResponse.json({
      quarters: sortedQuarters.map(q => {
        const [year, quarterStr] = q.split('-Q');
        return {
          year: parseInt(year),
          quarter: parseInt(quarterStr),
          label: q
        };
      })
    });

  } catch (error) {
    console.error('Error getting quarters:', error);
    return NextResponse.json({ error: 'Failed to get quarters' }, { status: 500 });
  }
}
