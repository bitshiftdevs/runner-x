import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Runner_X",
  description: "Privacy Policy for Runner_X mobile application and web services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-lg py-3xl">
      <h1 className="font-sans text-4xl font-black text-on-surface mb-lg">Privacy Policy</h1>
      <p className="font-mono text-xs text-on-surface-variant mb-xl">Last updated: June 14, 2025</p>

      <div className="space-y-xl font-mono text-sm text-on-surface-variant leading-relaxed">
        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">1. Introduction</h2>
          <p>Runner_X (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the Runner_X mobile application and website (collectively, the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">2. Information We Collect</h2>
          <h3 className="font-sans text-base font-semibold text-on-surface">2.1 Personal Information</h3>
          <p>When you create an account, we collect:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>Student ID photo (for verification)</li>
            <li>Profile photo (optional)</li>
            <li>Campus/university affiliation</li>
          </ul>

          <h3 className="font-sans text-base font-semibold text-on-surface mt-md">2.2 Usage Data</h3>
          <p>We automatically collect:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Device information (model, OS version)</li>
            <li>App usage patterns and interactions</li>
            <li>IP address</li>
            <li>Crash reports and performance data</li>
          </ul>

          <h3 className="font-sans text-base font-semibold text-on-surface mt-md">2.3 Location Data</h3>
          <p>With your permission, we collect real-time location data to enable live tracking during active job deliveries, calculate distances for pricing, and match runners with nearby quests.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>To provide and maintain the Service</li>
            <li>To verify student identity and eligibility</li>
            <li>To facilitate job matching between requesters and runners</li>
            <li>To process payments via Mobile Money</li>
            <li>To enable real-time delivery tracking</li>
            <li>To communicate updates, notifications, and support messages</li>
            <li>To improve the Service and develop new features</li>
            <li>To ensure safety and prevent fraud</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">4. Information Sharing</h2>
          <p>We share your information only in the following circumstances:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li><strong className="text-on-surface">Between Users:</strong> Requesters and runners can see each other&apos;s name, rating, and live location during active jobs.</li>
            <li><strong className="text-on-surface">Payment Providers:</strong> Transaction data is shared with our payment partner (Moolre) to process Mobile Money payments.</li>
            <li><strong className="text-on-surface">Legal Requirements:</strong> When required by law, court order, or to protect safety.</li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">5. Data Storage & Security</h2>
          <p>Your data is stored securely on cloud servers with encryption at rest and in transit. We implement industry-standard security measures including access controls, secure authentication, and regular security audits.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">6. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., dispute resolution).</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for location tracking at any time</li>
            <li>Export your data in a portable format</li>
          </ul>
          <p>To exercise these rights, contact us at <strong className="text-primary">privacy@runnerx.app</strong> or use the in-app data deletion feature.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">8. Children&apos;s Privacy</h2>
          <p>Our Service is intended for university students aged 16 and above. We do not knowingly collect information from children under 16. If we discover that we have collected personal data from a child under 16, we will delete it promptly.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes through the app or via email. Continued use of the Service after changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">10. Contact Us</h2>
          <p>If you have questions about this Privacy Policy, contact us at:</p>
          <p className="text-primary">privacy@runnerx.app</p>
          <p>Runner_X, Kumasi, Ghana</p>
        </section>
      </div>
    </div>
  );
}
