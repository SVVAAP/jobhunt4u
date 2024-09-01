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
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Acceptance of Terms:</strong> By accessing or using the website, users agree to comply with these Terms and Conditions. If you do not agree, you should not use the website.</li>
          <li><strong>Modifications:</strong> The website reserves the right to update or modify these terms at any time. Continued use of the website after changes indicates acceptance of the revised terms.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Definitions</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>&quot;Website&quot;</strong> refers to ‘Job Hunt 4 U’, including all content and services provided.</li>
          <li><strong>&quot;User&quot;</strong> refers to both job seekers and employers who access or use the website.</li>
          <li><strong>&quot;Job Seeker &quot; or &quot; Candidates &quot;</strong> refers to individuals seeking employment opportunities through the website.</li>
          <li><strong>&quot;Employer&quot;</strong> refers to companies or individuals posting job openings and seeking to hire through the website.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Account Creation:</strong> Users must create an account to access certain features of the website. Users agree to provide accurate and complete information during registration and to update their information as necessary.</li>
          <li><strong>Account Security:</strong> Users are responsible for maintaining the confidentiality of their account information and password. They must notify the website immediately of any unauthorized use of their account.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Job Seeker/ Candidate Responsibilities</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Profile Accuracy:</strong> Job seekers must ensure that their profile and resume information is accurate and up-to-date.</li>
          <li><strong>Application Process:</strong> Job seekers must follow the application process outlined in job postings and ensure their applications are submitted properly.</li>
          <li><strong>Conduct:</strong> Job seekers agree to use the website for lawful purposes only and not to engage in any behavior that could disrupt the website or violate any laws.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Employer Responsibilities</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Job Postings:</strong> Employers must ensure that job postings are accurate, not misleading, and comply with applicable laws and regulations.</li>
          <li><strong>Recruitment Process:</strong> Employers must conduct their recruitment processes fairly and professionally.</li>
          <li><strong>User Data:</strong> Employers agree to handle job seeker data in compliance with privacy laws and not to misuse or disclose such data without consent.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Content Ownership</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Website Content:</strong> All content on the website, including text, graphics, logos, images and software, is the property of the website or its licensors and is protected by copyright, trademark and other intellectual property laws.</li>
          <li><strong>User Content:</strong> Users grant the website a non-exclusive, royalty-free license to use, display, and distribute any content they submit (e.g., resumes, job postings, images).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Prohibited Activities</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Illegal Use:</strong> Users may not use the website for any illegal activities or purposes.</li>
          <li><strong>Prohibited Content:</strong> Users may not post or transmit any content that is defamatory, obscene, or otherwise objectionable.</li>
          <li><strong>Misuse:</strong> Users may not attempt to gain unauthorized access to the website or its systems.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Termination and Suspension</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Termination Rights:</strong> The website reserves the right to suspend or terminate a user’s account if they violate these Terms and Conditions.</li>
          <li><strong>User Termination:</strong> Users may terminate their accounts at any time by following the account closure procedures.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Disclaimers and Limitation of Liability</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Website Availability:</strong> The website makes no guarantees about the availability or reliability of its services and may change or discontinue services at any time.</li>
          <li><strong>Content Accuracy:</strong> The website is not responsible for the accuracy, completeness, or legality of job postings or user-generated content.</li>
          <li><strong>Limitation of Liability:</strong> The website is not liable for any indirect, incidental, or consequential damages arising from the use of the website.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Indemnification</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>User Obligations:</strong> Users agree to indemnify and hold the website harmless from any claims, losses, or damages arising from their use of the website or violation of these Terms and Conditions.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">11. Privacy Policy</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Integration:</strong> These Terms and Conditions incorporate the Privacy Policy, which explains how user data is collected, used, and protected.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">12. Governing Law and Dispute Resolution</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Governing Law:</strong> These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction where Job Hunt 4 U operates.</li>
          <li><strong>Dispute Resolution:</strong> Any disputes arising out of or related to these terms or your use of the website shall be resolved in the courts located in that jurisdiction.</li>
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">13. Changes to Terms</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Modifications:</strong> The website may update these Terms and Conditions periodically. Users will be notified of significant changes, and continued use of the website constitutes acceptance of the revised terms.</li>
          <li> <strong>National Reruitement :</strong>For the user Who get Recruted Nationally <a href='https://firebasestorage.googleapis.com/v0/b/jobhunt4u-d6761.appspot.com/o/National%20Recrutment%20%20Format.pdf?alt=media&token=afcf2dbb-1929-4961-98f0-bdadb0e1bfa6'>
            <strong className='text-sky-500'>Click Here</strong></a></li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">14. Contact Information</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Support:</strong> Users can contact the website for questions or concerns regarding these Terms and Conditions at 8951058500 / customercare@jobhunt4u.in, or through the website’s support channels.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">15. Third-Party Links</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>External Sites:</strong> The website may contain links to third-party websites. The website is not responsible for the content or practices of such third-party sites.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">16. Cookies and Tracking Technologies</h2>
        <ul className="list-disc list-inside pl-5">
          <li><strong>Cookie Policy:</strong> The website uses cookies and tracking technologies to enhance user experience. Users consent to the use of these technologies as described in the Cookie Policy.</li>
        </ul>
      </section>
    </div>
  );
}

export default PrivacyPolicy;

