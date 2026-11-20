import InfoPage from "@/components/info-page";

const faqs = [
  {
    q: "Do I need an account to browse services?",
    a: "No — browsing and filtering services is public. Signing in is required to view service details and send booking requests.",
  },
  {
    q: "How do I know a vendor is trustworthy?",
    a: "Every service is reviewed by our admin team before it goes live. Only approved, active listings appear on Browse Services.",
  },
  {
    q: "Can I cancel a booking request?",
    a: "Yes, while it is still pending. Once a vendor accepts or rejects a request it can no longer be changed.",
  },
  {
    q: "How many services can a vendor publish for free?",
    a: "Free vendors can have up to 3 active services. Premium vendors can publish unlimited services.",
  },
  {
    q: "When does Premium become active?",
    a: "Only after Stripe verifies the payment through our webhook. A browser redirect alone never upgrades an account.",
  },
];

export const metadata = { title: "FAQ — WedPlan" };

export default function FaqPage() {
  return (
    <InfoPage overline="Help Center" title="Frequently Asked Questions">
      {faqs.map(({ q, a }) => (
        <section key={q}>
          <h2 className="font-heading text-lg font-semibold text-espresso">{q}</h2>
          <p className="mt-1">{a}</p>
        </section>
      ))}
    </InfoPage>
  );
}
