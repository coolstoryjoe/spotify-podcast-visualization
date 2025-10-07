const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { ChatOpenAI } = require('@langchain/openai');
const { StructuredOutputParser } = require('langchain/output_parsers');
const { PromptTemplate } = require('@langchain/core/prompts');
const { z } = require('zod');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Load podcast data
const podcastDataPath = path.join(__dirname, '../spotify_podcast_history.json');
let podcastData = [];

try {
  const rawData = fs.readFileSync(podcastDataPath, 'utf-8');
  podcastData = JSON.parse(rawData);
  console.log(`Loaded ${podcastData.length} podcast entries`);
} catch (error) {
  console.error('Error loading podcast data:', error);
}

// Initialize OpenAI with faster model
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
  maxRetries: 2,
});

// Helper function to process quarterly data
function getQuarterlyData(year, quarter) {
  const startMonth = (quarter - 1) * 3;
  const endMonth = startMonth + 3;

  const filtered = podcastData.filter(entry => {
    const date = new Date(entry.ts);
    const entryYear = date.getFullYear();
    const entryMonth = date.getMonth();

    return entryYear === year && entryMonth >= startMonth && entryMonth < endMonth;
  });

  // Aggregate by show
  const showStats = {};
  filtered.forEach(entry => {
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

  // Sort by total hours
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

// API endpoint to generate quarterly narrative
app.post('/api/narrative', async (req, res) => {
  try {
    console.log('[API] Narrative request received:', req.body);
    const { year, quarter } = req.body;

    if (!year || !quarter) {
      return res.status(400).json({ error: 'Year and quarter are required' });
    }

    const quarterlyData = getQuarterlyData(year, quarter);

    if (quarterlyData.totalEpisodes === 0) {
      return res.json({
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

    console.log('[API] Calling OpenAI for narrative...');
    const response = await model.invoke(prompt);
    console.log('[API] OpenAI response received');

    res.json({
      narrative: response.content,
      data: quarterlyData
    });

  } catch (error) {
    console.error('[API] Error generating narrative:', error.message);
    res.status(500).json({ error: 'Failed to generate narrative: ' + error.message });
  }
});

// API endpoint to ask questions about the data
app.post('/api/chat', async (req, res) => {
  try {
    console.log('[API] Chat request received:', req.body);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get summary statistics
    const shows = {};
    podcastData.forEach(entry => {
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

    console.log('[API] Calling OpenAI for chat...');
    const response = await model.invoke(prompt);
    console.log('[API] OpenAI chat response received');

    res.json({
      response: response.content
    });

  } catch (error) {
    console.error('[API] Error processing chat:', error.message);
    res.status(500).json({ error: 'Failed to process message: ' + error.message });
  }
});

// API endpoint to get available quarters
app.get('/api/quarters', (req, res) => {
  try {
    const quarters = new Set();

    podcastData.forEach(entry => {
      const date = new Date(entry.ts);
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(month / 3) + 1;
      quarters.add(`${year}-Q${quarter}`);
    });

    const sortedQuarters = Array.from(quarters).sort();

    res.json({
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
    res.status(500).json({ error: 'Failed to get quarters' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
