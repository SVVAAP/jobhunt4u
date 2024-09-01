import React, { useEffect, useRef } from 'react';

function PrivacyPolicy() {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Smooth scroll to the bottom of the content
      contentRef.current.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div
      ref={contentRef}
      className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg h-auto overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          Welcome to <strong>Job Hunt 4 U</strong> ("we", "our", "us"). We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://www.jobhunt4u.in" className="text-blue-500">www.jobhunt4u.in</a> (the "Website") and use our services.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <h3 className="text-lg font-semibold">2.1. Personal Information</h3>
        <p>We collect personal information that you provide to us directly, including but not limited to:</p>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Job Seekers/Candidates:</strong> Name, email address, phone number, resume, cover letters, job preferences, educational background, work experience, and other details included in your profile and job applications.</li>
          <li><strong>Employers:</strong> Company name, contact information, job postings details, and other information related to your hiring activities.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">2.2. Usage Data</h3>
        <p>We collect information about your use of the Website, such as:</p>
        <ul className="list-disc list-inside pl-5">
          <li>IP address, browser type, operating system, referring URLs, pages viewed, and the dates and times of your visits.</li>
          <li>Details about your interactions with the Website, including clicks and search queries.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">2.3. Cookies and Tracking Technologies</h3>
        <p>
          We use cookies, web beacons, and similar technologies to collect information about your browsing behavior and preferences. Cookies are small data files stored on your device. You can control the use of cookies through your browser settings.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <h3 className="text-lg font-semibold">3.1. For Job Seekers/Candidates</h3>
        <ul className="list-disc list-inside pl-5">
          <li><strong>To Provide Services:</strong> To process job applications, manage your profile, match you with relevant job opportunities, and communicate with you about job openings.</li>
          <li><strong>To Improve Our Website:</strong> To analyze usage patterns, improve website functionality, and enhance your user experience.</li>
          <li><strong>For Communication:</strong> To send job alerts, newsletters, and updates about your applications or new job opportunities.</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4">3.2. For Employers</h3>
        <ul className="list-disc list-inside pl-5">
          <li><strong>To Provide Services:</strong> To post job openings, manage job listings, review job applications, and communicate with job seekers.</li>
          <li><strong>To Improve Our Website:</strong> To analyze usage patterns and improve the recruitment process.</li>
          <li><strong>For Communication:</strong> To provide updates about your job postings and other relevant information.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. How We Share Your Information</h2>
        <h3 className="text-lg font-semibold">4.1. With Service Providers</h3>
        <p>We may share your information with third-party service providers who assist us in operating our Website, performing services on our behalf, or analyzing data (e.g., hosting, payment processing, analytics).</p>

        <h3 className="text-lg font-semibold mt-4">4.2. With Employers</h3>
        <p>Job seekers' profiles and application details may be shared with employers to facilitate the recruitment process.</p>

        <h3 className="text-lg font-semibold mt-4">4.3. Legal Requirements</h3>
        <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a subpoena, court order).</p>

        <h3 className="text-lg font-semibold mt-4">4.4. Business Transfers</h3>
        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, use, or disclosure. These measures include encryption, secure servers, and access controls. However, no system is completely secure, and we cannot guarantee the absolute security of your data.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Data Retention</h2>
        <h3 className="text-lg font-semibold">6.1. Retention Period</h3>
        <p>We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including to comply with legal obligations, resolve disputes, and enforce agreements.</p>

        <h3 className="text-lg font-semibold mt-4">6.2. Account Deletion</h3>
        <p>You may request the deletion of your account and personal information by contacting us at <a href="mailto:customercare@jobhunt4u.in" className="text-blue-500">customercare@jobhunt4u.in</a>. We will process your request in accordance with applicable laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
        <h3 className="text-lg font-semibold">7.1. Access and Correction</h3>
        <p>You have the right to access, correct, or update your personal information held by us. You can do this through your account settings or by contacting us directly.</p>

        <h3 className="text-lg font-semibold mt-4">7.2. Opt-Out</h3>
        <p>You may opt-out of receiving promotional communications from us by following the unsubscribe instructions provided in those communications.</p>

        <h3 className="text-lg font-semibold mt-4">7.3. Data Protection Rights</h3>
        <p>Depending on your jurisdiction, you may have additional rights under applicable data protection laws, such as the right to object to processing, request data portability, or lodge a complaint with a data protection authority.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Third-Party Links</h2>
        <p>Our Website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Children’s Privacy</h2>
        <p>Our Website is not intended for children under the age of 13. We do not knowingly collect or solicit personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy periodically. Changes will be posted on this page with an updated effective date. Your continued use of the Website after such changes constitutes your acceptance of the revised policy.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Email:</strong> <a href="mailto:customercare@jobhunt4u.in" className="text-blue-500">customercare@jobhunt4u.in</a></li>
          <li><strong>Phone:</strong> 8951058500</li>
        </ul>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
