# GameCommunity Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (for PostgreSQL)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up PostgreSQL

### Option A: Using Docker (Recommended)

```bash
docker-compose up -d
```

This will start PostgreSQL on `localhost:5432` with:

- Username: `postgres`
- Password: `password`
- Database: `gamecommunity`

### Option B: Local PostgreSQL

If you have PostgreSQL installed locally, update `.env.local` with your database URL:

```
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/gamecommunity"
```

## Step 3: Set Up Database Schema

Run Prisma migrations to create all tables:

```bash
npm run db:migrate
```

Or use the shorthand:

```bash
npx prisma migrate dev
```

This will:

1. Create all database tables
2. Generate the Prisma client
3. (Optionally) Create initial seed data

Verify the database with Prisma Studio:

```bash
npm run db:studio
```

## Step 4: Set Up IGDB API (Optional for Now)

To enable game search functionality, you'll need IGDB API credentials:

1. Go to https://twitch.tv/login and sign in
2. Visit https://dev.twitch.tv/console/apps
3. Create a new application
4. In your application settings, go to the "Keys" section
5. Copy your **Client ID** and generate an **OAuth Token**
6. Add to `.env.local`:
   ```
   IGDB_CLIENT_ID="your_client_id"
   IGDB_ACCESS_TOKEN="your_access_token"
   ```

Note: This is optional for initial development. Basic game logging can work without it.

## Step 5: Generate NextAuth Secret

If you need to update the NextAuth secret in `.env.local`:

```bash
openssl rand -base64 32
```

Then update `.env.local` with the generated value.

## Step 6: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Step 7: Verify Setup

Check that you can see:

- [ ] Home page loads at http://localhost:3000
- [ ] Database is connected (check with `npm run db:studio`)
- [ ] No console errors in terminal

## Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Open Prisma Studio (database GUI)
npm run db:studio

# View and run migrations
npm run db:migrate

# Push schema changes directly (dev only)
npm run db:push
```

## Troubleshooting

### Port 5432 already in use

Kill the existing process or change the port in `docker-compose.yml`:

```bash
# Windows
netstat -ano | findstr :5432

# macOS/Linux
lsof -i :5432
```

### Database connection failed

Check that:

1. PostgreSQL is running: `docker ps` (if using Docker)
2. DATABASE_URL in `.env.local` is correct
3. Your network allows localhost connections

### Prisma migration errors

Reset the database (⚠️ deletes all data):

```bash
npx prisma migrate reset
```

## Next Steps

1. Implement user registration and authentication
2. Set up IGDB API integration for game search
3. Build game logging feature
4. Implement friend system
5. Create game discovery page

See README.md for project overview and features.
