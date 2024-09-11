import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | w-p.ai",
  description: "Terms of Service for w-p.ai - AI-Powered WordPress Development",
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
        <p>
          By accessing or using w-p.ai (&quot;the Service&quot;), you agree to
          be bound by these Terms of Service. If you disagree with any part of
          the terms, you may not access the Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. Description of Service
        </h2>
        <p>
          w-p.ai provides AI-powered WordPress development tools and services.
          We reserve the right to modify or discontinue, temporarily or
          permanently, the Service with or without notice.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
        <p>
          You are responsible for safeguarding the password you use to access
          the Service and for any activities or actions under your password. You
          agree not to disclose your password to any third party.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          4. Intellectual Property
        </h2>
        <p>
          The Service and its original content, features, and functionality are
          owned by w-p.ai and are protected by international copyright,
          trademark, patent, trade secret, and other intellectual property or
          proprietary rights laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. User Content</h2>
        <p>
          You retain any and all of your rights to any content you submit, post
          or display on or through the Service and you are responsible for
          protecting those rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          6. Limitation of Liability
        </h2>
        <p>
          In no event shall w-p.ai, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the Service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the
          laws of [Your Country/State], without regard to its conflict of law
          provisions.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">8. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. By continuing to access or use our Service
          after those revisions become effective, you agree to be bound by the
          revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at
          support@w-p.ai.
        </p>
      </section>
    </div>
  );
}
