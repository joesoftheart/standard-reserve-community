# Interactive stories

All eight stories are integrated into /th/simulate and /en/simulate. Original free simulator is preserved in its disclosure.

1. Banker entry: existing seven-step Charter auction story.
2. Branch share: existing six-step story, illustrative 1/4, 1/5, 2/6 shares.
3. Expansion: license purchase, STANDARD payment burned, added Branch.
4. Policy: choose positive, negative or zero aggregate ETH flow, advance to evaluation, observe regime. ETH totals 12/8 and 8/12 are explicitly illustrative. No invented epoch duration or multiplier.
5. Revenue: fee/Charter-auction ETH split 70/15/15, switch expansion and contraction vault outcomes. Gold is protocol-owned; buybacks rate-limited.
6. Withdrawal: choose retirement of one or both of two Branches; release 50% or 100% of balance before unspecified fee, net minting, Branch/Charter retirement.
7. Remaining bankers: low/high exit pressure, 50/50 split of FEE ONLY, allocation shared with other remaining bankers. No fabricated fee rate or personal payout.
8. Dormancy: day29 example, check-in vs day30 plus report, active reset vs revocation. States bounty separately; avoids inventing how bounty is deducted.

Source: https://www.standardreserve.xyz/whitepaper/ sections branches, auctions, net-flow, policy, reserves, exits and dormancy. Checked against previously downloaded official whitepaper JS /tmp/standard-paper.js on 2026-09-09; live web fetch failed in this review. Stage images illustrate processes, not executed transactions or live balances. Existing approved transparent hoodie mascot is reused.

Shared story data: lib/journey-stories.ts. Scene implementations: components/journey-scene.tsx and journey-scene.css. Scenarios are local state only. Buttons advance, reverse, replay, pause decorative movement, and go to next story; final story returns to picker. Reduced-motion styles suppress animation.

Verification: production build / TypeScript and existing 13 tests passed. These tests cover existing engine/auth/question bank/community, not visual story interaction. Live browser visual verification remains blocked by the existing automatic approval restriction; no visual QA claim.
