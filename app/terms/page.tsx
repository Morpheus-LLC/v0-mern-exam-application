import Link from "next/link"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

          <div className="prose max-w-none">
            <p className="mb-4">Last Updated: April 26, 2024</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using the Engineering Study Scholarship Test website and services, you acknowledge that
              you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with
              any part of these terms, please do not use our services.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Eligibility Criteria</h2>
            <p className="mb-4">To be eligible for the Engineering Study Scholarship Test, applicants must:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Have successfully passed their MPC (Mathematics, Physics, Chemistry) stream</li>
              <li>Be seeking to pursue a Diploma or Engineering degree</li>
              <li>Provide valid hall ticket numbers and educational credentials</li>
              <li>Complete the registration process and provide accurate information</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Scholarship Award Process</h2>
            <p className="mb-4">Scholarships will be awarded based on:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Performance in the eligibility test</li>
              <li>Verification of submitted documents and information</li>
              <li>Available funding and number of qualified applicants</li>
            </ul>
            <p className="mb-4">
              The decision of the scholarship committee is final and binding. Scholarship amounts and benefits are
              subject to the tier for which the candidate qualifies.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Examination Rules</h2>
            <p className="mb-4">When taking the online examination:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Candidates must not engage in any form of malpractice or cheating</li>
              <li>The examination must be completed within the allocated time</li>
              <li>Candidates must not leave the examination screen during the test</li>
              <li>Webcam proctoring will be used to ensure examination integrity</li>
              <li>Any violation of examination rules may result in disqualification</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Privacy and Data Usage</h2>
            <p className="mb-4">
              We collect and process personal information in accordance with our Privacy Policy. By using our services,
              you consent to the collection and use of your information as described in the Privacy Policy.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Scholarship Disbursement</h2>
            <p className="mb-4">
              Scholarship funds will be disbursed directly to the educational institution. Recipients must maintain
              satisfactory academic performance to continue receiving benefits. The organization reserves the right to
              withdraw scholarship support if the recipient fails to meet academic requirements or violates any terms
              and conditions.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Modifications to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective
              immediately upon posting on the website. Your continued use of our services after any changes indicates
              your acceptance of the modified terms.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Contact Information</h2>
            <p className="mb-4">
              If you have any questions or concerns regarding these Terms and Conditions, please contact us at:
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
