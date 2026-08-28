# Onam Trivia - Project Documentation

## Overview
This is a trivia/challenge website built with Next.js, TypeScript, and Supabase. The application features a Onam-themed puzzle game where users complete chapters and challenges to progress through a storyline.

## Database Schema & Data Files

### Main Data Types (`lib/types.ts`)
- **Chapter**: Chapter information with number, title, description, difficulty, status, and publication status
- **Profile**: User profile with full name, mobile number, avatar URL, and role (player/admin)
- **Challenge**: Individual challenges with title, description, question, type, difficulty, points, image URL, flag hash, hint, and order
- **LeaderboardTeam**: Leaderboard entries with rank, team name, score, progress, and last solved
- **Feature**: Feature descriptions for the home page
- **TeamSkill**: Team skill descriptions with emoji and labels

### Static Data (`lib/data.ts`)
- **leaderboard**: Mock leaderboard data with 5 teams
- **features**: Feature descriptions (Lore, Disguise, Discovery)
- **teamSkills**: Team skill descriptions (Lore Keeper, Puzzle Solver, Code Breaker, Observer)

### Supabase Client Files
- **`lib/supabase/server.ts`**: Server-side Supabase client for server components
- **`lib/supabase/client.ts`**: Client-side Supabase client for client components
- **`lib/crypto.ts`**: Cryptographic utilities for hashing challenge flags

## Pages & Routes

### Public Pages

#### 1. Home Page (`app/page.tsx`)
- **Route**: `/`
- **Components Used**: Navbar, Hero, IntroSection, ChaptersSection, ThreeSteps, LeaderboardPreview, FinalCTA, Footer
- **Data**: Uses ChaptersSection which fetches chapters from Supabase
- **Authentication**: Not required
- **Functionality**: Landing page with hero section, chapter preview, and CTA sections

#### 2. Sign In Page (`app/signin/page.tsx`)
- **Route**: `/signin`
- **Authentication**: Not required (public page)
- **Data**: Uses Supabase auth for user authentication
- **Functionality**: 
  - Email/password sign in form
  - Form validation and error handling
  - Redirects to home page on successful login
  - Links to signup page

#### 3. Sign Up Page (`app/signup/page.tsx`)
- **Route**: `/signup`
- **Authentication**: Not required (public page)
- **Data**: Creates user profile in Supabase auth and stores full name, mobile number in user metadata
- **Functionality**:
  - Full name, email, mobile number, password fields
  - Password confirmation validation
  - Creates new user account
  - Redirects to home page after successful signup

#### 4. Leaderboard Page (`app/leaderboard/page.tsx`)
- **Route**: `/leaderboard`
- **Authentication**: Not required (public page)
- **Data**: Uses mock data from `lib/data.ts`
- **Functionality**: 
  - Displays leaderboard with filters (Overall, Today, Chapter 1-4)
  - Shows top 3 teams in podium format
  - Full leaderboard table with rank, team, score, progress, last solved

### Protected Pages (Require Authentication)

#### 5. Dashboard Page (`app/dashboard/page.tsx`)
- **Route**: `/dashboard`
- **Authentication**: ✅ Required (redirects to `/signin` if not authenticated)
- **Data**: Fetches chapters from Supabase
- **Functionality**:
  - Shows overall progress (currently static 12%)
  - Displays next challenge CTA
  - Lists chapters with status (completed, locked, available)
  - Shows team information and current score
  - **Recent Update**: Added authentication check to prevent unauthorized access

#### 6. Chapters List Page (`app/chapters/page.tsx`)
- **Route**: `/chapters`
- **Authentication**: ✅ Required (redirects to `/signin` if not authenticated)
- **Data**: Fetches all chapters from Supabase ordered by chapter number
- **Functionality**:
  - Lists all available chapters
  - Shows chapter cards with challenge count and progress
  - **Recent Update**: Added authentication check to prevent unauthorized access

#### 7. Chapter Detail Page (`app/chapters/[id]/page.tsx`)
- **Route**: `/chapters/[id]`
- **Authentication**: ✅ Required (redirects to `/signin` if not authenticated)
- **Data**: Fetches specific chapter and its challenges from Supabase
- **Functionality**:
  - Shows chapter overview and description
  - Lists all challenges in the chapter
  - Displays challenge titles, descriptions, and points
  - Links to individual challenge pages
  - Handles locked chapters
  - **Recent Update**: Added authentication check to prevent unauthorized access

#### 8. Challenge Detail Page (`app/chapters/[id]/challenges/[challengeId]/page.tsx`)
- **Route**: `/chapters/[id]/challenges/[challengeId]`
- **Authentication**: ✅ Required (redirects to `/signin` if not authenticated)
- **Data**: Fetches specific challenge details from Supabase
- **Functionality**:
  - Displays challenge title, description, question
  - Shows challenge metadata (points, difficulty, type)
  - Displays challenge image if available
  - Shows hint if provided
  - Answer submission form (currently non-functional)
  - **Recent Update**: Added authentication check to prevent unauthorized access

### Admin Pages

