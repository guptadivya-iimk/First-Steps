# Data collection prompt

Hand everything below the line to a research agent. It returns JSON that drops
straight into `src/data/seedSchools.ts`, which is why the schema is spelled out
rather than described.

Change only the two lines marked **SET THIS** before sending.

---

## Your task

You are researching preschools and daycares so that parents can compare them
honestly. You are not writing marketing copy and you are not recommending
anything. You are collecting facts, and for every single fact you must record
where you got it and when.

**SET THIS — area to cover:** Sector 47, Gurugram, Haryana, and every
preschool or daycare within roughly 6 km of 28.4283, 77.0456.

**SET THIS — how many schools:** as many as you can find in that radius, aim
for at least 40.

### The rule that matters most

Never write a fact you cannot source. If a school's fees are not published
anywhere, the fee field is absent. Do not estimate it, do not infer it from
nearby schools, and do not write "approximately". An absent fact is useful to
us, because the app turns it into a question the parent asks the school. A
guessed fact is worse than nothing, because a parent may choose a school on it.

If two sources disagree, record **both**, and mark the fact as conflicting.
Disagreement is a finding, not a problem to tidy away.

## Where to look

Work through these in order. Earlier sources outrank later ones.

1. **The school's own website.** Fees, timings, curriculum, age ranges,
   contact details, admission dates.
2. **The school's Instagram or Facebook page.** Often more current than the
   website. Tells you whether the school is still operating, roughly how big
   the classes are, and when admissions open. Note the date of the most recent
   post.
3. **Google Maps / Google Business Profile.** Address, coordinates, phone,
   opening hours, photographs, review count and rating.
4. **Google reviews, the text and not the stars.** See the review section
   below. This is one of the most valuable things you can bring back.
5. **The Montessori directories.** This is important and most researchers skip
   it. Any school in India may paint "Montessori" on its gate. Check whether
   the school actually appears in:
   - Association Montessori Internationale: `montessori-ami.org`
   - American Montessori Society: `amshq.org`
   - Indian Montessori Centre and Indian Montessori Foundation
   Record whether it is listed, not listed, or you could not check.
6. **Franchise brand sites** for chains such as Footprints, Klay, Kidzee,
   EuroKids, Shemrock, Bachpan, Hello Kids. Branch pages are standardised.
7. **Listing aggregators** last, and treat them with suspicion: Kiddenz,
   SchoolMyKids, Sulekha, Justdial, UrbanPro. They carry stale fees and
   curriculum badges the school never claimed. Useful only to find schools you
   had not heard of, and as a second source that may conflict with the first.

## What to collect, per school

### Identity

| Field | Notes |
|---|---|
| `id` | lowercase slug, words joined by hyphens, ending in the sector, e.g. `apple-blossom-sec-46` |
| `name` | full name as the school writes it |
| `brand` | the chain, if it is one, e.g. `Footprints`. Omit for independents |
| `branchName` | e.g. `Sector 48` |
| `address` | full street address. If sources disagree, give the school's own and note the conflict |
| `sector` | e.g. `Sector 47` |
| `city` | `Gurugram` |
| `location` | `{ "lat": 28.4294, "lng": 77.0461 }`, **six decimal places, from Google Maps**. This is what puts the pin on the map, so get it right. Never approximate from the sector alone |
| `placeId` | Google Maps place ID if you can get it |
| `website` | full URL |
| `googleMapsUrl` | full URL |
| `status` | `active`, `unverified`, or `possibly_closed` |

Mark `possibly_closed` when the phone is dead, the website is gone, the
Instagram has been silent for over a year, or reviews say it shut. Say which in
a `statusNote` fact.

### Contacts

An array. Collect every one you find.

```json
"contacts": [
  { "type": "phone",    "value": "+91 97119 00854", "label": "Admissions", "source": "school_website" },
  { "type": "whatsapp", "value": "+919711900854",   "source": "school_website" },
  { "type": "email",    "value": "hello@example.com", "source": "school_website" }
]
```

`type` is one of `phone`, `whatsapp`, `email`. `source` is one of
`school_website`, `listing_site`, `school_reply`, `visit`, `parent_report`.
Phone numbers in international format. WhatsApp numbers digits only, with the
country code and no spaces.

