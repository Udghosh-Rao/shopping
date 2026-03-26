export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#F8F5F0] py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-lg">
        <h1 className="text-4xl font-black mb-2 text-[#0A0A0A]">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using DripStore ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on DripStore for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software on DripStore</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              <li>Violating any laws, rules, or regulations in India or internationally</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">3. User Accounts</h2>
            <p>
              When you create an account with DripStore, you are responsible for maintaining the confidentiality of your password and account. You are fully responsible for all activities that occur under your password or account.
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>You agree to notify DripStore immediately of any unauthorized use of your account</li>
              <li>You agree that you are 18 years or older (or of the legal age in your jurisdiction)</li>
              <li>You agree to provide accurate and complete information during registration</li>
              <li>You agree not to use the service if you are prohibited by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">4. Product Information & Pricing</h2>
            <p>
              DripStore strives to provide accurate product descriptions and pricing. However:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Product information is provided &quot;as is&quot; without warranty of any kind</li>
              <li>We reserve the right to refuse or cancel any order</li>
              <li>Prices are subject to change without notice</li>
              <li>Product images may differ slightly from actual products due to display settings</li>
              <li>All products are subject to availability</li>
              <li>We reserve the right to limit quantities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">5. Orders & Payments</h2>
            <p>
              By placing an order on DripStore:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>You represent that you are of legal age and authorized to make purchases</li>
              <li>You authorize DripStore to charge your provided payment method</li>
              <li>All prices include applicable taxes and delivery charges where indicated</li>
              <li>Orders are subject to acceptance and verification</li>
              <li>You agree to provide accurate shipping and billing information</li>
              <li>Payment failures may result in order cancellation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">6. Shipping & Delivery</h2>
            <p>
              DripStore uses third-party logistics for delivery. Terms:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Estimated delivery times are provided for reference only and not guaranteed</li>
              <li>Delays may occur due to weather, logistics issues, or circumstances beyond our control</li>
              <li>Delivery is to the address provided during checkout</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
              <li>Insurance for shipping is not included unless explicitly purchased</li>
              <li>DripStore is not liable for delays or delivery failures by third-party couriers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">7. Returns & Refunds</h2>
            <p>
              DripStore offers returns within 15 days of delivery for unused items in original condition:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Refund requests must be initiated within 15 days of delivery</li>
              <li>Items must be unused, unwashed, and in original packaging</li>
              <li>Return shipping costs may be borne by the customer</li>
              <li>Refunds are processed within 7-10 business days after return inspection</li>
              <li>Sale/discounted items may not be eligible for return</li>
              <li>Damaged items due to misuse or negligence are not eligible for refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">8. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>DripStore is not liable for any indirect, incidental, special, or consequential damages</li>
              <li>DripStore is not liable for loss of profits, data, or business interruption</li>
              <li>Our total liability is limited to the amount you paid for the product</li>
              <li>These limitations apply even if we have been advised of the possibility of such damages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">9. Warranties Disclaimer</h2>
            <p>
              PRODUCTS AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>We make no representations or warranties of any kind</li>
              <li>We do not warrant that products will meet your expectations</li>
              <li>We do not warrant that the service will be uninterrupted or error-free</li>
              <li>We do not warrant the accuracy, reliability, or completeness of content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">10. Intellectual Property Rights</h2>
            <p>
              All content on DripStore (text, graphics, logos, images, videos) is the property of DripStore or its content suppliers and is protected by international copyright laws. You may not:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Reproduce, duplicate, or copy content for commercial purposes</li>
              <li>Modify or adapt content without permission</li>
              <li>Distribute, transmit, display, or perform content publicly</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">11. Prohibited Activities</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Harass, abuse, or threaten other users or staff</li>
              <li>Post spam, false, or misleading content</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Interfere with the functioning of DripStore</li>
              <li>Use bots, scrapers, or automated tools to collect data</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">12. Termination</h2>
            <p>
              DripStore reserves the right to terminate or suspend your account and access to the service immediately, without prior notice, if you violate these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">13. Governing Law</h2>
            <p>
              These terms of service are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-4">14. Contact Us</h2>
            <p>
              For questions about these terms of service, contact us:
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
