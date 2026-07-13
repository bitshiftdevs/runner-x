import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Runner_X",
  description: "Terms and Conditions for using the Runner_X mobile application and services.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-lg py-3xl">
      <h1 className="font-sans text-4xl font-black text-on-surface mb-lg">Terms & Conditions</h1>
      <p className="font-mono text-xs text-on-surface-variant mb-xl">Last updated: June 14, 2025</p>

      <div className="space-y-xl font-mono text-sm text-on-surface-variant leading-relaxed">
        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">1. Acceptance of Terms</h2>
          <p>By accessing or using Runner_X (&quot;the Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">2. Eligibility</h2>
          <p>The Service is available exclusively to verified students of participating universities. You must:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Be at least 16 years of age</li>
            <li>Be a currently enrolled student at a supported university</li>
            <li>Provide valid student ID for verification</li>
            <li>Have a valid Ghanaian phone number</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">3. Account Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and truthful information</li>
            <li>Notifying us immediately of any unauthorized account access</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">4. Service Description</h2>
          <p>Runner_X is a dispatch marketplace that connects Requesters (users posting errands) with Runners (users fulfilling errands). The platform:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Facilitates matching between requesters and runners</li>
            <li>Calculates and collects a transparent service fee</li>
            <li>Provides real-time tracking and communication tools</li>
            <li>Does NOT handle item costs — these are settled directly between parties</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">5. Payments & Fees</h2>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Service fees are calculated based on distance, urgency, and category</li>
            <li>Requesters pay the service fee via Mobile Money before a job activates</li>
            <li>Runners receive their earnings after successful delivery confirmation</li>
            <li>The platform retains a commission from the service fee</li>
            <li>Refunds are handled on a case-by-case basis for cancelled or disputed jobs</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">6. User Conduct</h2>
          <p>You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Use the Service for any unlawful purpose</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Submit false job postings or fraudulent information</li>
            <li>Attempt to circumvent the platform&apos;s fee system</li>
            <li>Share your account with non-students</li>
            <li>Use the Service to transport prohibited or illegal items</li>
            <li>Manipulate ratings or reviews</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">7. Disputes & Resolution</h2>
          <p>In the event of a dispute between a requester and runner:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Either party may raise a dispute through the app</li>
            <li>Our admin team will review evidence (photo proofs, chat history, location data)</li>
            <li>Decisions are made within 48 hours and are final</li>
            <li>Repeated policy violations may result in account suspension</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">8. Limitation of Liability</h2>
          <p>Runner_X is a marketplace platform. We are not responsible for:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>The quality or condition of items picked up or delivered</li>
            <li>Actions of individual users outside the platform</li>
            <li>Loss or damage to items during delivery (though we encourage photo proof)</li>
            <li>Service interruptions due to technical issues or force majeure</li>
          </ul>
          <p>Our total liability is limited to the amount of service fees paid for the specific transaction in question.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">9. Account Termination</h2>
          <p>We may suspend or terminate your account if you:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Violate these Terms</li>
            <li>Receive multiple negative reviews or disputes</li>
            <li>Are found to be a non-student or using a fake identity</li>
            <li>Engage in fraudulent activity</li>
          </ul>
          <p>You may delete your account at any time through the app settings or by contacting us.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">10. Intellectual Property</h2>
          <p>The Runner_X name, logo, and all associated branding are proprietary. You may not use our branding without written permission.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">11. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Material changes will be communicated via the app. Continued use after changes constitutes acceptance.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">12. Governing Law</h2>
          <p>These Terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved in the courts of Ghana.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">13. Contact</h2>
          <p>For questions about these Terms, contact us at:</p>
          <p className="text-primary">legal@runnerx.app</p>
          <p>Runner_X, Kumasi, Ghana</p>
        </section>
      </div>
    </div>
  );
}