### Facts

Every fact uses the same shape. This is the part that must be exact.

```json
"curriculum": {
  "key": "curriculum",
  "value": "montessori",
  "displayText": "Montessori programme",
  "status": "website",
  "confidence": 0.9,
  "sources": [
    {
      "type": "school_website",
      "name": "School website",
      "url": "https://example.com/about",
      "quote": "Our programme follows the Montessori method",
      "capturedAt": "2026-11-07"
    }
  ]
}
```

- `value` — machine readable. A number for money, `true`/`false` for yes-or-no,
  a short lowercase string otherwise.
- `displayText` — what a parent reads, under about 50 characters. Plain and
  neutral. Not "Excellent Montessori facilities!"
- `status` — one of:
  - `confirmed` — the school told you directly
  - `website` — the school's own website says it
  - `listing` — only a listing site says it
  - `conflicting` — sources disagree, and you have listed each of them
  - `old` — the source is over 18 months out of date
  - `unknown` — you found a mention but could not establish it
- `confidence` — 0 to 1. Use 1.0 confirmed, 0.9 website, 0.7 listing,
  0.55 conflicting, 0.6 old.
- `sources` — at least one, and **all** of them when they disagree. `quote` is
  the source's own words, copied exactly, not your summary. `capturedAt` is
  the date you looked, as `YYYY-MM-DD`.
- `conflictNote` — only on a conflicting fact. One sentence naming the
  disagreement, e.g. `Website says 9:00 to 1:00, Kiddenz says 8:15 to 2:15`.

#### The fact keys, in priority order

**Tier one. Collect these for every school.**

| Key | Value | Notes |
|---|---|---|
| `curriculum` | `pure_montessori`, `montessori`, `montessori_reggio`, `montessori_playway`, `montessori_other`, `playway`, `HighScope`, `XSEED`, `eyfs`, `other` | Use what the school claims. The accreditation check below is what tests the claim |
| `montessoriAccreditation` | `ami`, `ams`, `imc`, `none_found`, `not_checked` | Whether the school appears in a directory. If it claims Montessori and is not listed, say `none_found`. This is a headline fact for us |
| `feeMonthly` | number, rupees | Monthly tuition only |
| `ageMinMonths` | number | Youngest age the school accepts, in months |
| `ageMaxMonths` | number | Oldest |
| `cctvInstalled` | `true`/`false` | Cameras exist |
| `cctvParentAccess` | `true`/`false` | **Parents can watch a live feed.** Not the same thing as the row above, and schools blur the two. Keep them apart |
| `daycareAvailable` | `true`/`false` | Care past the school day |
| `daycareHours` | string, e.g. `8:00 AM to 6:30 PM` | |
| `timings` | string, e.g. `9:00 AM to 1:00 PM` | Core preschool hours |

**Tier two. Collect where published.**

| Key | Value | Notes |
|---|---|---|
| `admissionFee` | number | One-off, at joining |
| `securityDeposit` | number | Say in `displayText` whether it is refundable |
| `annualCharges` | number | Yearly charges beyond tuition |
| `firstYearTotal` | number | Tuition for 12 months plus admission plus deposit plus annual plus uniform plus transport. **This is the number parents actually pay and almost nobody publishes it.** Only include it if you can add it up from published parts, and list every part in the `quote` |
| `feeAnnual` | number | If the school quotes a yearly figure |
| `daycareFee` | number | Monthly, if charged separately |
| `transportAvailable` | `true`/`false` | School van |
| `vanFemaleAttendant` | `true`/`false` | A woman on board. Matters a great deal to parents of girls in Gurugram |
| `womenOnlyToileting` | `true`/`false` | Only women help with toileting and changing |
| `policeVerification` | `true`/`false` | All staff, drivers and guards verified |
| `ratioToddler` | string, e.g. `1:6` | Adults to children in the toddler room. The best single predictor of care quality, and rarely published |
| `capacity` | number | Total children |
| `admissionsDates` | string, e.g. `Applications open November, session starts April` | Answers "how early should I apply" |
| `openSince` | number, a year | How long it has operated |
| `mealsProvided` | `true`/`false` | |
| `outdoorPlayArea` | `true`/`false` | |

