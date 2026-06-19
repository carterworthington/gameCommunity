"# GameCommunity

A social gaming hub where friends can log games they play across consoles and discover what others are playing.

## Tech Stack

- **Frontend/Backend**: Next.js 14 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Game Data**: IGDB API
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (local or Docker)
- IGDB API credentials (via Twitch)

### Installation

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

3. Set up the database:
   \`\`\`bash
   npx prisma migrate dev
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
GameCommunity/
├── app/ # Next.js 14 app directory
│ ├── api/ # API routes
│ ├── auth/ # Authentication pages
│ ├── games/ # Game management
│ ├── friends/ # Friend management
│ ├── discover/ # Game discovery
│ └── layout.tsx # Root layout
├── components/ # Reusable React components
├── lib/ # Utilities, types, database client
├── prisma/ # Database schema and migrations
└── public/ # Static assets
\`\`\`

## Features

### MVP (Phase 1)

- User authentication (sign up, login)
- Log games by title and console (PS5, Xbox, Switch, PC)
- Availability status (Available/Away/Offline)
- Friend requests and friend management
- View friends' game libraries
- Game discovery and filtering

### Phase 2

- Direct messaging between friends
- Gaming sessions and group invites

## Development

Run the development server:
\`\`\`bash
npm run dev
\`\`\`

Generate Prisma client after schema changes:
\`\`\`bash
npx prisma generate
\`\`\`

Open Prisma Studio to view database:
\`\`\`bash
npx prisma studio
\`\`\`"
