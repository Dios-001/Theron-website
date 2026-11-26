# Theron website

Marketing site for Theron, an AI computer vision and intelligent surveillance company.
React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide and Recharts, built with Vite.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # component tests (Vitest + Testing Library)
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Deploy

It is a static site. On Vercel, Netlify or Cloudflare Pages use: build command `npm run build`, output directory `dist`.
Privacy and Terms use hash routes (`#/privacy`, `#/terms`), so no rewrite rules are needed.

## Structure

```
src/
  App.tsx                    page composition and hash routing for Privacy/Terms
  components/                Navbar, Hero, Solutions, HowItWorks, Industries, Benefits,
                             Technology, PipelineDiagram, About, CtaSection, Contact, Footer, Logo
    dashboard/               interactive dashboard preview (state, table, side panel, charts)
    visuals/                 SVG camera scenes with detection boxes, industry illustrations
  data/
    events.ts                SIMULATED cameras and events (seeded, stable)
    solutions.tsx            the four solutions and the form's option lists
    technology.ts            capability list with Core / Where supported / Planned status
    company.ts               real contact details (all null until you add them)
  lib/                       navigation helpers, hooks, lead submission service
  pages/LegalPage.tsx        draft Privacy and Terms (placeholder text)
public/                      favicon, og-image, robots.txt, sitemap.xml
```

## What is real and what is demo

- **Dashboard**: every camera, event, count and rate is simulated in `src/data/events.ts` and labelled as sample data.
  Search, time range, filters, tabs, status changes and CSV export work on that sample data only.
- **Contact form**: validates in the browser. With no backend it runs in **demo mode** and sends nothing
  (the page says so). To connect a backend, set `VITE_LEADS_ENDPOINT` (see `.env.example`); the form then
  POSTs the JSON in `LeadPayload` (`src/lib/leadService.ts`) to that URL.
- **Contact details**: nothing is shown until real values are added to `src/data/company.ts`.
- **No invented claims**: there are no customer logos, testimonials, certifications or accuracy figures.

## Before launch

- Add real contact details in `src/data/company.ts`.
- Connect the lead endpoint and add server-side validation and spam protection.
- Confirm the status of each item in `src/data/technology.ts` (they are provisional) and update the Planned list.
- Replace the draft Privacy Policy and Terms of Service with legal-reviewed text.
- Set the production domain in `public/sitemap.xml` and `public/robots.txt`, add a canonical link in `index.html`,
  and use absolute `og:url` / `og:image` URLs. Most social networks need a PNG or JPG for `og:image`, not the SVG provided.
