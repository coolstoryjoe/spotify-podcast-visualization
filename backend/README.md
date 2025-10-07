# Podcast Dashboard Backend

AI-powered backend for analyzing podcast listening history using LangChain and OpenAI.

## Features

- **Quarterly Narratives**: AI-generated insights about your listening patterns by quarter
- **Chat Interface**: Ask questions about your podcast history
- **Data Analysis**: Powered by LangChain and OpenAI GPT-4

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### POST /api/narrative
Generate an AI narrative for a specific quarter.

Request body:
```json
{
  "year": 2024,
  "quarter": 1
}
```

### POST /api/chat
Chat with AI about your podcast listening data.

Request body:
```json
{
  "message": "What were my top podcasts in 2023?"
}
```

### GET /api/quarters
Get list of all available quarters in the dataset.

## Tech Stack

- Express.js
- LangChain
- OpenAI GPT-4
- Node.js
