import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund & Payout Policy — Clippifi",
  description: "How campaign payments, refunds and creator payouts work on Clippifi.",
};

export default function RefundPolicyPage() {
  return (
    <LegalLayout title="Refund & Payout Policy" updated={LEGAL_UPDATED}>
      <p>
        This policy explains how money moves on Clippifi: what brands pay, what comes back to them,
        how creators earn and how they get paid. It is part of our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>

      <h2>For brands</h2>

      <h3>1. Paying for a campaign</h3>
      <ul>
        <li>
          You fund the full campaign budget before the campaign goes live. Budgets are kept in US
          dollars. If you pay in naira, we convert it at the rate shown before you pay; that quote
          includes a small buffer, and anything left over from it is added to your Clippifi
          balance.
        </li>
        <li>The payment provider’s checkout fee is added to what you pay and shown before you pay.</li>
        <li>
          Clippifi’s fee (10% unless a different fee is shown before you pay) is taken only as
          creators earn, in proportion to the work delivered. You never pay a fee on budget that
          is not spent.
        </li>
      </ul>

      <h3>2. Unspent budget</h3>
      <ul>
        <li>
          When a campaign ends (you end it, or its end date passes), approved clips keep earning
          until their 30-day windows close. When the last payouts settle, the unspent budget and
          the unused part of the fee go back to your Clippifi balance.
        </li>
        <li>
          You can use your balance for another campaign, or ask for a refund. Refund requests are
          reviewed within 5 to 7 business days.
        </li>
        <li>
          Refunds are paid by bank transfer to your bank account (Nigerian accounts first), in
          naira at the current rate less a spread of up to 1.5% and the transfer fee. A refund is
          never more than the naira you originally paid. We show you the amount before it is sent.
        </li>
        <li>
          Money already earned by creators for delivered work, and the fee on it, cannot be
          refunded. Not getting as many views as hoped is not a reason for a refund.
        </li>
      </ul>

      <h3>3. Mistakes and fraud</h3>
      <p>
        If you were charged twice, charged for a campaign that was never created, or charged
        because of an error on our side or fraud by someone else, contact us and we will refund the
        mistaken amount in full. If a creator’s earnings on your campaign are cancelled (for
        example, the clip was deleted early or failed a fraud review), that money goes back to your
        campaign budget.
      </p>

      <h2>For creators</h2>

      <h3>4. How you earn</h3>
      <ul>
        <li>
          On a CPM campaign you earn the campaign’s rate for every 1,000 verified views, counted
          from zero once your clip reaches the campaign’s minimum views. Other payout types are
          explained on their campaign pages.
        </li>
        <li>Views count for 30 days from when you submit the clip. You must submit within 30 minutes of posting.</li>
        <li>Earnings can be capped per clip, per creator and by the campaign’s remaining budget.</li>
      </ul>

      <h3>5. When earnings become available</h3>
      <ul>
        <li>
          Your clip earns in 7-day rounds from approval. After each round there is a 3-day hold,
          then that round’s earnings move to your available balance.
        </li>
        <li>
          Earnings on a flagged clip stay on hold until we review it. If the flag is upheld, those
          unsettled earnings are cancelled.
        </li>
        <li>
          Keep your clip public until its last round settles (about 33 days after submission, up to
          40). If it is deleted or made private and not restored in time, its unsettled earnings are
          cancelled. See Section 7 of the <Link href="/terms">Terms</Link>.
        </li>
        <li>Earnings in your available balance are final.</li>
      </ul>

      <h3>6. Withdrawing</h3>
      <ul>
        <li>Minimum withdrawal $10, maximum $1,000 per day.</li>
        <li>
          Paid by bank transfer through our payment partner in your local currency, in countries we
          support (Nigeria first). Before you confirm, we show the estimated amount after the
          exchange rate (which includes a spread of up to 1.5%) and the transfer fee. If the rate
          moves more than 1% before sending, we ask you to confirm again.
        </li>
        <li>New or changed bank accounts need an email code, and withdrawals to them wait 48 hours.</li>
        <li>
          The name on a new bank account must match your legal payout name. If it does not, that
          account is held until you upload an ID or bank statement and we approve it.
        </li>
        <li>If a transfer fails, the money goes back to your available balance and you can try again.</li>
        <li>Withdrawals can be paused while your account is under a fraud review.</li>
      </ul>

      <h2>Everyone</h2>

      <h3>7. Taxes</h3>
      <p>
        You are responsible for any taxes on money you earn or spend through Clippifi. We do not
        withhold tax or give tax advice.
      </p>

      <h3>8. Changes</h3>
      <p>
        We will update this page as payment options change (for example, new payout countries) and
        tell you about important changes in the app or by email.
      </p>

      <h3>9. Contact</h3>
      <p>Payment, refund or payout questions: {SUPPORT_EMAIL}.</p>
    </LegalLayout>
  );
}
