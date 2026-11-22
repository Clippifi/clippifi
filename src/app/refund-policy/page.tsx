import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refunds & Payouts — Clippifi",
  description: "How brands pay and get refunds, and how creators earn and withdraw on Clippifi.",
};

// Written from the founders' policy (private FOUNDATION.md §3, §7–§9). Numbers must match the app
// (src/lib/withdraw.ts) and the Creator and Brand Terms; change them together.
export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refunds & Payouts" updated={LEGAL_UPDATED} current="refunds">
      <p>
        How money moves on Clippifi: what brands pay, what comes back to them, how creators earn and how they get paid.
        This page is part of the <Link href="/terms">Creator Terms</Link> and the{" "}
        <Link href="/terms/brands">Brand Terms</Link>. All amounts on Clippifi are in US dollars.
      </p>

      <h2>For brands</h2>

      <h3>1. Paying for a campaign</h3>
      <p>
        <strong>1.1</strong> You prepay the campaign budget, at least $200, before the campaign goes live. You pay
        through our payment partner, and its checkout fee is shown before you pay.
      </p>
      <p>
        <strong>1.2</strong> Our fee is 10% on top of what creators earn, taken only as work is delivered. You never pay
        our fee on budget that isn’t spent.
      </p>

      <h3>2. Unspent budget and refunds</h3>
      <p>
        <strong>2.1 When.</strong> You can ask for unspent budget back after a campaign ends or is cancelled.
      </p>
      <p>
        <strong>2.2 Pending clips first.</strong> Before we work out the refund, we review clips still waiting for a
        decision, because they may be approved and earn. A pending clip can delay a refund.
      </p>
      <p>
        <strong>2.3 Prepaid balance.</strong> Unspent budget goes to your Clippifi prepaid balance. Use it for your next
        campaign, or ask for a refund. In this first version you can’t add money to the prepaid balance directly.
      </p>
      <p>
        <strong>2.4 Timing and fees.</strong> We aim to process a refund within 5 business days after our review; the
        time it takes to reach you depends on our payment partner. If our payment partner doesn’t return its original
        processing fee, that fee isn’t refunded.
      </p>
      <p>
        <strong>2.5 Not refundable:</strong> money creators earned for approved work, and our fee on it. Getting fewer
        views than hoped is not a reason for a refund.
      </p>

      <h3>3. Mistakes and fraud</h3>
      <p>
        If you were charged twice, charged for a campaign that was never created, or charged because of our error, tell
        us and we’ll refund the mistaken amount. If we reverse a creator’s unsettled earnings on your campaign (for
        example a deleted clip or fake views), that money goes back to your campaign budget.
      </p>

      <h3>4. Chargebacks</h3>
      <p>
        If you dispute a payment with your bank instead of contacting us, we may pause your campaigns and account while
        we look into it. Contact {SUPPORT_EMAIL} first.
      </p>

      <h2>For creators</h2>

      <h3>5. How you earn</h3>
      <p>
        <strong>5.1</strong> You earn the campaign’s rate for every 1,000 verified views once your clip passes the
        campaign’s minimum views, counted from submission for 30 days. Rates shown are what you take home, after our 10%
        fee.
      </p>
      <p>
        <strong>5.2</strong> Submit each clip within 30 minutes of posting it. Earnings can be capped per clip, per
        creator and by the campaign’s budget.
      </p>

      <h3>6. When earnings become yours</h3>
      <p>
        <strong>6.1 Before approval</strong> a clip can earn, but that money is held. The brand approves or rejects
        within 48 hours; if it doesn’t answer, the clip is approved automatically when it passes our checks.
      </p>
      <p>
        <strong>6.2 After approval</strong> the clip earns in 7-day rounds. After each round there’s a 3-day hold for
        checks, then that round’s earnings move to your available balance.
      </p>
      <p>
        <strong>6.3</strong> Keep the clip public and unchanged until its last round settles, about 33 days after
        submission. Deleting, hiding or materially editing it can stop earnings and reverse what hasn’t settled.
      </p>

      <h3>7. Withdrawing</h3>
      <ul>
        <li>Minimum $5, maximum $350 a day, one payout a day.</li>
        <li>Paid in naira to a Nigerian bank account in your name, usually within 24 hours on business days.</li>
        <li>Before your first payout, you complete a one-time identity check with our payment partner.</li>
        <li>
          The naira amount uses our payment partner’s exchange rate and fees at the time of the payout. We show an
          estimate before you confirm, but can’t guarantee the exact naira amount.
        </li>
        <li>New or changed bank accounts need an email code, and withdrawals to them start 48 hours later.</li>
        <li>You can’t change bank details while a payout is pending.</li>
        <li>If a payout fails, the money goes back to your available balance.</li>
      </ul>

      <h3>8. Reversals</h3>
      <p>
        We can reverse earnings for fraud, a policy breach, duplicate views, a deleted or altered post, an upheld
        dispute, a brand’s chargeback, or a payment made in error. If a reversal is bigger than your balance, your
        balance can go below zero and your next earnings pay it off.
      </p>

      <h2>Everyone</h2>

      <h3>9. Taxes</h3>
      <p>
        You are responsible for taxes on what you earn or spend through Clippifi. We don’t withhold tax or give tax
        advice.
      </p>

      <h3>10. Changes and contact</h3>
      <p>
        We update this page as payment options change, and tell you about important changes in the app or by email.
        Questions about payments, refunds or payouts: {SUPPORT_EMAIL}.
      </p>
    </LegalLayout>
  );
}
