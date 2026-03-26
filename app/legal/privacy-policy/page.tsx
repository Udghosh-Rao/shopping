export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-lg">
        <h1 className="text-4xl font-black mb-2 text-[#0A0A0A]">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">1. Information We Collect</h2>
            <p>
              DripStore collects personal information to provide and improve our services:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong>Account Information:</strong> Name, email, phone number, password</li>
              <li><strong>Address Information:</strong> Shipping and billing addresses</li>
              <li><strong>Payment Information:</strong> Payment method details (processed by Razorpay, never stored by us)</li>
              <li><strong>Order History:</strong> Products purchased, quantities, prices, delivery status</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, search queries, clicks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Process orders and send order confirmations</li>
              <li>Deliver products to your address</li>
              <li>Send order status updates and tracking information</li>
              <li>Respond to customer support inquiries</li>
              <li>Send promotional emails (with your opt-in consent)</li>
              <li>Prevent fraud and maintain security</li>
              <li>Improve website functionality and user experience</li>
              <li>Generate GST invoices for tax compliance</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>HTTPS encryption for all data transmission</li>
              <li>Password hashing with bcryptjs (never stored in plain text)</li>
              <li>Secure payment processing via Razorpay (PCI DSS compliant)</li>
              <li>Restricted access to customer data (admin only)</li>
              <li>Regular security audits and updates</li>
            </ul>
            <p className="mt-4">
              <strong>Note:</strong> While we implement strong security, no online system is 100% secure. You use our service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">4. Third-Party Services</h2>
            <p>We use the following third-party services that may collect data:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong>Razorpay:</strong> Payment processing (see <a href="https://razorpay.com/privacy" className="text-[#E63946] underline">Razorpay Privacy Policy</a>)</li>
              <li><strong>Cloudinary:</strong> Image hosting and CDN (see <a href="https://cloudinary.com/privacy" className="text-[#E63946] underline">Cloudinary Privacy Policy</a>)</li>
              <li><strong>Google OAuth:</strong> Authentication (see <a href="https://policies.google.com/privacy" className="text-[#E63946] underline">Google Privacy Policy</a>)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">5. Data Retention</h2>
            <p>
              We retain your personal information as long as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong>Account data:</strong> Until you request deletion or account is inactive for 2 years</li>
              <li><strong>Order data:</strong> 7 years (for tax compliance and GST invoicing)</li>
              <li><strong>Payment records:</strong> 7 years (legal requirement)</li>
              <li><strong>Device/usage data:</strong> 90 days (for security and analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Access your personal data stored by us</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and personal data (subject to legal retention requirements)</li>
              <li>Opt-out of promotional emails anytime</li>
              <li>Request a copy of your data in portable format</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact us at support@dripstore.in
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">7. Cookies</h2>
            <p>
              We use cookies to enhance your experience. Cookies are small files stored on your device. You can disable cookies in your browser, but this may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our service is not intended for children under 13 years old. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">9. Policy Changes</h2>
            <p>
              We may update this privacy policy periodically. Changes will be posted on this page with an updated &quot;Last updated&quot; date. Your continued use of the service constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">10. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights, contact us:
            </p>
            <div className="mt-4 bg-[#F8F5F0] p-4 rounded-lg">
              <p><strong>Email:</strong> support@dripstore.in</p>
              <p><strong>Address:</strong> DripStore, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
