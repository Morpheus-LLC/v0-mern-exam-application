import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Image */}
      <div className="w-full">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20heading%20%281%29-nqXBUJyhJO3djEltDOzQw65aVxFwx6.png"
          alt="Engineering Study Scholarship Test Online"
          className="w-full h-auto"
        />
      </div>

      {/* Header with navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              Engineering Study Scholarship Test
            </Link>
            <nav>
              <Link href="/" className="px-4 py-2 hover:underline">
                Back to Home
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose max-w-none">
            <p className="mb-4">Last Updated: April 26, 2024</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
            <p className="mb-4">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
              our website and services related to the Engineering Study Scholarship Test. Please read this privacy
              policy carefully. If you do not agree with the terms of this privacy policy, please do not access the
              site.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
            <p className="mb-4">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Register for an account</li>
              <li>Apply for the scholarship test</li>
              <li>Complete forms or surveys</li>
              <li>Participate in the online examination</li>
            </ul>
            <p className="mb-4">This information may include:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Personal details (name, email address, phone number, gender, age)</li>
              <li>Educational information (college name, roll number, hall ticket numbers)</li>
              <li>Address information (home address, college address, district)</li>
              <li>Financial information (ration card details)</li>
              <li>Examination responses and results</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
            <p className="mb-4">We may use the information we collect for various purposes, including:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Processing your scholarship application</li>
              <li>Administering the online examination</li>
              <li>Communicating with you about your application and results</li>
              <li>Verifying your eligibility for the scholarship</li>
              <li>Improving our website and services</li>
              <li>Complying with legal obligations</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of
              transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Third-Party Disclosure</h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Educational institutions for scholarship disbursement purposes</li>
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Government authorities when required by law</li>
            </ul>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties
              for marketing purposes.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to certain exceptions)</li>
              <li>Object to our processing of your information</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last Updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h2>
            <p className="mb-4">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              Email: contact@rewardngo.org
              <br />
              Phone: +91 9876543210
              <br />
              Address: Hyderabad, Telangana, India
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Engineering Study Scholarship Test. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
