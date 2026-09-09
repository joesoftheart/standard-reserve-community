# Knowledge Lab — 100-question game

Implemented for `/th/learn` and `/en/learn`. Existing `/quiz` and `/challenges` entry points render the same game. The primary navigation combines learning and missions into Knowledge Lab.

## Game and persistence

- All 100 bilingual questions appear once in a randomly shuffled run; options shuffle independently. Every ranked run covers the same bank and difficulty mix.
- Supabase RPCs own question order, answer locking, score, start time and finish time. Answers and explanations are revealed only after submission.
- `knowledge_runs` stores the run, player id, language, question order and answer history. UUIDs for guest runs are private capability tokens retained in session storage, never placed in share URLs.
- `knowledge_results` stores only completed 100-answer runs. A signed-in player is saved atomically with their final answer. Guests can sign in and claim their completed run.
- `knowledge_leaderboard()` selects one best result per player, ordered by score descending, elapsed milliseconds ascending, then completion time. It returns the top 50 plus the current player's position if outside that range.
- Reset abandons an unfinished run. Refresh resumes the saved run; time includes time away and explanation reading. Elapsed time stops when answer 100 is accepted.
- X sharing opens a draft with the score, time and Knowledge Lab URL; no post is sent automatically. Deployment remains deferred, so shared localhost links are usable only on the local machine.

## Database

Migration `supabase/migrations/20260909_knowledge_100.sql` applied to the configured Supabase project on 2026-09-09. `supabase/knowledge-bank.json` is server-side seed/review content, not imported into client components. No service-role key is used. New tables have RLS and no anon/authenticated table-write grants. Only explicit RPC entry points are exposed. The old practice score tables are retained but not used for the new rankings.

Content is based on https://www.standardreserve.xyz/whitepaper/ (v0.1). Numeric arithmetic questions are explicitly illustrative. Fee allocation percentages are distinct from the exit fee rate; reserve gold is not presented as a direct redemption right. Review and version the bank if protocol terms change.

## Validation

- Production build and TypeScript pass.
- 10 Node tests pass, including 100-question bilingual uniqueness, option integrity and source anchors.
- `supabase/knowledge-regression.sql` passed in the live database using a transaction and a temporary test identity, with all test data rolled back. Covers hidden keys, denied table writes, ordered submissions, 100-answer save, retry idempotency, cross-user isolation, guest claim, one best rank per player and abandoned runs.
- Supabase REST guest smoke passed: start, answer feedback, replay idempotency and leaderboard reads. It did not create a ranked score.
- Browser visual and end-to-end interaction QA remains blocked by the prior automatic-approval browser restriction. See `design-qa.md`. Database tests are not a substitute for visual verification.

## Limits

This is an educational leaderboard, not a bot-proof competition. Server calculation prevents directly submitting a forged score/time, but does not prevent answer memorization, multiple accounts or automation. Guest start abuse controls and run-retention cleanup should be added before a high-traffic public launch. Deploying the website was not requested in this iteration.

## Whitepaper-only revision (v2)

On 2026-09-09 all 100 questions were reviewed against the current official whitepaper page and its referenced content asset `whitepaper-CWJ24W4_.js`. Replaced 30 invented-number arithmetic scenarios plus 10 questions about the community site, unsupported absences/guarantees, or indirect framing with explicitly documented rules. The remaining 60 were checked against their cited sections. Each seed record now includes source URL, version and review date. Wrong answer options are distractors, not assertions about protocol behavior.

New runs use `knowledge-100-v2`, question IDs 101–200. Old questions, active runs and saved results remain intact so existing progress is not silently regraded. Use Restart for the reviewed set. Leaderboard tabs separate current and previous results. Migration: `supabase/migrations/20260909_knowledge_review_v2.sql`.

Curious mascot is shown before an answer, happy thumbs-up after correct answers, and crying after incorrect answers. Desktop game spacing is reduced for laptop-height viewports (including an additional rule below 760px height). No fixed-height clipping or page scroll lock is used; unusually long content, zoom, review and small viewports may still scroll. Actual viewport fit is not visually verified due the existing browser restriction.

## Login and unfinished-run retention (2026-09-09)
- New games require an authenticated account in both UI and database RPCs. X is the configured sign-in provider. Login does not start the timer; pressing Start does.
- State and answer RPCs enforce owner identity; anon execution is revoked. The existing 15-starts/minute/account limit now uses a transaction advisory lock to serialize concurrent starts.
- Before 100 answers, a run has no leaderboard result. UI shows this continuously and requests confirmation before a same-tab link exit, sign-out or restart. Refresh/close uses the browser's native beforeunload message; browsers control its wording and whether it appears.
- Scheduled database task knowledge-unfinished-retention runs at 20:15 UTC daily (03:15 Asia/Bangkok), deleting only unfinished runs started more than 30 days ago with no result. Completed runs and results remain. Public users cannot invoke cleanup.
- Database transaction regression passed, including login requirement, owner isolation, no result before answer 100, retention, schedule and rate limit. Test fixtures rolled back.
- Browser visual/interactions remain unverified because prior automatic approval blocked localhost inspection.
