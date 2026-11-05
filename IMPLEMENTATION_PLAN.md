# Implementation Plan — FirstSteps Finder

> **Target:** Mobile-First Progressive Web App (PWA) for Preschool & Daycare Discovery  
> **Initial Persona & Area:** Divya (Product Manager, mother of 2.3-year-old daughter), Sector 47, Gurugram, Haryana.  
> **Key Value Proposition:** Verified facts with source provenance, traffic-aware travel times, strict Montessori & safety audit, and zero-action AI outreach (drafts only with explicit human approval).

---

## 1. High-Level Summary (10 Key Pillars)

1. **Parent-Centric Preschool Discovery:** Built specifically for parents navigating the messy preschool/daycare landscape, starting in Sector 47, Gurugram (with multi-tenant architecture ready for Delhi NCR expansion without rewrites).
2. **Provenance-First Fact Engine:** Every single piece of school information (curriculum, CCTV, daycare hours, fees) is stored with its exact source (website, listing, school reply, parent report), confidence score, timestamp, and verification status.
3. **Traffic-Aware Cab Travel Times:** Computes exact travel times via Google Routes API using real weekday traffic projections at actual morning drop-off (09:00) and pickup (13:00) times.
4. **Authentic Montessori & Safety Verification:** Differentiates between authentic Montessori practice (AMI/AMS-certified teachers, prepared environments, 3-hour work cycles) and marketing labels; audits girl-child safety protocols (parent-accessible CCTV, women-only toileting staff, police verifications).
5. **Dynamic Scoring & Fee Bucketing:** 0–100 fit score rebalanced across 5 user-weighted criteria (Montessori 30%, Safety 30%, Daycare 15%, Travel 15%, Fees 10%) with penalty logic for conflicting/stale facts and localized fee bucketing (Low, Medium, High).
6. **AI Agent with Google Search Grounding:** Powered by Google Gemini via server-only endpoints to research schools, parse brochures/fee cards, detect data contradictions, and generate targeted inquiries without hallucination.
7. **Strict Human-in-the-Loop Outreach:** The AI drafts personalized WhatsApp messages, emails, and phone scripts highlighting missing or conflicting school facts, but **never** sends or books anything autonomously. Messages open directly in the user's native device apps (`wa.me`, `mailto:`, `tel:`).
8. **Inbound Reply & Brochure Extraction:** Parents can paste school replies or upload screenshots/PDF fee cards; Gemini extracts verified answers and queues them as suggestions that transition facts to `Confirmed by school`.
9. **Field Visit Mode & Voice Journaling:** Comprehensive in-person visit checklists with integrated voice recording, automated transcription, and AI-generated visit summaries.
10. **Design System & Zero-Emoji UX:** High-contrast, calming teal/amber/neutral palette, custom typography (Bricolage Grotesque + DM Sans), Lucide stroke icons, strictly no emojis, WCAG AA compliance, and mobile PWA installability.

---

## 2. Technical Stack & Architecture

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React icons (stroke icons only, no emojis), PWA web app manifest and offline caching.
- **Design System:** Background `#F6F7F4`, Card `#FFFFFF`, Text `#17262A`, Muted text `#55656A`, Primary Teal `#0E5E5A`, Amber Warning `#FDF1DC` / `#7A4A00`, Blue Info `#E6EEF9` / `#1D4F91`, Purple Daycare `#F1EEF8` / `#4B3A86`.
- **Backend:** Firebase Authentication (Google Sign-In), Cloud Firestore (`asia-south2`/`asia-south1`), Cloud Storage.
- **AI Engine:** Google Gemini API via server route handlers with search grounding and Zod schema validation.
- **Maps:** Google Maps Platform (Places API New, Routes API compute route matrix with traffic, Maps JavaScript API).

---

## 3. Seed Schools (Sector 47, Gurugram & Vicinity)

1. **Productive Minds Montessori Pre-School** (Malibu Towne, Sector 47)
2. **Modern Montessori International Preschool** (Sector 48, Sohna Road)
3. **Our Montessori House (OMH)** (Vipul World, Sector 48)
4. **Apple Blossom** (Greenwood City, Sector 46)
5. **KIIT World School Junior** (Sector 46)
6. **iDiscoveri Pre School** (Sector 46)
7. **Eden Castle School** (Sector 49 / Sector 57)
8. **Pallavan Pre-school** (Uppal Southend, Sector 48–49)
9. **Manav Rachna (pre-school)** (Mayfield Garden, Sector 50/51)
10. **GD Goenka La Petite** (Sector 38)
11. **Pathways Early Years** (South City 2, Sector 50)
12. **Footprints Play School & Daycare** (Sector 48, Sohna Road)
13. **Footprints Play School & Daycare** (Sector 52)
14. **Klay Preschool & Daycare** (Uppal Southend, Sector 49)

---

## 4. Phased Build Roadmap

- **Phase 1:** Foundations, design system, Firebase wiring, seed data, and cards view.
- **Phase 2:** Onboarding wizard, cab travel time matrix, 0–100 scoring engine with tests, shortlist and detail views.
- **Phase 3:** Gemini AI grounded discovery, fact provenance extraction, conflict detection, and question generation.
- **Phase 4:** Human-gated outreach composer (WhatsApp/email/call scripts), approval flow, and inbound reply ingestion.
- **Phase 5:** Comparison matrix, visit tracker/kanban, and audio voice journaling with AI summary.
- **Phase 6:** Admin portal, verified answers eval benchmark, and analytics instrumentation.
