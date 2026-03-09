export default function SupportPage() {
  const appName = "Simply Food Facts";
  const contactEmail = "SimplyFoodFacts@gmail.com";

  const faqs = [
    {
      q: "How do I scan a product?",
      a: "Open the app and point your camera at any barcode on a food product. The app will automatically detect the barcode and look up the product's ingredients and nutritional information.",
    },
    {
      q: "Why wasn't my product found?",
      a: "Product information comes from the Open Food Facts database. If a product isn't found, it may not be in the database yet. Try scanning the barcode again to make sure it was read correctly.",
    },
    {
      q: "How do ingredient alerts work?",
      a: 'You can add ingredients you want to watch for (like "Red 40" or "Aspartame") in the Alerts tab. You can also tap any ingredient from a product\'s ingredients list to quickly add it as an alert. When you scan a product that contains any of those ingredients, the app will flag them for you.',
    },
    {
      q: "How do I delete my scan history?",
      a: 'Go to Settings and tap "Clear Scan History." This will permanently remove all your saved scans.',
    },
    {
      q: "Is the app free to use?",
      a: "Yes! All features are completely free. There's an optional Tip Jar if you'd like to support development, but it's entirely voluntary and doesn't unlock any extra features.",
    },
    {
      q: "Does the app collect my personal data?",
      a: "No. The app does not collect names, emails, location, or any personal identifiers. You can read our full Privacy Policy for more details.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Support</h1>
        <p className="text-gray-500 mb-8">{appName}</p>

        <p className="text-gray-700 leading-7 mb-10">
          Need help with {appName}? Check the common questions below, or reach
          out to us directly — we're happy to help.
        </p>

        {/* Contact */}
        <div className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Contact Us
          </h2>
          <p className="text-gray-700 leading-7">
            For questions, feedback, or bug reports, email us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-blue-600 underline hover:text-blue-800"
            >
              {contactEmail}
            </a>
            . We typically respond within 48 hours.
          </p>
        </div>

        {/* FAQs */}
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6 mb-12">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-100 pb-6">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                {faq.q}
              </h3>
              <p className="text-gray-700 leading-7">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Helpful links */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Helpful Links
          </h2>
          <ul className="space-y-3">
            <li>
              <a
                href="/privacy"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Terms of Use
              </a>
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            {appName} · Support
          </p>
        </div>
      </div>
    </div>
  );
}
