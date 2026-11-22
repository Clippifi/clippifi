import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Creator Terms of Service — Clippifi",
  description: "The terms for creators who post clips and earn on Clippifi.",
};

// Written from the founders' policy (private FOUNDATION.md). Every number here must match the
// app (src/lib/withdraw.ts, campaign-math.ts, clip-status.ts) and the landing page; change them together.
export default function TermsPage() {
  return (
    <LegalLayout title="Creator Terms of Service" updated={LEGAL_UPDATED} current="creator">
      <p>
        These Creator Terms are an agreement between you and Clippifi (“Clippifi”, “we”, “us”). Clippifi is run by its
        founders from Nigeria and is not yet incorporated as a registered company. The terms cover how you use Clippifi
        as a creator: joining campaigns, submitting clips, earning and withdrawing. Brands follow the{" "}
        <Link href="/terms/brands">Brand Terms</Link>. Our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/refund-policy">Refunds &amp; Payouts</Link> page are part of these terms.
      </p>
      <p>
        By creating an account, linking a social account, joining a campaign or submitting a clip, you agree to these
        terms. If you don’t agree, don’t use Clippifi.
      </p>

      <h2>1. Words we use</h2>
      <ul>
        <li>
          <strong>Brand</strong>: the business or person who funds and runs a campaign.
        </li>
        <li>
          <strong>Campaign</strong>: a brand’s paid brief, with its budget and its rates per platform.
        </li>
        <li>
          <strong>Clip</strong>: a video you post publicly on a platform the campaign accepts.
        </li>
        <li>
          <strong>Submission</strong>: sending us a clip’s link so it can earn on a campaign.
        </li>
        <li>
          <strong>Minimum views</strong>: the views a clip needs, set by the brand, before it starts earning.
        </li>
        <li>
          <strong>Round</strong>: a 7-day earning period for one clip. Each round is followed by a{" "}
          <strong>hold</strong> of 3 days.
        </li>
        <li>
          <strong>Available balance</strong>: earnings that have passed their hold and can be withdrawn.
        </li>
        <li>
          <strong>Payment partner</strong>: the licensed company that processes payments and payouts for us and runs
          identity checks.
        </li>
      </ul>

      <h2>2. Who can use Clippifi</h2>
      <p>
        <strong>2.1 Age.</strong> You must be at least 18. Clippifi is never open to anyone younger, even with a
        parent’s permission. If we learn an account belongs to someone under 18, we close it.
      </p>
      <p>
        <strong>2.2 One account.</strong> You may have one Clippifi account. Give accurate details and keep them
        current. We ask you to verify your phone number, which we use to confirm you’re a real person, to stop spam and
        to reach you for support.
      </p>
      <p>
        <strong>2.3 Where you live.</strong> Anyone may sign up where the law allows. Withdrawals are only available in
        countries our payment partner supports; in this first version, that is Nigeria. You must not use Clippifi if you
        are on a sanctions list or the law where you live forbids it.
      </p>
      <p>
        <strong>2.4 Your account.</strong> You sign in with Google or with a one-time code sent to your email. You are
        responsible for what happens in your account. Tell us at {SUPPORT_EMAIL} straight away if you think someone else
        has got in.
      </p>

      <h2>3. Who does what</h2>
      <p>
        <strong>3.1 Clippifi</strong> runs the platform: campaigns, submissions, view checks, fraud checks, and the
        record of what you’ve earned.
      </p>
      <p>
        <strong>3.2 Our payment partner</strong> receives brands’ payments, sends your payouts and runs identity
        checks, under its own terms, which you may be asked to accept.
      </p>
      <p>
        <strong>3.3 Your balance</strong> is our record of what we owe you for verified work. It is not a bank
        account and doesn’t earn interest. Clippifi is not a bank, an escrow service or a payment processor.
      </p>

      <h2>4. How you earn</h2>
      <ol>
        <li>Join a campaign and read its brief and rates.</li>
        <li>Post a clip publicly from your linked account.</li>
        <li>
          Submit the clip’s link <strong>within 30 minutes</strong> of posting it. Older posts can’t be submitted.
        </li>
        <li>
          Views count from submission, for <strong>30 days</strong>. Once the clip passes the campaign’s minimum views,
          it starts earning, even while the brand is still reviewing it.
        </li>
        <li>
          The brand approves or rejects the clip within <strong>48 hours</strong> (Section 7). Earnings before approval
          are held, and become yours on approval.
        </li>
        <li>
          An approved clip keeps earning in <strong>7-day rounds</strong>. After each round there is a{" "}
          <strong>3-day hold</strong>, then that round’s earnings move to your available balance.
        </li>
        <li>You withdraw your available balance to your bank (Section 12).</li>
      </ol>

      <h2>5. Our fee</h2>
      <p>
        <strong>5.1 What we keep.</strong> Clippifi keeps 10% of what the brand pays for your views. The brand pays its
        own, separate fee.
      </p>
      <p>
        <strong>5.2 What you see.</strong> Every rate, minimum and maximum we show you is what you take home, after our
        fee. For example, if a brand pays $1.00 per 1,000 views, you see and earn $0.90.
      </p>

      <h2>6. Campaign rules</h2>
      <p>
        <strong>6.1 Each campaign sets its own terms</strong> for each platform: a rate per 1,000 views, minimum views
        and a maximum per clip. It may also cap what one creator can earn. All of these are shown before you join.
      </p>
      <p>
        <strong>6.2 Platforms.</strong> In this first version only TikTok clips can earn. Other platforms are shown as
        coming soon until we can verify their views.
      </p>
      <p>
        <strong>6.3 When a clip stops earning,</strong> whichever comes first: 30 days after submission, reaching the
        campaign’s maximum per clip or per creator, the campaign’s budget running out, the campaign being paused or
        ended, the clip being rejected, or a fraud or policy breach.
      </p>
      <p>
        <strong>6.4 Budget and endings.</strong> A campaign ending or running out of budget never takes back earnings
        already in a round or in your balance; they keep settling as normal. If a clip submitted before a campaign ended
        is approved afterwards, it is paid for what it earned up to approval, if budget remains.
      </p>

      <h2>7. Review and approval</h2>
      <p>
        <strong>7.1 48 hours.</strong> The brand has 48 hours from your submission to approve or reject your clip, and
        must give a reason for a rejection.
      </p>
      <p>
        <strong>7.2 Automatic approval.</strong> If the brand doesn’t respond in time, your clip is approved
        automatically, as long as it meets the campaign’s stated requirements and passes our checks.
      </p>
      <p>
        <strong>7.3 Clippifi has the final say.</strong> We may review any clip, before approval or while it earns,
        including its caption, video, cover and whether it is still public. We can overturn a brand’s decision.
      </p>
      <p>
        <strong>7.4 After approval</strong> a brand can’t ask for changes. It can only reject an approved clip for
        fraud, a policy breach, a deleted or private post, or a dispute we uphold.
      </p>
      <p>
        <strong>7.5 Rejected clips</strong> stop earning, and anything earned before approval is dropped. You may post
        a new version and submit it as a new submission.
      </p>

      <h2>8. Keep your clip live and unchanged</h2>
      <p>
        <strong>8.1 Stay public.</strong> A clip must stay public on your account until its last round settles: the
        30-day window plus the final 3-day hold, about 33 days after submission.
      </p>
      <p>
        <strong>8.2 Deleting or hiding it</strong> before then stops it earning, and earnings that haven’t settled yet
        may be reversed while we investigate.
      </p>
      <p>
        <strong>8.3 Editing it.</strong> If you change the caption, cover or video after submitting, we may pause its
        earnings and review it. A change that alters the brief, the brand’s message or the paid-partnership disclosure
        can lead to rejection or reversal.
      </p>

      <h2>9. Fraud and fake views</h2>
      <p>
        <strong>9.1 What counts.</strong> A view counts only if it comes from your linked account’s public post that you
        submitted, isn’t artificially inflated, and the post stays live and materially unchanged.
      </p>
      <p>
        <strong>9.2 Never fake it.</strong> Don’t buy views, likes or followers, use bots, view exchanges or
        engagement groups, re-upload other people’s content, or run several accounts.
      </p>
      <p>
        <strong>9.3 How we check.</strong> We use automated signals (bot-likelihood, duplicate content, account and
        submission patterns) and people. A person makes every decision to reverse earnings.
      </p>
      <p>
        <strong>9.4 Our count is used.</strong> We pay from the view counts we retrieve from your linked account for
        the submitted post. If the number shown on the platform differs, our verified count is the one used.
      </p>
      <p>
        <strong>9.5 Evidence.</strong> We keep submission links, post IDs, view snapshots, screenshots where available,
        review decisions, ledger entries, messages and fraud flags, to settle disputes.
      </p>

      <h2>10. Disputes</h2>
      <p>
        If you think a rejection, reversal or account action is wrong, email {SUPPORT_EMAIL} with the clip and why. A
        person will review it. Clippifi decides disputes on the platform; this does not affect your legal rights.
      </p>

      <h2>11. Reversals and negative balances</h2>
      <p>
        <strong>11.1 When we reverse.</strong> We can reverse earnings for fraud, a policy breach, duplicate views, a
        deleted or altered post, a dispute we uphold, a brand’s chargeback, or a payment made in error. Reversed
        earnings go back to the campaign.
      </p>
      <p>
        <strong>11.2 Negative balance.</strong> If a reversal is larger than your balance, your balance can go below
        zero. Future earnings pay it off first. We may also hold your balance while a chargeback or fraud review is
        open.
      </p>

      <h2>12. Withdrawals</h2>
      <p>
        <strong>12.1 Balances are in US dollars.</strong> You withdraw in naira to a Nigerian bank account in this first
        version.
      </p>
      <p>
        <strong>12.2 Limits.</strong> Minimum $5, maximum $350 a day, and one payout a day. Payouts are usually sent
        within 24 hours on business days, depending on our payment partner.
      </p>
      <p>
        <strong>12.3 Identity check.</strong> Before your first payout, you complete an identity check with our payment
        partner. The name on your bank account must match the details you verify.
      </p>
      <p>
        <strong>12.4 Exchange rate.</strong> The naira amount is worked out when the payout is processed, using our
        payment partner’s rate and fees. We show an estimate before you confirm, but we can’t guarantee a fixed naira
        amount.
      </p>
      <p>
        <strong>12.5 Bank accounts.</strong> Adding or changing a bank account needs a one-time code sent to your email,
        and withdrawals to a new account start 48 hours later. You can’t change bank details while a payout is
        pending.
      </p>
      <p>
        <strong>12.6 Failed payouts.</strong> If a payout fails, the money goes back to your available balance and we
        ask you to check your bank details.
      </p>

      <h2>13. Your content</h2>
      <p>
        <strong>13.1 You own your clips.</strong> You keep ownership of everything you create, unless a campaign’s
        terms clearly say otherwise before you join.
      </p>
      <p>
        <strong>13.2 What the brand gets.</strong> When your clip is approved, the brand may use it for the campaign’s
        stated purpose: as organic content on the brand’s own channels, for 12 months. Using it in paid advertising
        needs your explicit permission in the brief or in a separate agreement. The brand can’t edit your clip without
        your permission.
      </p>
      <p>
        <strong>13.3 What you may do.</strong> You may repost your clip elsewhere unless the brief says not to. After
        your earnings settle you may delete the post, but if the brand paid for the clip to stay up, deleting it may
        break the campaign’s terms.
      </p>
      <p>
        <strong>13.4 Your promise.</strong> You confirm you own or have permission for everything in your clip: music,
        footage, templates and any brand assets. If you use copyrighted material without permission, we may reject,
        pause or reverse the submission.
      </p>
      <p>
        <strong>13.5 What Clippifi shows.</strong> You allow us to show your clip’s link, cover, caption and statistics
        on Clippifi and in reports to the brand.
      </p>

      <h2>14. Acceptable use</h2>
      <p>
        <strong>14.1 Don’t post or submit</strong> content that is illegal, infringing, sexual involving minors,
        harassing, hateful, deceptive, or that breaks the rules of the platform you post on.
      </p>
      <p>
        <strong>14.2 Paid-partnership disclosure.</strong> Clips are paid promotion. Label them the way the platform
        and the law require (for example, TikTok’s paid-partnership setting or a clear #ad) and follow any disclosure
        the brief asks for.
      </p>
      <p>
        <strong>14.3 Industries we don’t serve:</strong> illegal drugs, weapons, adult sexual services, gambling where
        it is restricted, pyramid schemes, fraudulent financial products, hate speech and political disinformation.
      </p>
      <p>
        <strong>14.4 Don’t misuse the platform:</strong> no impersonation, money laundering, scraping, accessing other
        accounts, or getting around our limits and checks.
      </p>

      <h2>15. Linked social accounts</h2>
      <p>
        You link your TikTok account through TikTok’s official login. The link is read-only: we confirm you own the
        account and read the details and statistics of posts you submit. We never post, edit or delete anything. You
        can unlink at any time; earnings that haven’t settled wait until you reconnect. The{" "}
        <Link href="/privacy">Privacy Policy</Link> lists exactly what we read.
      </p>

      <h2>16. Leaderboards</h2>
      <p>
        Campaign pages may show top creators and top clips: your display name, your clip’s views and an earnings band
        (for example “$100+”), never the exact amount. Your contact details, bank details and identity documents are
        never shown.
      </p>

      <h2>17. Taxes</h2>
      <p>
        You are responsible for taxes on what you earn. We collect tax information only where the law requires us to,
        and we don’t give tax advice.
      </p>

      <h2>18. Suspending or closing accounts</h2>
      <p>
        <strong>18.1 By us.</strong> We may suspend or close an account that breaks these terms, for suspected fraud,
        or where the law requires it. Faking views leads to a permanent ban, and we may block the linked social accounts
        from Clippifi.
      </p>
      <p>
        <strong>18.2 By you.</strong> You can close your account by emailing {SUPPORT_EMAIL}. Withdraw your available
        balance first. We pay out any remaining settled balance unless a fraud review or chargeback is open.
      </p>

      <h2>19. No guarantees</h2>
      <p>
        Clippifi is provided “as is”. We don’t promise any number of campaigns, views or earnings, or that TikTok and
        other platforms will keep giving us the data we rely on.
      </p>

      <h2>20. Limits on our liability</h2>
      <p>
        As far as the law allows, we aren’t liable for indirect or consequential losses, such as lost profits or lost
        data. Our total liability for any claim is limited to the fees you paid us in the three months before the claim
        or, for a creator, your settled balance. Nothing here limits rights the law doesn’t allow us to limit.
      </p>

      <h2>21. General</h2>
      <p>
        <strong>21.1 Changes.</strong> We may update these terms. We change the date at the top and tell you about
        important changes in the app or by email. Using Clippifi after a change means you accept it.
      </p>
      <p>
        <strong>21.2 Order.</strong> These Creator Terms, the Privacy Policy and the Refunds &amp; Payouts page are the
        whole agreement between us. If they conflict, these terms apply, except on privacy, where the Privacy Policy
        applies.
      </p>
      <p>
        <strong>21.3 The rest of the terms stand</strong> if a court finds one part unenforceable. Not enforcing a term
        doesn’t mean we give it up.
      </p>
      <p>
        <strong>21.4 Notices.</strong> We contact you in the app or at your account email. You can reach us at{" "}
        {SUPPORT_EMAIL}.
      </p>

      <h2>22. Governing law</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria. Disputes go to the courts of Nigeria,
        unless the law where you live gives you the right to bring a claim elsewhere.
      </p>
    </LegalLayout>
  );
}
