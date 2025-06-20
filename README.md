# FlipMood

A simple mood-based entertainment recommendation app that suggests movies and music through a card interface.

## Features

- 🎬 **Movie Recommendations**: Get movie suggestions from TMDB
- 🎵 **Music Player**: Display Spotify embed player for music tracks
- 🃏 **Card Interface**: Browse recommendations with card layout
- 🌈 **Aurora Background**: Dynamic animated background with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Aurora background effects
- **APIs**:
  - The Movie Database (TMDB) for movie data
  - Spotify for music track embedding
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/saippuakiv/flipmood.git
cd flipmood
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your API keys to `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### Getting API Keys

- **TMDB API Key**: Sign up at [The Movie Database](https://www.themoviedb.org/settings/api)
- **Spotify API Keys**:
  1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
  2. Create a new app
  3. Get your Client ID and Client Secret

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1. **Enter Your Mood**: Describe what kind of entertainment you're looking for
2. **Browse Cards**: View movie recommendations and listen to music tracks via Spotify embed

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [Spotify](https://spotify.com/) for music track embedding
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
