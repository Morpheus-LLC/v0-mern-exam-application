import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ScholarshipPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="text-xl font-bold">Reward NGO Scholarship Test</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/signup">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900 px-3 py-1 text-sm">
                MERIT TECH Scholarship
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-blue-600 dark:text-blue-400">learning</span>,{" "}
                <span className="text-green-600 dark:text-green-400">doing</span>,{" "}
                <span className="text-amber-600 dark:text-amber-400">earning</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Unlock Your Engineering Potential with the MERIT TECH Scholarship!
              </p>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg">Apply Now</Button>
                </Link>
                <Link href="#benefits">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <div className="w-full h-[300px] rounded-xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">REWARD NGO logo or students learning image</p>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">About the MERIT TECH Scholarship</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Are you a bright and ambitious student who has successfully cleared the MPC (Mathematics, Physics,
                  Chemistry) stream and is looking to pursue a Diploma or Engineering degree? REWARD NGO is committed to
                  empowering the next generation of technical leaders through its innovative MERIT TECH Scholarship.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  This unique program goes beyond just financial assistance. It integrates Learning, Doing, and Earning
                  (LDE) to provide you with a holistic educational experience, bridging the gap between theoretical
                  knowledge and practical application, all while on campus.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="font-semibold mb-2">Our Vision</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    To nurture talented individuals like you, equipping you with the skills and experience necessary to
                    excel in your chosen field and build a successful career.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Who is this scholarship for?</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                This scholarship is designed for students who meet the following criteria:
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Academic Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Successfully passed their eligibility test for the MPC stream (presumably relevant entrance exams
                    like EAMCET & ECET).
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Educational Aspirations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    A strong desire to pursue Diploma or Engineering studies.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Practical Mindset</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    A motivation to engage in practical learning and gain real-world experience.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Unique Features Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                What makes the MERIT TECH Scholarship unique?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                The MERIT TECH Scholarship offers a comprehensive support system that includes:
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600 dark:text-blue-400"
                  >
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Financial Assistance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Providing significant reductions in your academic expenses.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600 dark:text-green-400"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Practical Knowledge Focus</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Emphasizing hands-on learning alongside theoretical concepts.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-amber-600 dark:text-amber-400"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">On-Campus Learning</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Integrating the LDE model within the campus environment.
                </p>
              </div>
              <div className="flex flex-col items-center text-center space-y-2 p-6 border rounded-lg">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600 dark:text-purple-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path>
                    <path d="M12 18V6"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Opportunity for Earning</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Providing avenues to gain real-time experience and potentially earn while you learn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Scholarship Benefits for Students</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                The MERIT TECH Scholarship offers a range of significant benefits designed to support your academic and
                professional growth:
              </p>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Scholarship Benefits by Rank</CardTitle>
                  <CardDescription>Based on your performance in the eligibility test</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="font-semibold">For ranks 1-100:</span> 4 years engineering tuition sponsorship
                        with Learning-Doing-Earning (LDE) program, placement assistance, and real-time projects in the
                        college campus on respective core engineering.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="font-semibold">For ranks 101-1000:</span> Rs.30,000/- college fee (4 years)
                        with Learning-Doing-Earning (LDE) program, placement assistance, and real-time projects in the
                        college campus on respective core engineering.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <span className="font-semibold">For ranks 1001-10000:</span> Learning-Doing-Earning (LDE)
                        program, placement assistance, and real-time projects in the college campus on respective core
                        engineering.
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Major Project Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      Financial assistance of ₹ 5,000/- for your main project during your studies.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Entrepreneurship Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      Access to a specialized program focused on "On-Job & Other Abstracts" to foster entrepreneurial
                      skills.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Real-Time Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      Opportunities to gain valuable practical experience alongside your academic learning.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Potential for Earning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      A structured approach to "Earning through comprehensive revenue" (monthly expenses), providing
                      financial support and real-world application of your skills.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>On-Campus Accommodation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      Support with on-campus living arrangements to ensure a comfortable learning environment.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Supportive Environment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 dark:text-gray-400">
                      Learn and grow within the campus community with the guidance of REWARD NGO.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Beyond Financials Section */}
        <section className="w-full py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Beyond the Financials</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                The MERIT TECH Scholarship is more than just money. It's an opportunity to grow and excel.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col space-y-2 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">Develop Practical Skills</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The LDE model ensures you are not just learning theory but also applying it in real-world scenarios.
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">Gain a Competitive Edge</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Real-time experience and potential earning opportunities will make you a more attractive candidate to
                  future employers.
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">Become an Entrepreneur</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  The dedicated entrepreneurship program can equip you with the knowledge and skills to start your own
                  venture.
                </p>
              </div>

              <div className="flex flex-col space-y-2 p-6 border rounded-lg">
                <h3 className="text-xl font-semibold">Thrive in a Supportive Environment</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Learn and grow within the campus community with the guidance of REWARD NGO.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Process Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How to Apply</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                The selection process for the MERIT TECH Scholarship involves several key stages:
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">1</span>
                  </div>
                  <CardTitle>Communication</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Stay updated on announcements and application procedures through our website and dedicated
                    application portal.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">2</span>
                  </div>
                  <CardTitle>Data Sourcing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    We gather information to identify eligible candidates based on academic performance and other
                    criteria.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">3</span>
                  </div>
                  <CardTitle>Eligibility Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    You will need to enroll and appear for an eligibility test to determine your scholarship tier.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 text-center">
              <Link href="/signup">
                <Button size="lg" className="px-8">
                  Apply for Scholarship
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600 dark:bg-blue-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-white md:text-4xl">
                Ready to Transform Your Future?
              </h2>
              <p className="mx-auto max-w-[700px] text-blue-100 md:text-xl">
                Take the first step towards a comprehensive education that combines learning, doing, and earning.
              </p>
              <div className="space-x-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary">
                    Apply Now
                  </Button>
                </Link>
                <Link href="/exam">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Take Eligibility Test
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Reward NGO Scholarship Test. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
