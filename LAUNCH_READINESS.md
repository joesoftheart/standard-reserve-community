# Launch preparation — 2026-09-09

Published domain: **https://standardreserve.community** (user purchased; explicit production authorization received September 9, 2026). Vercel production deployment is READY, DNS resolves, HTTPS page opens. Production NEXT_PUBLIC_SITE_URL and Supabase Site URL use this origin; the exact /auth/callback URL is allowlisted alongside localhost. X continues to use the same Supabase provider callback.

## User decisions
- End-to-end launch flow testing deferred by the user, not marked passed.
- Developer/contact: @joesofth3art. Contact page links to their X profile; DM delivery depends on X account settings.
- Official X verified via the official site's Twitter link: https://x.com/standard_rsv.
- Community disclaimer, privacy page and public official links are bilingual.

## Source backup / rollback
Commit all current authorized changes on codex/mvp, push to existing private origin, and create a local git bundle under .backups. Secrets and backups must not be committed. Roll back application code by deploying a known prior commit; do not reset live DB blindly. SQL changes should use reviewed forward migrations. Existing migration filenames reflect manual SQL-editor application and are not a clean Supabase CLI migration history.

## Database backup — requires connection setup
Create ignored .env.backup.local using Supabase **session pooler** or direct connection credentials: PGHOST, PGPORT, PGUSER, PGDATABASE, PGPASSWORD. Do not use the transaction pooler for pg_dump. Install pg_dump/pg_restore compatible with the server version (current local pg_dump is 12.2 and may be too old).
Run node scripts/backup-db.mjs. It creates a private custom-format dump and SHA256 manifest, then checks archive readability. That is NOT a restore rehearsal. Restore only into an isolated database/project and verify users, results, grants, triggers, functions and game behavior before claiming recoverability. Supabase managed schemas and auth need the official migration/restore procedure.
Storage objects are not included in DB dumps. Copy community-covers files separately and preserve bucket policies. Keep an encrypted off-machine copy and record a retention policy before launch. No remote DB dump or restore has been completed yet.
Official reference: https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore

## Usage / monitoring
site_visits stores random browser-session IDs, allowlisted page paths, event categories, dates and counts for 30 days. No analytics cookies, account IDs, IP or query strings stored in this table. Opt-out, DNT and GPC honored. Localhost excluded. Counts are approximate; bot events and browser settings can affect them. Stats available at /th/stats or /en/stats to existing community admins only. No historical traffic is reconstructed.
/api/health checks app and Supabase reachability without returning credentials. scripts/check-health.mjs and .github/workflows/health.yml are ready. The scheduled monitor remains inactive until the workflow is on the default branch and GitHub repository variable PUBLIC_SITE_URL points to the deployed site. Configure GitHub Actions failure notifications for the operator; external alert delivery has not been tested.
Run scripts/load-smoke.mjs --staging-confirmed against a staging HTTPS URL before stating capacity. It issues 60 read-only health requests with concurrency 5, not a full gameplay capacity test. No public staging target is available yet, so no load result is claimed.

## Verification
Build and unit tests tracked separately. Local browser UI QA remains blocked by prior automatic approval; the user's decision to skip E2E does not imply a pass.

## Applied status
Analytics migration applied with explicit user approval; SQL regression passed for admin isolation, private raw data, duplicate suppression, allowlists and scheduled retention. Test data rolled back. Source snapshot 6607440 was pushed to private origin and a local complete-history bundle verified. DM recipient 220232477 was read from the developer's saved X identity. Full DB export/restore, domain purchase, deployment, external monitoring activation and load testing remain pending.

## Production deployment
Published using linked Vercel project standard-reserve-community under joesofthearts-projects. Production deployment dpl_88i1DUfg8ofXs2q8BF8QNAijydtx. The live Thai homepage was opened in the browser; full login/game E2E remains deferred per user. GitHub PUBLIC_SITE_URL set to the public domain and health workflow dispatched for verification. Full DB backup/restore rehearsal and gameplay load test remain pending.
