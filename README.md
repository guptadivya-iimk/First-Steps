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

- Frontend: Next.js (App Router), React 19, TypeScript, Tailwind CSS v4
- UI components: shadcn/ui on Radix primitives, in `src/components/ui`
- Design System: OKLCH tokens in `src/app/globals.css`, an eleven-step type ramp, Bricolage Grotesque and DM Sans, Lucide stroke icons and hand-drawn SVG doodles (no emojis)
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

6. Run the browser tests:
   ```bash
   npm run test:e2e
   ```

## The Atlas

The shortlist has two views, List and Atlas. The Atlas pins every matching
school on a real map of Gurugram, each pin carrying its own fit score in the
school's colour. Tapping a pin opens a card for that school; the map button on
a list card jumps the other way.

Tiles come from OpenStreetMap, which needs no API key, and are muted with a CSS
filter so the pins carry the colour. Before this goes anywhere near real
traffic, move to a tile host with a usage agreement (Mapbox, MapTiler or a
self-hosted set); OpenStreetMap's own tiles are not for production volume.

## Design

The visual system lives entirely in `src/app/globals.css`. Colours are OKLCH,
every font size lands on one of eleven ramp steps, and surfaces rest on a
hairline rather than a shadow.

The look is poster-like: a warm paper ground, flat printed colour, and sharp
rectangles of colour set behind the words that matter. The display face is
Outfit at 800; body copy is DM Sans at 17px, because this is read one-handed
by someone who is tired. Both are self-hosted, so the build needs no network.

Colour carries information rather than decoration. Two systems run side by
side:

- **Provenance colours.** Forest means a school confirmed a fact, lagoon means
  its website said so, sunshine means check it yourself, grape means nobody
  knows yet.
- **The crayon box.** Six colours, one assigned to each school by its id in
  `src/lib/schoolIdentity.ts`. A school keeps its colour and its hand-drawn
  mark everywhere: the band on its card, the comparison table, its map pin.
  That is what lets a parent follow one school across the product by sight.

Every solid colour carries a `--crayon-on` token naming the text colour that
clears WCAG AA on it, because white fails on the brighter half of the palette.

Layout is mobile first. Phones and tablets get a bottom bar under the thumb,
laptops get a rail on the left. Every interactive target is at least 44px.

Run the design checks against a running server:

```bash
npx impeccable detect http://localhost:3000/shortlist
```

## Development Phases

- Phase 1: Foundations, design system tokens, Firebase configuration, seed data for 14 Gurugram schools.
- Phase 2: Onboarding wizard, cab travel time calculation, scoring engine, shortlist, and school detail views.
- Phase 3: AI research with Google Search grounding, fact extraction, and conflict detection.
- Phase 4: Outreach composer with approval gate and inbound reply capture.
- Phase 5: School comparison matrix, visit tracker pipeline, and audio notes with AI summaries.
- Phase 6: Admin controls, accuracy evaluation suite, and analytics instrumentation.
