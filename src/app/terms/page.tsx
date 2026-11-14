import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service — Clippifi",
  description: "The terms that govern your use of Clippifi.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated={LEGAL_UPDATED}>
      <p>
        Clippifi (“Clippifi”, “we”, “us” or “our”) is a marketplace for clipping and user-generated
        content (UGC) campaigns. Clippifi is run by its founders from Nigeria and is not yet
        incorporated as a registered company. These Terms of Service (“Terms”) govern your use of
        the Clippifi website and services (the “Platform”). By creating an account or using the
        Platform, you agree to these Terms, our <Link href="/privacy">Privacy Policy</Link> and our{" "}
        <Link href="/refund-policy">Refund &amp; Payout Policy</Link>. If you do not agree, do not
        use the Platform.
      </p>

      <h2>1. What Clippifi does</h2>
      <p>Clippifi connects two kinds of users:</p>
      <ul>
        <li>
          <strong>Brands</strong> fund campaigns (clipping, sound, logo or UGC campaigns), write a
          brief, set a budget and choose how creators are paid. Most campaigns pay a fixed rate per
          1,000 verified views (“CPM”). Some campaigns may pay per post, as a retainer or as a share
          of a prize pool; the payout terms for each campaign are shown on its campaign page before
          you join.
        </li>
        <li>
          <strong>Creators</strong> (also called clippers) post short videos on the platform a
          campaign names (TikTok, Instagram or YouTube) and submit them to the campaign.
        </li>
      </ul>
      <p>
        Clippifi checks each submitted video, counts its views, works out what the creator has
        earned under the campaign’s terms, pays the creator from the campaign budget and reports
        results to the brand. An account can be a brand, a creator or both. Clippifi is not
        affiliated with, endorsed by or sponsored by TikTok, Instagram, YouTube or any brand that
        runs a campaign.
      </p>

      <h2>2. Eligibility</h2>
      <ul>
        <li>You must be at least 18 years old to use the Platform.</li>
        <li>
          You may hold only one Clippifi account. You must give accurate information and keep it up
          to date.
        </li>
        <li>
          Anyone may sign up, but withdrawals are only available in countries where our payment
          partner supports payouts (see Section 9). You may not use the Platform where it is
          against the law where you live.
        </li>
      </ul>

      <h2>3. Your account</h2>
      <p>
        You sign in with Google, or with a one-time code we email to you; there is no password. You
        are responsible for keeping your login details secure and for everything done through your
        account. Tell us straight away at {SUPPORT_EMAIL} if you think someone else has accessed it.
        We may ask you to confirm your email address or use a one-time code for sensitive actions
        such as adding a bank account.
      </p>

      <h2>4. Linking your social accounts</h2>
      <ul>
        <li>
          To submit clips, creators link the social account they post from inside the app, using
          that platform’s official login (for TikTok, “Login with TikTok”). Linking an account does
          not sign you in to Clippifi. You must only link accounts
          you own and control.
        </li>
        <li>
          Each social account can be linked to only one Clippifi account. An account already linked
          to another Clippifi user will be refused.
        </li>
        <li>
          Linking lets us read your profile basics and the videos you submit, as described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>. We never post, edit or delete anything on
          your social accounts.
        </li>
        <li>
          You can unlink at any time. While an account is unlinked we cannot check or count your
          clips, so earnings that are not yet settled wait. If you do not reconnect within 7 days of
          a payout hold ending, the unsettled earnings on those clips are cancelled (Section 7).
        </li>
      </ul>

      <h2>5. Campaigns (brands)</h2>
      <p>As a brand, you agree that:</p>
      <ul>
        <li>
          You will fund the full campaign budget, plus any payment processing fee shown at
          checkout, before the campaign goes live. Clippifi holds the budget to pay creators for
          the work your campaign receives.
        </li>
        <li>
          Clippifi’s fee (10% unless a different fee is shown before you pay) is charged only on
          work delivered, as creators earn. Unspent budget and the unused part of the fee come back
          to you when the campaign ends, as set out in the{" "}
          <Link href="/refund-policy">Refund &amp; Payout Policy</Link>.
        </li>
        <li>
          Your brief, assets and requirements are accurate and lawful, and you have the rights to
          any material (videos, sounds, logos) you ask creators to use.
        </li>
        <li>
          You can review submissions and reject clips that do not follow your brief. Rejected clips
          stop earning. Earnings already settled to a creator are final.
        </li>
        <li>
          When the budget runs out the campaign closes to new earnings. Views gained after that are
          not paid.
        </li>
      </ul>

      <h2>6. Submitting clips and earning (creators)</h2>
      <ul>
        <li>
          <strong>Your own posts only.</strong> You may only submit public videos posted from your
          own linked account, and you must have the right to use everything in them.
        </li>
        <li>
          <strong>Submit within 30 minutes.</strong> A clip must be submitted within 30 minutes of
          being posted. Older posts are refused, because views are paid from zero.
        </li>
        <li>
          <strong>Checks.</strong> Every submission is checked automatically (account ownership,
          duplicates, post age, account reuse) and may be reviewed by the brand or by Clippifi.
        </li>
        <li>
          <strong>How earnings are counted.</strong> On a CPM campaign you earn the campaign’s rate
          for every 1,000 verified views, counted from zero once the clip reaches the campaign’s
          minimum views. Views count for 30 days from submission. Earnings can be capped per clip,
          per creator and by the remaining campaign budget. These limits are shown on the campaign
          page.
        </li>
        <li>
          <strong>Payout rounds.</strong> A clip earns in 7-day rounds starting when it is
          approved. Each round is held for 3 days and then, if nothing is flagged, its earnings
          become available to withdraw.
        </li>
        <li>
          <strong>Our counts.</strong> View counts come from the platform’s official data where it
          is available. If a count cannot be read for a while, the clip waits; it does not lose
          views that are counted later.
        </li>
      </ul>

      <h2>7. Keep your clip live</h2>
      <p>
        A submitted clip must stay public on your account until its last payout round settles. That
        is about 33 days after submission (the 30-day window plus the final 3-day hold), or up to
        40 days if approval came late. We check this regularly. If a clip is deleted or made
        private, we notify you to restore it. If it is still missing at a check at least 6 hours
        later, all earnings on that clip that have not yet settled are cancelled and returned to the
        campaign budget. This is final, even if you restore the clip afterwards. Removing clips
        early twice within 30 days puts your account under manual review.
      </p>

      <h2>8. Fraud and fake engagement</h2>
      <ul>
        <li>
          You must not use bots, bought views, view or engagement exchanges, re-uploads of other
          people’s content, multiple accounts or any other way of inflating or faking results.
        </li>
        <li>
          Suspicious activity (for example, unusual view patterns or a sudden drop in views) is
          flagged. A flagged clip stops earning, and its pending earnings are paused until a person
          reviews it. If the flag is upheld, unsettled earnings are cancelled.
        </li>
        <li>
          Earnings that have already settled are final. If we find fraud after that, we may freeze
          withdrawals while we review, and suspend or close the account.
        </li>
      </ul>

      <h2>9. Withdrawals</h2>
      <ul>
        <li>
          Balances are kept in US dollars. You can withdraw your available balance to a bank account
          in a supported country, subject to a minimum of $10 and a maximum of $1,000 per day.
          Nigeria is supported first; more countries will be added.
        </li>
        <li>
          Withdrawals are paid in your local currency through our payment partner. Before you
          confirm, we show the estimated amount you will receive after the exchange rate (which
          includes a spread of up to 1.5%) and the transfer fee.
        </li>
        <li>
          Adding or changing a bank account needs a one-time code sent to your email, and
          withdrawals to a new account wait 48 hours.
        </li>
        <li>
          Your legal payout name is taken from your bank’s records the first time you add an
          account. It is never shown publicly and is separate from your display name. If a later
          bank account is in a different name, that account is held until you send an ID or bank
          statement and we approve it.
        </li>
      </ul>
      <p>
        Full details are in our <Link href="/refund-policy">Refund &amp; Payout Policy</Link>.
      </p>

      <h2>10. Your content</h2>
      <p>
        You keep ownership of everything you post and submit. By submitting a clip, you allow
        Clippifi to store and display the clip’s link, thumbnail, caption and statistics on the
        Platform and in reports to the brand that ran the campaign, for as long as needed to run
        the campaign and keep records. Any further use of your clip by a brand is between you and
        that brand, under the campaign brief you accepted.
      </p>

      <h2>11. Payments</h2>
      <p>
        Payments and payouts are processed by our payment partners (Flutterwave, and Paystack
        where enabled). Card details are entered with them directly; Clippifi never sees or stores
        your full card number. Fees charged by your own bank or card issuer are your
        responsibility.
      </p>

      <h2>12. Acceptable use</h2>
      <p>You must not:</p>
      <ul>
        <li>post, submit or request content that is illegal, infringing, hateful, deceptive or sexual involving minors;</li>
        <li>impersonate anyone or misrepresent who you are or who you work for;</li>
        <li>use the Platform to launder money or hide the purpose of a payment;</li>
        <li>break the rules of TikTok, Instagram, YouTube or any other platform you post on, including their rules on disclosing paid promotions;</li>
        <li>access other users’ accounts, scrape the Platform, or get around security, limits or checks.</li>
      </ul>
      <p>
        We may remove content, reject clips, cancel unsettled earnings, or suspend or close accounts
        that break these Terms.
      </p>

      <h2>13. Taxes</h2>
      <p>
        You are responsible for any taxes on money you earn or spend through Clippifi. We do not
        withhold tax for you or give tax advice.
      </p>

      <h2>14. Disclaimers</h2>
      <p>
        The Platform is provided “as is” and “as available”. We do not guarantee that a campaign
        will receive a certain number of clips or views, that a creator will earn any particular
        amount, or that third-party platforms will keep providing the data we rely on. Results on
        social platforms are outside our control.
      </p>

      <h2>15. Limitation of liability</h2>
      <p>
        To the fullest extent the law allows, Clippifi is not liable for indirect or consequential
        losses, including lost profits, lost income or lost data. Our total liability for any claim
        is limited to the fees you paid to Clippifi in the three months before the claim arose, or,
        for a creator, the settled balance in your account.
      </p>

      <h2>16. Closing your account</h2>
      <p>
        You can ask us to close your account at any time by emailing {SUPPORT_EMAIL}. Withdraw your
        available balance first; we will pay out any remaining settled balance unless your account
        is under a fraud review. We may suspend or close accounts that break these Terms, for
        suspected fraud, or where the law requires it.
      </p>

      <h2>17. Changes</h2>
      <p>
        We may update these Terms as the Platform changes. We will update the date at the top of
        this page and tell you in the app or by email about important changes. Using the Platform
        after a change means you accept the updated Terms.
      </p>

      <h2>18. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be
        handled by the courts of Nigeria, unless the law where you live gives you the right to
        bring a claim elsewhere.
      </p>

      <h2>19. Contact</h2>
      <p>Questions about these Terms: {SUPPORT_EMAIL}.</p>
    </LegalLayout>
  );
}
