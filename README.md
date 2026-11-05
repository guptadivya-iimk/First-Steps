# FirstSteps Finder

A mobile-first Progressive Web App (PWA) for parents to discover and evaluate preschools and daycares in Gurugram, starting around Sector 47.

The app tracks source-verified Montessori and safety credentials, checks cab commute times against live traffic models, groups fees into clear buckets, and drafts parent-approved outreach for schools.

## Core Features

- Source provenance: Every fact (timings, fees, CCTV access, teacher training) links directly to its source with confidence status (Confirmed by school, From school website, From listing site, Conflicting, Old data, or Ask school).
- Cab travel time: Calculates weekday morning drop-off and pickup times via the Google Routes API with live traffic data.
- Authentic Montessori and safety checks: Evaluates teacher certifications (AMI/AMS), classroom setup, and female-only toileting staff alongside parent-accessible CCTV.
- Parent-controlled outreach: Drafts inquiries for WhatsApp, email, and phone calls. Nothing is sent without manual parent approval.
- Reply and brochure parsing: Extracts structured data from school replies, fee cards, and brochures using Gemini to update records with parent consent.

## Technology Stack

- Frontend: Next.js (App Router), React 19, TypeScript, Tailwind CSS
- Design System: Custom tokens, Bricolage Grotesque and DM Sans typography, Lucide stroke icons (no emojis)
- Backend: Firebase Auth (Google Sign-In), Cloud Firestore (`asia-south2`/`asia-south1`), Cloud Storage
- AI: Google Gemini API (Flash and Pro models) with Google Search grounding and Zod validation
- Maps: Google Maps Platform (Places API New, Routes API, Maps JavaScript API)
- Testing: Vitest and Playwright

## Getting Started

### Prerequisites

- Node.js 20+ or 22+
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:guptadivya-iimk/First-Steps.git
   cd First-Steps
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env.local` and add your Firebase, Gemini, and Google Maps API keys:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Run test suite:
   ```bash
   npm test
   ```

## Development Phases

- Phase 1: Foundations, design system tokens, Firebase configuration, seed data for 14 Gurugram schools.
- Phase 2: Onboarding wizard, cab travel time calculation, scoring engine, shortlist, and school detail views.
- Phase 3: AI research with Google Search grounding, fact extraction, and conflict detection.
- Phase 4: Outreach composer with approval gate and inbound reply capture.
- Phase 5: School comparison matrix, visit tracker pipeline, and audio notes with AI summaries.
- Phase 6: Admin controls, accuracy evaluation suite, and analytics instrumentation.
