# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a task and habit tracking application with:
- **API**: Rails 8 API-only backend (`/api`)
- **Web**: Next.js 15 frontend with App Router (`/web`)

The backend proxies through Next.js in development (API calls from the frontend are rewritten to `localhost:3000` where Rails runs).

## Architecture

### Backend (Rails API)

The API is a Rails 8 application with:
- **Models**: `User`, `Task`, `Habit`
- **Key Relationships**:
  - Users have many tasks and habits
  - Habits have many tasks (auto-generated via recurring rules)
  - Tasks can optionally belong to a habit
- **Task Statuses**: `pending`, `completed`, `canceled` (enum)
- **Recurring Tasks**: Habits use RRule format with timezone support to automatically create tasks via background jobs
- **Authentication**: Session-based using `has_secure_password` with cookie store
- **Background Jobs**: Uses `solid_queue` (database-backed) for scheduled task creation from habits

The API uses cookie-based session authentication. Session cookies are configured with:
- 14-day expiration
- httponly and secure (in production)
- same_site: :lax

Key background job: `CreateTaskFromHabitJob` processes habit recurrence by:
1. Checking if habit fingerprint matches (rrule + tzid hash)
2. Creating a new task if the last task is completed or no tasks exist
3. Re-enqueuing itself for the next recurrence time

### Frontend (Next.js)

The web app is a Next.js 15 application using:
- **App Router** with TypeScript
- **Server Components** by default
- **API Client** (`/web/api.ts`): Type-safe wrapper around fetch that handles cookie forwarding, redirects on 401, and supports nested query parameters
- **Models** (`/web/models/`): TypeScript interfaces mirroring backend models
- **Components** (`/web/components/`): Shared UI components
- **Styling**: Tailwind CSS v4 with PostCSS

The API client automatically:
- Forwards cookies from server components to the Rails backend
- Redirects to `/session/login` on 401 responses
- Returns `notFound()` on 404 responses
- Handles nested object serialization for query parameters

### Port Configuration

- Next.js dev server: port 4000 (configured in `web/package.json`)
- Rails API: port 3000
- PostgreSQL: port 5432 (via Docker Compose)

## Development Commands

### Setup

```bash
# Start PostgreSQL
docker compose up -d

# Setup Rails API
cd api
bundle install
bin/rails db:create db:migrate
cd ..

# Setup Next.js frontend
cd web
npm install
cd ..
```

### Running the Application

```bash
# Start Rails API (from api/ directory)
cd api
bin/rails server

# Start Next.js dev server (from web/ directory)
cd web
npm run dev
# Dev server runs on http://localhost:4000 with Turbopack
```

### Database

```bash
# From api/ directory:
bin/rails db:migrate              # Run migrations
bin/rails db:rollback             # Rollback last migration
bin/rails db:reset                # Drop, create, migrate, seed
bin/rails db:seed                 # Load seed data

# Create a migration
bin/rails generate migration MigrationName
```

### Testing

```bash
# Rails API tests (from api/ directory)
bin/rails test                    # Run all tests
bin/rails test test/models        # Run model tests only
bin/rails test test/controllers   # Run controller tests only
bin/rails test path/to/test.rb    # Run specific test file
bin/rails test path/to/test.rb:10 # Run specific test at line 10

# Next.js (from web/ directory)
npm run lint                      # Run ESLint
```

### Building

```bash
# Next.js production build (from web/ directory)
npm run build
npm run start                     # Run production server
```

### Code Quality

```bash
# Rails (from api/ directory)
bundle exec rubocop               # Run Ruby linter
bundle exec brakeman              # Security vulnerability scanner

# Next.js (from web/ directory)
npm run lint                      # Run ESLint with next/typescript config
```

## Key Implementation Details

### API Request Pattern

The frontend uses a centralized API client (`/web/api.ts`) that handles authentication state. All API calls from server components automatically include cookies, which Rails uses for session management.

### Habit Recurrence System

Habits use RRule (RFC 5545) for recurrence patterns:
1. User creates a habit with an rrule string and timezone
2. `Habit#after_commit` calculates next occurrence and enqueues `CreateTaskFromHabitJob`
3. Job runs at scheduled time, creates task if needed, and reschedules itself
4. Fingerprinting (SHA256 of rrule+tzid) prevents stale jobs from executing after habit updates

### TypeScript Path Aliases

The web app uses `@/*` to reference files from the web root:
```typescript
import { api } from "@/api";
import { Task } from "@/models/task";
```

### Database Configuration

- Development and test databases use PostgreSQL (no credentials required in development)
- Production uses three databases: primary, cache (solid_cache), and queue (solid_queue)
- Docker Compose provides PostgreSQL with POSTGRES_HOST_AUTH_METHOD=trust for local development
