import InfoPage from "@/components/info-page";

export const metadata = { title: "Contact Us — WedPlan" };

export default function ContactPage() {
  return (
    <InfoPage overline="Get in Touch" title="Contact Us">
      <p>Questions about a listing, a booking or your account? We&apos;re here to help.</p>
      <ul className="space-y-2">
        <li><strong className="text-espresso">Email:</strong> hello@wedplan.com</li>
        <li><strong className="text-espresso">Phone:</strong> +880 1700-000000</li>
        <li><strong className="text-espresso">Address:</strong> House 12, Road 8, Gulshan-1, Dhaka 1212, Bangladesh</li>
        <li><strong className="text-espresso">Hours:</strong> Saturday – Thursday, 9:00 AM – 6:00 PM</li>
      </ul>
      <p>
        Vendor support and account issues are handled by the WedPlan team —
        include your account email so we can help faster.
      </p>
    </InfoPage>
  );
}
