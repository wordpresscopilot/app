import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WP Copilot",
  description:
    "Privacy Policy for WP Copilot - AI-Powered WordPress Development",
};

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
        <p>
          Welcome to wpc.dev (&quot;we,&quot; &quot;our,&quot; or
          &quot;us&quot;). We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you
          visit our website or use our services. We take your privacy seriously
          and are dedicated to maintaining the confidentiality and security of
          your personal data.
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
          Rest assured that we do not sell your personal data to third parties
          or use it for any purpose other than providing and improving our
          services.
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
          products, services, offers, and events. We are committed to using your
          data responsibly and only for purposes that are clearly communicated
          to you.
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
          rights and safety. We carefully vet all third-party providers and
          ensure they adhere to strict privacy and security standards. Your data
          is never sold or rented to third parties for marketing purposes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your personal information against unauthorized or unlawful
          processing, accidental loss, destruction, or damage. This includes
          encryption of data in transit and at rest, regular security audits,
          and strict access controls to your personal information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">6. Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding your
          personal information, such as the right to access, correct, or delete
          your data. We are committed to honoring these rights and have
          processes in place to respond to your requests promptly. Please
          contact us to exercise these rights or if you have any questions about
          how we handle your data.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-3">
          7. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the &quot;Last updated&quot; date. We encourage you to review
          this Privacy Policy periodically to stay informed about how we protect
          your personal information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data
          practices, please contact us at privacy@wpc.dev. We are committed to
          addressing your concerns and ensuring our privacy practices meet the
          highest standards of transparency and protection.
        </p>
      </section>
    </div>
  );
}
