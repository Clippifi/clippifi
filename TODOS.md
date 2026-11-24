# TODOS

## Campaigns

### Per-post campaign type

**What:** Add a "per post" campaign type that pays a fixed amount for each approved post (optional minimum views), alongside CPM.

**Why:** It's the model the old Clippifi app used (flat ₦5,000 per clip), it's simple for brands to understand, and nobody can ever be owed money under it.

**Context:** Deferred by /autoplan CEO review (2026-11-12, X7) because the approved v1 premise keeps scope to the CPM money loop. Store per-post terms as `amountCents` + `minViews` and pay after approval, subject to the same hold and fraud review. It reuses the v1 ledger: each approved post reserves a known amount from escrow; submissions close when the budget can't cover another post. Start from `src/server/ledger` (accrue) and the campaign wizard.

**Effort:** M (human) / S (CC)
**Priority:** P2
**Depends on:** v1 CPM money loop shipped.

### Public share link for the brand report

**What:** Let a brand share a read-only campaign report link with people who have no account.

**Why:** Marketing managers report upward; a link is easier than a CSV.

**Context:** Deferred in the design doc and again by /autoplan CEO review (X8). Needs an unguessable, revocable token and a decision on which fields are public. Shape: "Anyone with this link can view a live, read-only report".

**Effort:** S (human) / S (CC)
**Priority:** P3
**Depends on:** v1 brand report page.

## Onboarding

### Guided "first dollar" path for new clippers

**What:** A step-by-step onboarding path that takes a new clipper from sign-up to their first payout (link TikTok, pick a campaign, post within 30 minutes, submit, reach the minimum).

**Why:** New clippers drop off before their first earning; a dedicated guided page fixes this.

**Context:** Deferred by /autoplan CEO review (X9) as outside the minimum v1 scope. The X6 earnings explainer on the campaign page covers the essentials for launch.

**Effort:** M (human) / S (CC)
**Priority:** P3
**Depends on:** v1 clipper flow.

## Reliability

### Load test the money loop at 10x before campaign 5

**What:** A load test with 1,000 active submissions across 10 campaigns, running track-views, accrual, settlement and withdrawals concurrently.

**Why:** v1 is sized for one campaign and ~100 clippers. Hot ledger rows and job batching were redesigned on paper (eng review H2/H3), but nothing has measured them.

**Context:** From /autoplan eng review (2026-11-12, task E6). Use the fake PaymentProvider and ViewSource plus `pnpm jobs:run --now`. Watch for lock_timeout retries, lease overruns and settle-rounds latency. Start from `src/server/ledger` and `src/jobs`.

**Effort:** M (human) / S (CC)
**Priority:** P2
**Depends on:** v1 money loop shipped.

## Completed

- **Design catch-up: D1 to D3 screens to the 2026-11-22 policy** (done 2026-11-22): take-home rates, payout limits, earnings tiers, waiting-for-approval earnings, identity row.

## Docs

### Archive the money-loop plan's review history

**What:** Move the review notes (about 1,300 lines, estimated) out of the money-loop plan in the private repo into an archive file next to it, leaving the plan as the clean rules.

**Why:** PRODUCT.md links to the plan for the full money rules; readers following those links should land on the rules, not on planning-session review notes.

**Context:** Raised by /office-hours (2026-11-19) as an open question and accepted by /plan-ceo-review the same day (D12). The rules are the first ~430 lines; everything after is review history. Keep the plan's headings stable so links from PRODUCT.md still work.

**Effort:** S (human) / S (CC)
**Priority:** P3
**Depends on:** PRODUCT.md written.
