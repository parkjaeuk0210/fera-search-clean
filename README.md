# Fera Search

A modern AI-powered search engine with real-time web integration. Get intelligent answers to your questions with source citations and a beautiful glassmorphism UI.

## Features

- 🔍 Real-time web search integration
- 🤖 Powered by advanced AI technology
- 📚 Source citations and references for answers
- 💬 Follow-up questions in the same chat session
- 🎨 Beautiful glassmorphism design with Apple-inspired aesthetics
- ⚡ Fast response times
- 📱 Mobile-friendly responsive design
- 🌓 Dark mode support

## Tech Stack

- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Express.js + TypeScript
- AI: Advanced language model with web search capabilities
- UI: Glassmorphism design with smooth animations

## Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- An API key for the AI service

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd fera-search
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Environment Variables

- `GOOGLE_API_KEY`: Your API key for the AI service
- `NODE_ENV`: Set to "development" by default, use "production" for production builds

## Development

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm run start`: Run the production server
- `npm run check`: Run TypeScript type checking

## Security Notes

- Never commit your `.env` file or expose your API keys
- The `.gitignore` file is configured to exclude sensitive files
- If you fork this repository, make sure to use your own API keys

## License

MIT License - feel free to use this code for your own projects!

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Glassmorphism design inspired by Apple's design language
