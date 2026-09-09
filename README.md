# Standard Reserve Community Hub

Next.js + React + Tailwind CSS. English and Thai routes share one application. Guest learning, quizzes, six challenges, and the educational simulator work without credentials.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000/en or /th. Run npm test, npm run typecheck, and npm run build for validation.

## Optional database and X login

1. Create a Supabase project and run supabase/schema.sql in its SQL editor before users sign in.
2. Copy .env.example to .env.local and enter the project URL and anon key. Never expose a service-role key.
3. Enable X / Twitter (OAuth 2.0) in Supabase Authentication, configure the provider credentials, and use the callback URL displayed by Supabase in the X developer application.
4. Add the app /auth/callback URL to the Supabase redirect allowlist. Set the Supabase Site URL to the production origin.
5. Add curated community_members records through the Supabase dashboard. Public clients cannot write contributor data.

Saved scores are client-submitted practice scores, not verified competitive results. Simulation results are private to their owner. Quiz/challenge scores and public profile fields appear on the public leaderboard after saving. Add server-side validated attempts before using scores for rewards or access.

## Deployment

Import this directory into a GitHub repository, then import it in Vercel as a Next.js project (build: npm run build). Set NEXT_PUBLIC_SITE_URL to the production HTTPS origin, add the Supabase environment values, and deploy. X authentication stays optional. Set NEXT_PUBLIC_ENABLE_THAI=false to hide the selector while retaining translations and Thai routes.

## Content and model

Official source: https://www.standardreserve.xyz/whitepaper/ (reviewed 2026-09-09). The whitepaper is a design overview, not an implementation specification. Policy direction, proportional branch issuance, license burns, and charter closure are taught from that source.

Every numeric simulator balance, flow modifier, rate, cost, and price is illustrative. The simplified model is not a protocol replica or solvency forecast. The current model treats Expand as purchasing a license. It does not model accrued issuance, token prices, vault accounting, or actual resolution fee formulas.

Founder biographies and contributor identities are deliberately unpopulated until sourced. Result links contain user-supplied educational summaries; social cards are generated dynamically, not verified attestations.

For step-by-step X OAuth 2.0 setup, see AUTH_SETUP.md.
