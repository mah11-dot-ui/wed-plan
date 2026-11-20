import InfoPage from "@/components/info-page";

export const metadata = { title: "Privacy Policy — WedPlan" };

export default function PrivacyPage() {
  return (
    <InfoPage overline="Legal" title="Privacy Policy">
      <p>
        We collect only the information needed to operate WedPlan: account
        details (name, email, optional photo, role), service listings submitted
        by vendors, and booking requests sent by customers.
      </p>
      <p>
        Profile images are stored with ImgBB. Payments are processed by Stripe —
        WedPlan never stores card numbers. Authentication secrets and API keys
        are kept in environment variables on the server.
      </p>
      <p>
        Account roles, subscription status and blocking are controlled
        server-side. Users cannot change their own role or payment status by
        editing profile fields.
      </p>
      <p>For account or data requests, contact hello@wedplan.com.</p>
    </InfoPage>
  );
}
