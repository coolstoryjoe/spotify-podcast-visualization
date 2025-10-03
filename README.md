# Joe Zettelkasten

A digital knowledge management system inspired by the Zettelkasten method, designed for creating interconnected notes and building a personal knowledge graph.

## About

The Zettelkasten method is a knowledge management technique that involves creating a network of interconnected notes. This project aims to create a modern, digital implementation that allows users to:

- Create and manage interconnected notes
- Discover relationships between concepts
- Build a personal knowledge graph
- Search and navigate through connected ideas

## Project Structure

```
Joe Zettelkasten/
├── client/          # Frontend React/Vue application
├── server/          # Node.js/Express backend API
├── shared/          # Shared types and utilities
├── docs/            # Project documentation
└── scripts/         # Build and deployment scripts
```

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB/PostgreSQL (TBD)
- **Frontend**: React/Vue.js (TBD)
- **Real-time**: WebSocket for live updates
- **Search**: Full-text search capabilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Database (MongoDB or PostgreSQL)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/joe-zettelkasten.git
cd joe-zettelkasten
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Set up environment variables (see `.env.example`)

5. Start the development servers:
```bash
# In one terminal - start the backend
cd server
npm run dev

# In another terminal - start the frontend
cd client
npm run dev
```

## Features (Planned)

- [ ] Note creation and editing with Markdown support
- [ ] Bi-directional linking between notes
- [ ] Tag-based organization
- [ ] Full-text search
- [ ] Visual knowledge graph
- [ ] Export/import functionality
- [ ] Collaborative editing
- [ ] Mobile-responsive design

## Contributing

This is a personal project, but contributions and suggestions are welcome! Please feel free to:

- Report bugs or issues
- Suggest new features
- Submit pull requests

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Inspiration

This project is inspired by:
- Niklas Luhmann's analog Zettelkasten system
- Modern digital tools like Roam Research, Obsidian, and Notion
- The concept of building a "second brain" for knowledge work