#### 9. Admin Login Page (`app/admin/page.tsx`)
- **Route**: `/admin`
- **Authentication**: Requires admin credentials
- **Data**: Uses Supabase auth and checks user role in profiles table
- **Functionality**:
  - Admin-specific login form
  - Validates user has admin role in profiles table
  - Redirects to admin dashboard on success
  - Signs out user if not admin

#### 10. Admin Dashboard (`app/admin/dashboard/page.tsx`)
- **Route**: `/admin/dashboard`
- **Authentication**: ✅ Required (admin only, redirects to `/admin` if not authenticated)
- **Data**: Fetches all chapters from Supabase
- **Client Component**: `AdminDashboardClient.tsx`
- **Functionality**:
  - Lists all chapters with their status
  - Create new chapters
  - Edit existing chapters
  - Delete chapters
  - Navigate to chapter challenge management
  - Logout functionality

#### 11. Chapter Challenge Management (`app/admin/chapters/[id]/page.tsx`)
- **Route**: `/admin/chapters/[id]`
- **Authentication**: ✅ Required (admin only, redirects to `/admin` if not authenticated)
- **Data**: Fetches specific chapter and its challenges
- **Client Component**: `ChallengeManagerClient.tsx`
- **Functionality**:
  - View all challenges in a chapter
  - Create new challenges with:
    - Title, description, question
    - Type (riddle, puzzle, etc.)
    - Difficulty level
    - Points
    - Hint
    - Image upload (stored in Supabase storage)
    - Answer/flag (hashed for security)
  - Edit existing challenges
  - Delete challenges
  - Image upload to Supabase storage
  - Flag hashing for security

### API Routes

#### 12. Auth Confirm Route (`app/auth/confirm/route.ts`)
- **Route**: `/auth/confirm`
- **Functionality**: Handles email confirmation for user authentication

## Components

### UI Components (`components/`)
- **AuthShell**: Authentication form wrapper with consistent styling
- **Button**: Reusable button component with variants
- **ChapterCard**: Chapter display card for home and chapters pages
- **ChaptersSection**: Section component for displaying chapters (server component)
- **FinalCTA**: Final call-to-action section
- **Footer**: Site footer
- **Hero**: Hero section for home page
- **Insignia**: Logo/insignia component
- **IntroSection**: Introduction section
- **LeaderboardPreview**: Leaderboard preview section
- **Navbar**: Navigation bar
- **Reveal**: Animation component for revealing content
- **TeamSection**: Team information section
- **ThreeSteps**: Three steps feature section

## Recent Updates

### Authentication Enhancements
- Added middleware-level authentication checks for protected routes
- Middleware runs before page rendering, preventing 404 errors from database queries
- Protected routes: `/dashboard`, `/chapters` (and subpaths)
- Admin routes: `/admin` (and subpaths)
- All unauthenticated access to protected routes redirects to `/signin`
- Added page-level authentication checks as backup for:
  - Challenge detail page
  - Chapter detail page
  - Chapters list page
  - Dashboard page

### Empty State Handling
- Added "No chapters have been created yet" indicator to home page when database is empty
- Applied to `ChaptersSection` component

### Database Schema Changes
- Removed `type` and `progress` fields from chapter creation form
- Updated TypeScript types to remove these fields from Chapter interface
- Removed references to these fields from all components:
  - Admin dashboard chapter form
  - Chapter detail page
  - Dashboard page
  - Chapter cards
  - Chapters list page
- SQL migration script provided in `remove_columns.sql`

### Challenge Type System Enhancement
- Implemented conditional form fields based on challenge type
- Three challenge types with specific field requirements:
  - **Photo + Song**: Image upload + Audio upload + Answer/Flag
  - **Photo Only**: Image upload + Answer/Flag  
  - **Question & Answer**: Question text + Answer/Flag
- Form dynamically shows/hides fields based on selected type
- Prevents orphaned data by clearing irrelevant fields when switching types
- Added `audio_url` column to challenges table
- Made `question` column nullable to support different challenge types
- Updated TypeScript types to include `audio_url` and nullable `question`
- Enhanced challenge display page to support audio playback
- **Migration Required**: Run `complete_migration.sql` in Supabase SQL Editor to:
  - Add `audio_url` column
  - Make `question` column nullable
  - Update existing challenge types to new system
  - Add type constraints and documentation

## Database Tables (Supabase)

### Tables
- **chapters**: Chapter information
- **challenges**: Challenge data linked to chapters
- **profiles**: User profiles with roles
- **auth.users**: Supabase authentication users

### Storage
- **challenge-assets**: Storage bucket for challenge images

## Authentication Flow
1. User signs up → Creates account in Supabase auth
2. User signs in → Session created
3. Protected pages check for session → Redirect to signin if missing
4. Admin pages additionally check for admin role in profiles table

## Security Features
- Row Level Security (RLS) on Supabase tables
- Hashed challenge flags using crypto utilities
- Admin role verification for admin pages
- Protected routes with authentication checks

## Development Notes
- Next.js App Router with Server Components
- TypeScript for type safety
- Supabase for authentication and database
- Tailwind CSS for styling
- Custom color scheme (gold, kingdom-green, rust, ink, ivory)