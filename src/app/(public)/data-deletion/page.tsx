import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Deletion — Runnerx",
  description: "Request deletion of your Runnerx account and personal data.",
};

export default function DataDeletionPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-lg py-3xl">
      <h1 className="font-sans text-4xl font-black text-on-surface mb-lg">Data Deletion</h1>
      <p className="font-mono text-xs text-on-surface-variant mb-xl">Account & Data Deletion Request</p>

      <div className="space-y-xl font-mono text-sm text-on-surface-variant leading-relaxed">
        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">Delete Your Account</h2>
          <p>You have the right to request deletion of your Runnerx account and all associated personal data. Once deleted, this action cannot be undone.</p>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">How to Delete Your Account</h2>
          <h3 className="font-sans text-base font-semibold text-on-surface">Option 1: In-App Deletion</h3>
          <ol className="list-decimal list-inside space-y-xs pl-md">
            <li>Open the Runnerx app</li>
            <li>Go to Settings</li>
            <li>Tap &quot;Account&quot;</li>
            <li>Tap &quot;Delete Account&quot;</li>
            <li>Confirm your decision</li>
          </ol>

          <h3 className="font-sans text-base font-semibold text-on-surface mt-md">Option 2: Email Request</h3>
          <p>Send an email to <strong className="text-primary">privacy@runnerx.app</strong> with:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Subject: &quot;Account Deletion Request&quot;</li>
            <li>Your registered phone number</li>
            <li>Your full name on the account</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">What Gets Deleted</h2>
          <p>Upon account deletion, we will permanently remove:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Your profile information (name, photo, bio)</li>
            <li>Your phone number and email address</li>
            <li>Student ID verification photo</li>
            <li>Chat messages</li>
            <li>Location history</li>
            <li>Push notification tokens</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">What We May Retain</h2>
          <p>For legal and business purposes, we may retain the following in anonymized form for up to 90 days:</p>
          <ul className="list-disc list-inside space-y-xs pl-md">
            <li>Transaction records (required for financial compliance)</li>
            <li>Dispute records (if any are open or recently resolved)</li>
            <li>Anonymized usage statistics</li>
          </ul>
        </section>

        <section className="space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">Processing Time</h2>
          <p>Account deletion requests are processed within <strong className="text-on-surface">7 business days</strong>. You will receive a confirmation email once your data has been deleted.</p>
        </section>

        <section className="bg-surface border border-outline-variant rounded-xl p-lg space-y-sm">
          <h2 className="font-sans text-xl font-bold text-on-surface">Need Help?</h2>
          <p>If you have questions about data deletion or want to know what data we hold about you, contact our privacy team:</p>
          <p className="text-primary">privacy@runnerx.app</p>
        </section>
      </div>
    </div>
  );
}
