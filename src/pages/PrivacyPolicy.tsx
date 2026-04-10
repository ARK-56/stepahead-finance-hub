export default function PrivacyPolicy() {
  return (
    <div className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground font-display tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-2">Last updated: April 10, 2026</p>
          <hr className="border-border my-8" />

          <div className="prose prose-lg text-muted-foreground space-y-8 leading-relaxed [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3">
            <p>
              1StepAhead ("we," "us," or "our") operates the website located at stepahead-finance-hub.lovable.app (the "Site"). This Privacy Policy explains how we collect, use, and protect information when you visit or use our Site.
            </p>

            <h2>1. Information We Collect</h2>
            <h3>Data You Enter Into Calculators</h3>
            <p>
              All financial data you enter into our calculators (income figures, loan amounts, interest rates, etc.) is processed entirely within your web browser using client-side JavaScript. <strong>We do not transmit, collect, store, or have access to any numbers you enter.</strong> Your financial data never leaves your device.
            </p>

            <h3>Automatically Collected Information</h3>
            <p>
              When you visit our Site, certain information may be collected automatically through cookies and similar technologies used by our advertising and analytics partners:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and approximate geographic location</li>
              <li>Browser type, operating system, and device information</li>
              <li>Pages visited, time spent on pages, and referring URLs</li>
              <li>Interaction data such as clicks and scroll depth</li>
            </ul>

            <h2>2. How We Use Information</h2>
            <p>
              We use automatically collected data to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Understand which tools are most useful to visitors and improve the Site</li>
              <li>Display relevant advertising through Google AdSense to support the free operation of the Site</li>
              <li>Monitor Site performance and diagnose technical issues</li>
            </ul>

            <h2>3. Third-Party Advertising</h2>
            <p>
              We use Google AdSense to display advertisements on our Site. Google and its advertising partners may use cookies, web beacons, and similar technologies to serve ads based on your prior visits to this Site or other websites. This enables Google and its partners to serve you ads based on your interests.
            </p>
            <p>
              You can opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Google Ads Settings
              </a>. Alternatively, you can opt out of third-party vendor cookies by visiting{" "}
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                aboutads.info
              </a>.
            </p>
            <p>
              For more information about how Google uses data when you use our Site, please visit{" "}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                How Google uses data when you use our partners' sites or apps
              </a>.
            </p>

            <h2>4. Cookies</h2>
            <p>
              Cookies are small text files stored on your device by your web browser. Our Site uses:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential cookies:</strong> Required for basic Site functionality such as remembering your preferences.</li>
              <li><strong>Advertising cookies:</strong> Used by Google AdSense and its partners to display relevant ads and measure ad performance.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with the Site so we can improve content and user experience.</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Blocking all cookies may affect Site functionality.
            </p>

            <h2>5. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share automatically collected data with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google AdSense:</strong> For ad serving and performance measurement</li>
              <li><strong>Analytics providers:</strong> To understand Site usage patterns</li>
              <li><strong>Legal requirements:</strong> If required by law, regulation, or legal process</li>
            </ul>

            <h2>6. Children's Privacy</h2>
            <p>
              Our Site is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will take steps to delete it.
            </p>

            <h2>7. Data Security</h2>
            <p>
              Since we do not collect or store your financial calculator data, there is no financial data to secure on our end. For automatically collected browsing data, we rely on industry-standard security practices employed by our third-party partners (Google AdSense, analytics providers).
            </p>

            <h2>8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request access to the personal data we hold about you</li>
              <li>Request correction or deletion of your personal data</li>
              <li>Object to or restrict processing of your personal data</li>
              <li>Opt out of personalized advertising</li>
            </ul>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised "Last updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please reach out through the contact information provided on our Site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
