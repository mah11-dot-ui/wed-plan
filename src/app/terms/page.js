import InfoPage from "@/components/info-page";

export const metadata = { title: "Terms of Service — WedPlan" };

export default function TermsPage() {
  return (
    <InfoPage overline="Legal" title="Terms of Service">
      <p>
        By using WedPlan you agree to use the platform lawfully and to provide
        accurate information in your listings and booking requests.
      </p>
      <p>
        Vendors must list genuine services. Listings are published only after
        admin approval and may be rejected or removed if they are inaccurate or
        inappropriate.
      </p>
      <p>
        Customers may cancel booking requests while they are pending. Once a
        request is accepted or rejected it is final within the platform.
      </p>
      <p>
        Premium subscriptions are activated only after verified Stripe payments.
        Admin accounts are never created through public registration.
      </p>
    </InfoPage>
  );
}
