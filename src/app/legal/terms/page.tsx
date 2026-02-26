
// Set revalidation time for ISR
export const revalidate = 3600;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Privacy Policy | LGIT Consult',
    description: 'Review the Privacy Policy for using the LGIT Consult website and services, detailing data collection and GDPR rights.',
  };
}

// Server Component (kein "use client")
export default function PrivacyPolicyPage() {
  // Behebung: Unbenutzte Imports entfernen
  // Behebung: Alle Anführungszeichen/Apostrophe escapen

  return (
      <>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-fg/70">
                Last updated: November 15, 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <h2>Introduction</h2>
              <p>
                LGIT Consult (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We may collect information about you in a variety of ways. The information we may collect includes:
              </p>
              <h3>Personal Data</h3>
              <p>
                While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Company name</li>
                <li>Job title</li>
              </ul>

              <h3>Usage Data</h3>
              <p>
                We may also collect information on how the service is accessed and used. This may include:
              </p>
              <ul>
                <li>IP address</li>
                <li>Browser type</li>
                <li>Pages visited</li>
                <li>Time and date of your visit</li>
                <li>Time spent on pages</li>
                <li>Unique device identifiers</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>
                We may use the information we collect from you for various purposes, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, for customer service, updates, and other information relating to the website</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>

              <h2>Legal Basis for Processing Personal Data Under GDPR</h2>
              <p>
                If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the specific data and the context in which we collect it. We may process your personal data because:
              </p>
              <ul>
                <li>We need to perform a contract with you (e.g., when you contact us through our contact form)</li>
                <li>You have given us permission to do so (e.g., when you subscribe to our newsletter)</li>
                <li>The processing is in our legitimate interests and is not overridden by your rights</li>
                <li>We need to comply with legal obligations</li>
              </ul>
              <p>
                Specifically, we process your data under the following legal bases from Article 6 of the GDPR:
              </p>
              <ul>
                <li>Art. 6(1)(a) GDPR - Your consent</li>
                <li>Art. 6(1)(b) GDPR - Performance of a contract</li>
                <li>Art. 6(1)(c) GDPR - Compliance with a legal obligation</li>
                <li>Art. 6(1)(f) GDPR - Legitimate interests</li>
              </ul>

              <h2>Cookies</h2>
              <p>
                Our website uses only one strictly necessary cookie called &apos;isPreviewMode&apos;. This cookie is essential for the proper functioning of our content management system&apos;s preview functionality and is only set when using the preview feature. This cookie does not track user activity or collect personal information.
              </p>
              <p>
                As this cookie is strictly necessary for the functioning of our website, it is exempt from the consent requirement under applicable data protection laws. The cookie is automatically removed when you exit the preview mode or expires after 24 hours.
              </p>

              <h2>Third-Party Services</h2>
              <p>
                We may employ third-party companies and individuals due to the following reasons:
              </p>
              <ul>
                <li>To facilitate our service</li>
                <li>To provide the service on our behalf</li>
                <li>To perform service-related services</li>
                <li>To assist us in analyzing how our service is used</li>
              </ul>
              <p>
                These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
              </p>

              <h2>Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
              </p>

              <h2>Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
              <p>
                Specifically, we maintain the following retention periods:
              </p>
              <ul>
                <li>Contact form submissions: 2 years from the date of submission</li>
                <li>Server logs containing IP addresses and usage data: 90 days</li>
                <li>Account information (if applicable): For the duration of your account plus 30 days after deletion</li>
              </ul>
              <p>
                After the retention period expires, your personal information will be deleted or anonymized. If for technical reasons we cannot completely delete your data, we will ensure it is isolated and no longer processed.
              </p>

              <h2>Your Data Protection Rights</h2>
              <p>
                Under the General Data Protection Regulation (GDPR), if you are a resident of the European Economic Area (EEA), you have the following rights regarding your personal data:
              </p>
              <ul>
                <li><strong>Right to Access (Art. 15 GDPR)</strong>: You have the right to request copies of your personal data. We may charge you a small fee for this service.</li>
                <li><strong>Right to Rectification (Art. 16 GDPR)</strong>: You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete.</li>
                <li><strong>Right to Erasure (Art. 17 GDPR)</strong>: You have the right to request that we erase your personal data, under certain conditions.</li>
                <li><strong>Right to Restrict Processing (Art. 18 GDPR)</strong>: You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
                <li><strong>Right to Object to Processing (Art. 21 GDPR)</strong>: You have the right to object to our processing of your personal data, under certain conditions.</li>
                <li><strong>Right to Data Portability (Art. 20 GDPR)</strong>: You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.</li>
                <li><strong>Right to Withdraw Consent (Art. 7(3) GDPR)</strong>: If we rely on your consent to process your personal data, you have the right to withdraw that consent at any time.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the contact information provided at the end of this Privacy Policy. We will respond to your request within 30 days.
              </p>

              <h2>Supervisory Authority</h2>
              <p>
                If you are a resident of the European Economic Area (EEA) and you believe we are unlawfully processing your personal data, you have the right to lodge a complaint with your local data protection supervisory authority. In Germany, this is the data protection authority (Datenschutzbehörde) of the federal state (Bundesland) where our company is headquartered or where you reside.
              </p>
              <p>
                You can find a list of German data protection authorities at: <a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" target="_blank" rel="noopener noreferrer">www.bfdi.bund.de</a>
              </p>

              <h2>Data Protection Officer</h2>
              <p>
                In compliance with German data protection laws, we have appointed a Data Protection Officer (Datenschutzbeauftragter) who can be contacted regarding any questions or concerns about our data processing practices:
              </p>
              <ul>
                <li>Name: Lennart Gründel</li>
                <li>Email: info@git-consult.group</li>
                <li>Address: Mädler-Passage, Aufgang B, Grimmaische Str. 2-4, 04109 Leipzig</li>
              </ul>

              <h2>Automated Decision Making and Profiling</h2>
              <p>
                We do not use automated decision-making or profiling techniques that produce legal effects concerning you or similarly significantly affect you. Our website does not make decisions about you using solely automated means without any human involvement.
              </p>
              <p>
                The limited data we collect is used only for the purposes described in this Privacy Policy and is not used for automated profiling or decision-making processes.
              </p>

              <h2>Children&apos;s Privacy</h2>
              <p>
                Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
              </p>

              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &apos;Last updated&apos; date.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>By email: info@git-consult.group</li>
                <li>By phone: +49 179 126 7379</li>
                <li>By mail: Mädler-Passage, Aufgang B, Grimmaische Str. 2-4, 04109 Leipzig</li>
              </ul>
            </div>
          </div>
        </section>
      </>
  );
}
