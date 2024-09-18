import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Wordpress Copilot",
  description:
    "Privacy Policy for Wordpress Copilot - AI-Powered WordPress Development",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to Wordpress Copilot (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website or use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          2. Information We Collect
        </h2>
        <p>
          We collect personal information that you provide to us, such as name,
          email address, and payment information when you register for an
          account or use our services. We also automatically collect certain
          information about your device and how you interact with our website.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          3. How We Use Your Information
        </h2>
        <p>
          We use the information we collect to provide, maintain, and improve
          our services, to process your transactions, to send you technical
          notices and support messages, and to communicate with you about
          products, services, offers, and events.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          4. Sharing Your Information
        </h2>
        <p>
          We may share your information with third-party service providers to
          help us operate our business and deliver services to you. We may also
          share information to comply with legal obligations or to protect our
          rights and safety.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized or unlawful
          processing, accidental loss, destruction, or damage.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal information, such as the right to access, correct, or delete
          your data. Please contact us to exercise these rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          7. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@Wordpress Copilot.
        </p>
      </section>
    </div>
  );
}
