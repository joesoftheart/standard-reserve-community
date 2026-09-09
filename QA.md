# MVP verification — 9 September 2026

- Production build and TypeScript check: passed.
- Simulation engine: 6 tests passed, including zero-flow policy boundary, license burn, final branch closure, branch cap, depleted reserves, and nonfinite inputs.
- All 18 English/Thai page routes: HTTP 200. Invalid challenge URL: HTTP 404.
- Browser: positive flow enters expansion; heavy selling changes policy to contraction and updates reserve and burns.
- Knowledge quiz: all ten questions completed, 10/10 result displayed, save notification preserves the result.
- First Epoch challenge: correct response produces 100/100 and explanation.
- Five-epoch stress scenario: stops at epoch 5 and shows 76.80 simulated ETH remaining for holding throughout. Completion points are not a measure of real-world solvency.
- Responsive checks: 390px Thai mobile homepage and simulator; 1440px desktop homepage. No horizontal page overflow in the checked views. Mobile navigation opens and shows all seven routes.
- Share card endpoint: PNG 1200x630; Thai title and result visually inspected with bundled Noto Sans Thai font.

## Not live yet

- Supabase project and database are configured. Public reads of community_members and leaderboard passed. X provider credentials remain unconfigured; authenticated saving and sign-in are not yet integration-tested.
- Contributor profiles and founder biography require verified owner-supplied content.
- Vercel publication deferred at the user's request. Local server runs at http://localhost:3000.
- Share links use the current origin. Localhost links are only suitable for local testing until a public deployment exists.

## Authentication setup progress

- Applied supabase/schema.sql in one transaction successfully.
- Registered http://localhost:3000/auth/callback as the allowed redirect.
- Stored Supabase URL and public publishable key in ignored .env.local.
- X OAuth 2.0 provider awaits the owner’s developer app Client ID and Client Secret.
