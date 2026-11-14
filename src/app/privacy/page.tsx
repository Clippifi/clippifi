import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy — Clippifi",
  description: "What Clippifi collects, why, and how you control it.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated={LEGAL_UPDATED}>
      <p>
        This Privacy Policy explains what personal information Clippifi collects, why we collect
        it, who we share it with and the choices you have. Clippifi is run by its founders from
        Nigeria and is not yet incorporated. We are responsible for the information described here.
        You can reach us at {SUPPORT_EMAIL}.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Account information</h3>
      <ul>
        <li>Your name and email address. You sign in with Google or a one-time code sent to your email, so we store no password.</li>
        <li>
          If you sign in with Google, the account identifier, name, email and profile picture Google
          shares with us. We never see your Google password.
        </li>
        <li>Your public display name and profile details you choose to add.</li>
      </ul>

      <h3>Information from TikTok</h3>
      <p>
        When you link your TikTok account from your Clippifi settings, and only with your
        permission, we receive the following through TikTok’s official Login Kit and Display API:
      </p>
      <ul>
        <li>
          <strong>Basic profile</strong> (permission <code>user.info.basic</code>): your TikTok
          account identifier (open ID), display name and profile picture.
        </li>
        <li>
          <strong>Your videos</strong> (permission <code>video.list</code>): your recent public
          videos and, for each, its ID, link, caption, cover image, posting time, length and its
          view, like, comment and share counts.
        </li>
        <li>
          <strong>Access tokens</strong> that let us read the above on your behalf. They are stored
          encrypted.
        </li>
      </ul>

      <h3>Information from other platforms</h3>
      <ul>
        <li>
          Instagram or YouTube account names and links you add, and the public view and like
          counts of videos you submit (for YouTube, read through the YouTube Data API).
        </li>
      </ul>

      <h3>Campaign and submission information</h3>
      <ul>
        <li>Campaigns brands create: briefs, budgets, rates, assets and results.</li>
        <li>
          Clips creators submit: the video details above, the checks we ran, review decisions,
          view counts over time and the earnings calculated from them.
        </li>
      </ul>

      <h3>Payment and payout information</h3>
      <ul>
        <li>
          For brands: payment amounts, currency, the payment provider’s reference and the result of
          each payment. Card details are entered directly with our payment provider and never
          reach us.
        </li>
        <li>
          For creators: your bank name, account number, country, and the account holder name your
          bank returns when we check the account (your “legal payout name”). Bank account numbers
          are shown masked to the last 4 digits.
        </li>
        <li>
          If a bank account name does not match your payout name, the ID document or bank statement
          you upload so we can confirm it.
        </li>
        <li>Your balance, earnings history and withdrawals.</li>
      </ul>

      <h3>Technical and security information</h3>
      <ul>
        <li>
          IP address, device and browser type, and logs of sign-ins and actions. We use these to
          keep accounts secure and to detect fraud such as multiple accounts or fake views.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and run your account and sign you in.</li>
        <li>To confirm you own the social account a clip was posted from.</li>
        <li>To check submissions, count views, calculate earnings and check that clips stay live for the required period.</li>
        <li>To process brand payments, creator withdrawals and refunds, including checking bank account names.</li>
        <li>To show brands the results of their campaigns.</li>
        <li>To detect and prevent fraud and abuse, and to enforce our <Link href="/terms">Terms of Service</Link>.</li>
        <li>To send you service messages (for example, a clip needs attention or a withdrawal was paid) and to answer support requests.</li>
        <li>To meet legal, accounting and tax obligations.</li>
      </ul>
      <p>
        We do not sell your personal information, and we do not use it for advertising or share it
        with advertisers.
      </p>

      <h2>3. How we use TikTok data</h2>
      <ul>
        <li>
          We use your TikTok data only to run Clippifi for you: to show which TikTok account is
          linked, to let you pick a video to submit, and to count the views of clips you submitted
          so you can be paid. We check submitted clips regularly (about every 6 hours) while they
          are in a campaign.
        </li>
        <li>We only read data. We never post, edit, delete or comment on anything on your TikTok account.</li>
        <li>
          Brands see the details and statistics of clips submitted to their own campaigns, and your
          TikTok display name. They do not see your tokens or your other videos.
        </li>
        <li>
          You can unlink TikTok at any time in your Clippifi settings, or remove Clippifi’s access
          in the TikTok app under Settings and privacy → Security → Apps and services. When you
          unlink, we delete your TikTok access tokens. We keep the details and view history of
          clips you already submitted, because they are part of your earnings and the brand’s
          records.
        </li>
        <li>
          Your use of TikTok is also covered by{" "}
          <a href="https://www.tiktok.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
            TikTok’s Privacy Policy
          </a>
          .
        </li>
      </ul>

      <h2>4. Who we share information with</h2>
      <ul>
        <li>
          <strong>Brands</strong>: the display name, social account name, clip details and
          statistics of clips submitted to their campaigns. Never your email, legal payout name,
          bank details or ID documents.
        </li>
        <li>
          <strong>Payment partners</strong> (Flutterwave, and Paystack where enabled): what they
          need to take payments, check bank account names and send payouts.
        </li>
        <li>
          <strong>Service providers</strong> who run parts of the Platform for us: hosting
          (Vercel), databases (Neon, and Google Firebase while we finish moving away from it), email
          delivery and error monitoring. They may only use the information to provide their service
          to us.
        </li>
        <li>
          <strong>Authorities</strong>, when the law requires it, or when needed to protect users
          from fraud or harm.
        </li>
      </ul>

      <h2>5. Where your information is stored</h2>
      <p>
        Our service providers may store and process information outside Nigeria, including in the
        United States and the European Union. When information leaves the country you live in, we
        rely on our providers’ contractual and security commitments to protect it.
      </p>

      <h2>6. How long we keep it</h2>
      <ul>
        <li>Account information: while your account is open.</li>
        <li>TikTok access tokens: until you unlink TikTok or close your account.</li>
        <li>
          Submissions, earnings, payments and withdrawals: as long as needed for accounting, tax,
          fraud prevention and dispute resolution, and as the law requires, even after your account
          is closed.
        </li>
        <li>ID documents and bank statements: only until the review is decided and any dispute about it is resolved, then deleted.</li>
        <li>Security logs: for a limited period, then deleted.</li>
      </ul>

      <h2>7. How we protect it</h2>
      <p>
        Information is encrypted in transit. Social account tokens are encrypted at rest. Access is
        limited to people who need it, admin accounts require two-factor authentication, and every
        admin decision about money or accounts is recorded in an audit log. No system is perfectly
        secure; if a breach affects your personal information, we will tell you and the relevant
        regulator as the law requires.
      </p>

      <h2>8. Cookies and local storage</h2>
      <p>We do not use advertising or cross-site tracking cookies. We use:</p>
      <ul>
        <li>a sign-in session cookie, so you stay signed in, and a short-lived cookie remembering which linked account was used;</li>
        <li>short-lived security cookies while you sign in with Google or link TikTok, which expire within minutes;</li>
        <li>your light or dark mode preference, stored in your browser.</li>
      </ul>

      <h2>9. Your rights</h2>
      <p>
        Depending on where you live, including under the Nigeria Data Protection Act 2023 and, for
        people in the EU or UK, the GDPR, you can ask to access, correct, download or delete your
        personal information, or object to how we use it. Email {SUPPORT_EMAIL} from the email
        address on your account. We may need to confirm it is you before acting. Some records (for
        example, financial records) must be kept even after you ask us to delete your account. You
        can also complain to your local data protection authority, such as the Nigeria Data
        Protection Commission.
      </p>

      <h2>10. Age</h2>
      <p>
        Clippifi is only for people aged 18 or over. We do not knowingly collect information from
        anyone younger. If you think someone under 18 has an account, contact {SUPPORT_EMAIL} and we
        will remove it.
      </p>

      <h2>11. Changes</h2>
      <p>
        We will update this policy when the Platform changes, for example when we add a new
        platform or partner. We will change the date at the top and tell you about important
        changes in the app or by email.
      </p>

      <h2>12. Contact</h2>
      <p>Questions or requests about your privacy: {SUPPORT_EMAIL}.</p>
    </LegalLayout>
  );
}
