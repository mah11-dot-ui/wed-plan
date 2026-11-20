import InfoPage from "@/components/info-page";

export const metadata = { title: "About Us — WedPlan" };

export default function AboutPage() {
  return (
    <InfoPage overline="Our Story" title="About WedPlan">
      <p>
        WedPlan is a wedding planning platform built to make finding the right
        vendors feel effortless. Couples can discover photographers, venues,
        decorators, caterers, stylists and fashion partners — all verified and
        reviewed in one place.
      </p>
      <p>
        Vendors use WedPlan to publish their services, manage booking requests
        and grow their business. Admins keep the marketplace trustworthy by
        reviewing new listings and monitoring platform activity.
      </p>
      <p>
        From the first shortlist to the last dance, our goal is simple: help
        every couple plan a celebration they&apos;ll remember forever.
      </p>
    </InfoPage>
  );
}