**Tier three. Only if you genuinely find it.**

`seatsAvailable` (number), `waitingList` (`true`/`false`), `refundPolicy`
(string), `leadTeacherTenure` (string), `siblingDiscount` (`true`/`false`).

Do not strain for these. Most schools publish none of them. If a listing site
claims to know seat availability, treat it as `listing` status at best, and
include the date, because it goes stale within weeks.

### Reviews

Add one extra object per school, outside `facts`:

```json
"reviewSignals": {
  "googleRating": 4.3,
  "googleReviewCount": 86,
  "mostRecentReviewDate": "2026-10-02",
  "positiveThemes": ["warm staff", "clean premises"],
  "negativeThemes": ["high teacher turnover", "fees rise mid-year"],
  "safetyMentions": ["a parent reports a child left unsupervised, March 2026"],
  "capturedAt": "2026-11-07"
}
```

Read the review **text**, not the star average, which is easy to game. Themes
must each appear in at least two independent reviews. Quote nothing
defamatory, name no staff member, and for anything under `safetyMentions`
include the month so a parent can judge how old it is. If there are fewer than
five reviews, say so and leave the themes empty.

## Output

One JSON array. No commentary before or after it. Sorted by distance from the
area centre, nearest first.

```json
[
  {
    "id": "example-school-sec-47",
    "name": "Example Montessori House",
    "brand": null,
    "branchName": "Sector 47",
    "address": "Plot 12, Block C, Sector 47, Gurugram",
    "sector": "Sector 47",
    "city": "Gurugram",
    "areaIds": ["gurugram-sec-47"],
    "location": { "lat": 28.429412, "lng": 77.046133 },
    "placeId": "ChIJ...",
    "website": "https://example.com",
    "googleMapsUrl": "https://maps.google.com/...",
    "status": "active",
    "contacts": [
      { "type": "phone", "value": "+91 98100 00000", "label": "Admissions", "source": "school_website" }
    ],
    "facts": {
      "curriculum": {
        "key": "curriculum",
        "value": "montessori",
        "displayText": "Montessori programme",
        "status": "conflicting",
        "confidence": 0.55,
        "conflictNote": "The website says Montessori, Kiddenz lists it as Playway",
        "sources": [
          { "type": "school_website", "name": "School website", "url": "https://example.com/about",
            "quote": "A pure Montessori environment", "capturedAt": "2026-11-07" },
          { "type": "listing_site", "name": "Kiddenz", "url": "https://kiddenz.com/...",
            "quote": "Curriculum: Playway", "capturedAt": "2026-11-07" }
        ]
      },
      "montessoriAccreditation": {
        "key": "montessoriAccreditation",
        "value": "none_found",
        "displayText": "Not listed with AMI, AMS or IMC",
        "status": "website",
        "confidence": 0.9,
        "sources": [
          { "type": "school_website", "name": "AMI school directory",
            "url": "https://montessori-ami.org/find-school",
            "quote": "No result for this school in the India listing",
            "capturedAt": "2026-11-07" }
        ]
      }
    },
    "reviewSignals": {
      "googleRating": 4.3,
      "googleReviewCount": 86,
      "mostRecentReviewDate": "2026-10-02",
      "positiveThemes": ["warm staff"],
      "negativeThemes": ["teacher turnover"],
      "safetyMentions": [],
      "capturedAt": "2026-11-07"
    }
  }
]
```

Then, after the JSON, a short plain list of:

- schools you found but could not research, and why
- schools that look closed
- anything that surprised you

## Before you hand it back, check

1. Every `location` has six decimal places and came from Google Maps, not from
   the sector name.
2. Every fact has at least one source with a date.
3. Every quote is the source's own words, copied, not paraphrased.
4. No fact is present that you could not source. Absent beats guessed.
5. Every `conflicting` fact lists all the disagreeing sources.
6. `cctvInstalled` and `cctvParentAccess` have not been merged.
7. Every school that claims Montessori has a `montessoriAccreditation` fact.
8. The JSON parses.
9. `displayText` reads as plain fact, with no adjectives of praise.
