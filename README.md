# Queue-it Max Outflow Explainer

An interactive, tri-lingual (日本語 / English / 한국어) web app that helps customers
understand how Queue-it's **Max Outflow** logic works — and how to size it from the
capacity numbers they already have.

## What it does

- **Explains the model** in one line: `Max Outflow (users/min) = Concurrent capacity ÷ Average stay time` — Little's Law (`L = λ × W`) rearranged.
- **Converts capacity units** into concurrent active users, then into a safe users‑per‑minute release rate:
  - Start from **Concurrent users**, **TPS**, **RPS**, or **Page views**.
  - For throughput inputs, provide the traffic **one active user** generates — either directly, or estimated from behavior (**requests/page per click** + **think time between clicks**).
  - Apply a **target utilization** (safety margin, e.g. 80%).
- **Visual aid**: a minute‑by‑minute chart showing active users ramp up as the site fills, then flatten into steady state once the first cohort's stay time elapses — plus a detailed table with the entering/leaving/active breakdown and the transition minute highlighted.

The default example reproduces the worked case: 100,000 TPS backend, 1 TPS/user,
10‑minute journey, 80% utilization → **8,000 users/minute**.

## Tech

- Next.js 14 (App Router) + React 18, TypeScript.
- No runtime dependencies beyond React/Next; the chart is hand‑rolled inline SVG.
- Calculation logic is isolated in `lib/calc.ts`; all copy lives in `lib/i18n.ts`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Deploy to Vercel

This is a standard Next.js project — no configuration needed.

- **Dashboard**: import the repo at <https://vercel.com/new> and deploy.
- **CLI**:

  ```bash
  npm i -g vercel
  vercel        # preview
  vercel --prod # production
  ```

## Project structure

```
app/
  layout.tsx      root layout + metadata
  page.tsx        main UI (client component)
  globals.css     styling
components/
  TimelineChart.tsx   inline-SVG active-users chart
lib/
  calc.ts         Little's Law + unit conversions + timeline simulation
  i18n.ts         JA / EN / KO dictionaries
```
