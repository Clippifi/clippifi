import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout from "@/components/legal/LegalLayout";
import { LEGAL_UPDATED, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Brand Terms of Service — Clippifi",
  description: "The terms for brands and agencies that fund and run campaigns on Clippifi.",
};

// Written from the founders' policy (private FOUNDATION.md). Numbers must match the app and the
// Creator Terms; change them together.
export default function BrandTermsPage() {
  return (
    <LegalLayout title="Brand Terms of Service" updated={LEGAL_UPDATED} current="brand">
      <p>
        These Brand Terms are an agreement between you, the business, person or agency running campaigns (“you”), and
        Clippifi (“Clippifi”, “we”, “us”). Clippifi is run by its founders from Nigeria and is not yet incorporated as a
        registered company. Creators follow the <Link href="/terms">Creator Terms</Link>. Our{" "}
        <Link href="/privacy">Privacy Policy</Link> and <Link href="/refund-policy">Refunds &amp; Payouts</Link> page are
        part of these terms.
      </p>
      <p>
        By creating, funding or running a campaign, you agree to these terms. If you act for a company or a client, you
        confirm you’re allowed to agree for them.
      </p>

      <h2>1. Words we use</h2>
      <p>
        Words such as campaign, clip, submission, minimum views, round, hold and payment partner mean the same as in
        the <Link href="/terms">Creator Terms</Link>. <strong>Campaign budget</strong> is the amount you prepay for a
        campaign. <strong>Prepaid balance</strong> is budget left over from earlier campaigns, kept for your next one.
      </p>

      <h2>2. Who can run campaigns</h2>
      <p>
        <strong>2.1 Age and authority.</strong> You must be 18 or older and able to make a binding agreement.
      </p>
      <p>
        <strong>2.2 Business check.</strong> Before you fund your first campaign, you complete a business verification
        (KYB) with our payment partner.
      </p>
      <p>
        <strong>2.3 Where.</strong> In this first version, campaigns are funded by brands paying in Nigeria and priced
        in US dollars.
      </p>

      <h2>3. What you’re paying for</h2>
      <p>
        <strong>3.1 A service, prepaid.</strong> You pay Clippifi in advance to deliver your campaign: we publish it to
        creators, verify their clips and views, and pay them for verified work. Your payment goes to Clippifi’s merchant
        account through our payment partner.
      </p>
      <p>
        <strong>3.2 Your budget is a record, not a deposit.</strong> We record your campaign budget and any prepaid
        balance in our ledger and use them for creator earnings and our fee as work is delivered. They are not held in
        trust or in a separate account for you, and they don’t earn interest. Clippifi is not a bank, an escrow service
        or a payment processor.
      </p>
      <p>
        <strong>3.3 Minimum budget.</strong> A campaign needs a budget of at least $200, paid before it goes live.
      </p>

      <h2>4. Fees</h2>
      <p>
        <strong>4.1 Our fee</strong> is 10% on top of what creators earn, charged only on delivered work as clips earn.
        For example, if your rate is $1.00 per 1,000 views, delivered views cost you $1.10 per 1,000.
      </p>
      <p>
        <strong>4.2 Creators pay their own fee.</strong> We also keep 10% of what each creator earns. It comes out of
        their side, not your budget.
      </p>
      <p>
        <strong>4.3 Payment fees.</strong> Our payment partner’s checkout fee is shown before you pay and is paid by
        you.
      </p>

      <h2>5. Setting up a campaign</h2>
      <p>
        <strong>5.1 Your terms per platform:</strong> a rate per 1,000 views, minimum views and a maximum per clip. You
        may also cap what one creator can earn. In this first version, only TikTok clips can earn.
      </p>
      <p>
        <strong>5.2 Put every requirement in the brief.</strong> Content rules, disclosures and approval criteria must
        be written in the campaign on Clippifi. Requirements sent elsewhere (chats, email, documents) can’t be used to
        reject a clip.
      </p>
      <p>
        <strong>5.3 Your claims are your responsibility.</strong> Your brief, assets and advertising claims must be
        accurate and lawful, including any rules for regulated products, and you must have the rights to anything you
        ask creators to use.
      </p>
      <p>
        <strong>5.4 Industries we don’t serve:</strong> illegal drugs, weapons, adult sexual services, gambling where
        it is restricted, pyramid schemes, fraudulent financial products, hate speech and political disinformation. We
        may refuse or remove any campaign.
      </p>

      <h2>6. Reviewing clips</h2>
      <p>
        <strong>6.1 48 hours.</strong> You have 48 hours from each submission to approve or reject it. A rejection needs
        a reason.
      </p>
      <p>
        <strong>6.2 Automatic approval.</strong> If you don’t respond in time, the clip is approved automatically when it
        meets your stated requirements and passes our checks.
      </p>
      <p>
        <strong>6.3 Earning starts before you review.</strong> Once a clip passes your minimum views, it starts earning
        from your budget, held until you decide. Rejecting a clip drops those earnings back into your budget.
      </p>
      <p>
        <strong>6.4 Clippifi has the final say.</strong> We may review any clip, and we can overturn a decision that
        misuses the review, for example rejecting clips that meet the brief.
      </p>
      <p>
        <strong>6.5 After approval</strong> you can’t ask for changes, and you can’t reject an approved clip because you
        changed your mind. You can reject it only for fraud, a policy breach, a deleted or private post, or a dispute we
        uphold. You can still reject future submissions or pause the campaign.
      </p>

      <h2>7. Budget, pausing and ending</h2>
      <p>
        <strong>7.1</strong> Clips earn from your budget as verified views come in, at your rates and within your caps.
        When the budget runs out, clips stop earning new money.
      </p>
      <p>
        <strong>7.2</strong> You can pause or end a campaign at any time. Earnings already committed to creators (in a
        round or in their balance) are still paid. A clip submitted before the end and approved afterwards is paid for
        what it earned up to approval, if budget remains.
      </p>

      <h2>8. Using creators’ clips</h2>
      <p>
        <strong>8.1 Your licence.</strong> When you approve a clip, you may use it for the campaign’s stated purpose: as
        organic content on your own channels for 12 months. The creator keeps ownership.
      </p>
      <p>
        <strong>8.2 Paid ads</strong> need the creator’s explicit permission, either in your brief before they join, or
        in a separate agreement.
      </p>
      <p>
        <strong>8.3</strong> You can’t edit a clip without the creator’s permission. Using a clip beyond these limits is
        a breach of these terms, handled through our disputes process.
      </p>
      <p>
        <strong>8.4 Your materials.</strong> You allow creators in your campaign to use the footage, sounds, logos and
        other assets you provide, only to make and post clips for that campaign.
      </p>

      <h2>9. Views and fraud</h2>
      <p>
        We pay creators from the view counts we retrieve from their linked accounts for submitted posts, and we use
        automated checks and people to catch fake views. If we reverse a creator’s unsettled earnings for fraud or a
        policy breach, that money goes back to your budget. Only Clippifi can reverse earnings; there is no
        brand-side reversal in this first version.
      </p>

      <h2>10. Refunds</h2>
      <p>
        <strong>10.1 What’s refundable:</strong> the budget left after a campaign ends or is cancelled, once we have
        reviewed pending submissions and settled what creators earned. Pending clips can delay a refund because they may
        still be approved.
      </p>
      <p>
        <strong>10.2 What isn’t:</strong> money creators earned for approved work, and our fee on it.
      </p>
      <p>
        <strong>10.3 Where it goes.</strong> Unspent budget goes to your prepaid balance for your next campaign. You can
        ask for it back instead; we aim to process the request within 5 business days after our review. If our payment
        partner doesn’t return its original processing fee, that fee isn’t refunded.
      </p>
      <p>
        Full details are on the <Link href="/refund-policy">Refunds &amp; Payouts</Link> page.
      </p>

      <h2>11. Chargebacks</h2>
      <p>
        If you dispute or reverse a payment with your bank or card issuer, we may pause your campaigns and suspend your
        account while we investigate. Please contact us first at {SUPPORT_EMAIL}; most problems are faster to fix
        directly.
      </p>

      <h2>12. Confidentiality and leaderboards</h2>
      <p>
        We don’t share your budgets or results with other brands. Public campaign pages show your campaign, its rates,
        budget progress and top clips, with creators’ earnings shown only as bands.
      </p>

      <h2>13. Taxes</h2>
      <p>You are responsible for the taxes on what you buy through Clippifi. We don’t give tax advice.</p>

      <h2>14. Suspending or closing accounts</h2>
      <p>
        We may refuse, pause or remove a campaign, or suspend or close an account, that breaks these terms, for
        suspected fraud, or where the law requires it.
      </p>

      <h2>15. No guarantees</h2>
      <p>
        Clippifi is provided “as is”. We don’t promise any number of creators, clips or views, or that social platforms
        will keep giving us the data we rely on.
      </p>

      <h2>16. Limits on our liability</h2>
      <p>
        As far as the law allows, we aren’t liable for indirect or consequential losses, such as lost profits or lost
        data. Our total liability for any claim is limited to the fees you paid us in the three months before the claim.
        Nothing here limits rights the law doesn’t allow us to limit.
      </p>

      <h2>17. General</h2>
      <p>
        <strong>17.1 Changes.</strong> We may update these terms. We change the date at the top and tell you about
        important changes in the app or by email.
      </p>
      <p>
        <strong>17.2 Order.</strong> These Brand Terms, the Privacy Policy and the Refunds &amp; Payouts page are the
        whole agreement between us. If they conflict, these terms apply, except on privacy.
      </p>
      <p>
        <strong>17.3</strong> If a court finds one part unenforceable, the rest stands. Not enforcing a term doesn’t mean
        we give it up.
      </p>
      <p>
        <strong>17.4 Notices.</strong> We contact you in the app or at your account email. You can reach us at{" "}
        {SUPPORT_EMAIL}.
      </p>

      <h2>18. Governing law</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria, and disputes go to the courts of
        Nigeria.
      </p>
    </LegalLayout>
  );
}
