export default function PrivacyPolicyPage() {
  const effectiveDate = "March 1, 2026";
  const appName = "Simply Food Facts";
  const contactEmail = "SimplyFoodFacts@gmail.com";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-500 mb-8">Effective Date: {effectiveDate}</p>

        <p className="text-gray-700 leading-7 mb-8">
          {appName} ("we," "us," or "our") is a barcode scanning app that helps
          you view ingredient and nutritional information for food products.
          This Privacy Policy explains what data we collect, how we use it, and
          your choices.
        </p>

        {/* Section 1 */}
        <Section number="1" title="Information We Collect">
          <Subsection title="a) Data You Provide Through Use">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
              <li>
                <strong>Barcode scans</strong> — When you scan a product
                barcode, the barcode number and product name are recorded in
                your scan history.
              </li>
              <li>
                <strong>Ingredient alerts</strong> — Custom ingredient alerts
                you create (e.g., "Aspartame," "Red 40") are stored so the app
                can flag those ingredients in future scans.
              </li>
            </ul>
          </Subsection>

          <Subsection title="b) Data Stored on Your Device">
            <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
              <li>
                <strong>App preferences</strong> — Settings such as font size
                and display options are stored locally on your device and are
                never transmitted to our servers.
              </li>
            </ul>
          </Subsection>

          <Subsection title="c) Camera Access">
            <p className="text-gray-700 leading-7">
              The app requests access to your device's camera solely to scan
              product barcodes. Camera images are processed on-device in real
              time and are never captured, stored, or transmitted.
            </p>
          </Subsection>

          <Subsection title="d) Data We Do Not Collect">
            <p className="text-gray-700 leading-7 mb-2">
              We do not collect or process any of the following:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700 leading-7">
              <li>Names, email addresses, or account credentials</li>
              <li>Location data</li>
              <li>Device identifiers or advertising IDs</li>
              <li>Health or medical data</li>
              <li>Analytics or usage tracking beyond scan history</li>
              <li>Photos or camera images</li>
            </ul>
          </Subsection>
        </Section>

        {/* Section 2 */}
        <Section number="2" title="How We Use Your Data">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
            <li>
              <strong>Scan history</strong> — To show you previously scanned
              products for easy reference.
            </li>
            <li>
              <strong>Ingredient alerts</strong> — To flag matching ingredients
              when you view a product's details.
            </li>
          </ul>
          <p className="text-gray-700 leading-7 mt-4">
            We do not use your data for advertising, profiling, or any purpose
            other than providing the app's core features.
          </p>
        </Section>

        {/* Section 3 - In-App Purchases */}
        <Section number="3" title="In-App Purchases">
          <p className="text-gray-700 leading-7 mb-4">
            {appName} offers an optional Tip Jar feature that allows you to make
            voluntary, one-time in-app purchases to support the app's
            development.
          </p>

          <Subsection title="a) Payment Processing">
            <p className="text-gray-700 leading-7">
              All in-app purchases are processed by Apple through the App Store.
              We do not collect, store, or have access to your payment
              information, credit card details, or billing address. All payment
              data is handled entirely by Apple in accordance with their privacy
              policies.
            </p>
          </Subsection>

          <Subsection title="b) Purchase Records">
            <p className="text-gray-700 leading-7">
              We use RevenueCat, a third-party purchase management service, to
              process and validate in-app purchases. RevenueCat may receive an
              anonymous identifier associated with your purchase to manage
              transaction records. No personal information is shared with
              RevenueCat.
            </p>
          </Subsection>

          <Subsection title="c) What Tips Do Not Do">
            <ul className="list-disc pl-6 space-y-1 text-gray-700 leading-7">
              <li>Tips do not unlock any additional features or content</li>
              <li>
                Tips do not create an account or require personal information
              </li>
              <li>
                Tips are entirely voluntary and are not required to use the app
              </li>
            </ul>
          </Subsection>
        </Section>

        {/* Section 4 */}
        <Section number="4" title="Third-Party Services">
          <Subsection title="Open Food Facts">
            <p className="text-gray-700 leading-7">
              When you scan a barcode, the app may query the{" "}
              <a
                href="https://world.openfoodfacts.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Open Food Facts
              </a>{" "}
              API to retrieve product information (name, ingredients, allergens,
              nutritional data, and product images). Open Food Facts is a free,
              open, collaborative database. Only the barcode number is sent in
              the request. No personal data is shared with Open Food Facts.
            </p>
          </Subsection>

          <Subsection title="RevenueCat">
            <p className="text-gray-700 leading-7">
              We use RevenueCat to manage in-app purchase transactions.
              RevenueCat processes anonymous transaction data only. For more
              information, see{" "}
              <a
                href="https://www.revenuecat.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                RevenueCat's privacy policy
              </a>
              .
            </p>
          </Subsection>

          <p className="text-gray-700 leading-7 mt-4">
            We do not integrate any third-party analytics, advertising, or
            tracking services.
          </p>
        </Section>

        {/* Section 5 */}
        <Section number="5" title="Data Storage and Retention">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
            <li>
              Your data is stored on secure cloud-hosted databases within the
              United States.
            </li>
            <li>
              Scan history and ingredient alerts are stored in a secure
              database.
            </li>
            <li>
              Scan history records older than <strong>30 days</strong> are
              automatically deleted.
            </li>
            <li>
              You can manually delete all scan history or all ingredient alerts
              at any time from the app's Settings screen.
            </li>
            <li>
              App preferences (font size, display toggles) are stored only on
              your device and can be cleared by uninstalling the app.
            </li>
            <li>
              In-app purchase transaction records are managed by Apple and
              RevenueCat. We do not store purchase history on our servers.
            </li>
          </ul>
        </Section>

        {/* Section 6 */}
        <Section number="6" title="Data Sharing">
          <p className="text-gray-700 leading-7">
            We do not sell, rent, trade, or share your data with any third
            parties. The only external communications are the barcode lookup
            request sent to Open Food Facts (which contains no personal
            information) and anonymous purchase validation through RevenueCat.
          </p>
        </Section>

        {/* Section 7 */}
        <Section number="7" title="Your Rights and Choices">
          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
            <li>
              <strong>Delete scan history</strong> — Use the "Clear Scan
              History" option in Settings to permanently remove all scan
              records.
            </li>
            <li>
              <strong>Delete ingredient alerts</strong> — Use the "Clear All
              Alerts" option in Settings to permanently remove all saved alerts.
            </li>
            <li>
              <strong>Camera access</strong> — You can revoke camera permission
              at any time through your device's system settings.
            </li>
            <li>
              <strong>In-app purchases</strong> — You can manage or request
              refunds for purchases through the App Store.
            </li>
            <li>
              <strong>Uninstall</strong> — Removing the app from your device
              will delete all locally stored preferences.
            </li>
          </ul>
        </Section>

        {/* Section 8 */}
        <Section number="8" title="Children's Privacy">
          <p className="text-gray-700 leading-7">
            {appName} is not directed at children under the age of 13. We do not
            knowingly collect personal information from children. The app does
            not require account creation and does not collect any personal
            identifiers.
          </p>
        </Section>

        {/* Section 9 */}
        <Section number="9" title="Security">
          <p className="text-gray-700 leading-7">
            We use industry-standard measures to protect the data stored in our
            database. However, no method of electronic storage is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </Section>

        {/* Section 10 */}
        <Section number="10" title="Changes to This Policy">
          <p className="text-gray-700 leading-7">
            We may update this Privacy Policy from time to time. If we make
            material changes, we will update the "Effective Date" at the top of
            this page. Your continued use of the app after changes are posted
            constitutes acceptance of the updated policy.
          </p>
        </Section>

        {/* Section 11 */}
        <Section number="11" title="Contact Us">
          <p className="text-gray-700 leading-7">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {contactEmail}
            </a>
            .
          </p>
        </Section>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            {appName} · Privacy Policy · Last updated {effectiveDate}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {number}. {title}
      </h2>
      {children}
    </div>
  );
}

function Subsection({ title, children }) {
  return (
    <div className="mb-4">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}
