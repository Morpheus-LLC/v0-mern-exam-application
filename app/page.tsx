import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Award, BookOpen, GraduationCap, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar */}
      <header className="px-4 lg:px-6 py-4 flex items-center border-b bg-white dark:bg-gray-950 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link className="flex items-center gap-2" href="/">
            <Image src="/images/reward-logo.png" width={60} height={60} alt="REWARD NGO Logo" className="" />
            <span className="text-lg font-bold">REWARD NGO Scholarship Test</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/">
              Home
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/scholarship">
              Scholarship
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/about">
              About Us
            </Link>
            <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="/contact">
              Contact
            </Link>
          </nav>
          <div className="flex gap-3 items-center">
            <Link className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors" href="/login">
              Login
            </Link>
            <Link href="/signup">
              <Button size="sm" className="rounded-full px-4">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/cosmic-dust.png')] opacity-10"></div>
          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32 relative">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <span className="mr-1">✨</span> Engineering Scholarship Test
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  <span className="text-blue-600 dark:text-blue-400">Reward</span> NGO Scholarship Test
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  Take our comprehensive exam covering Math, Science, Chemistry, and English to unlock your path to
                  engineering excellence.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full px-8 py-6 text-base">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/scholarship">
                    <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-base group">
                      <span>Learn About Scholarship</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[350px] md:h-[450px]">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg transform translate-x-4 translate-y-4 opacity-20"></div>
                <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                  <Image
                    src="/placeholder.svg?key=ldmtm"
                    alt="Students taking exam"
                    width={500}
                    height={450}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Comprehensive Testing</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Our exam platform offers a wide range of questions across four key subjects to thoroughly evaluate your
                knowledge and abilities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Math */}
              <Card className="overflow-hidden border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
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
                      <path d="M19 5h-7L8 19l-3-6H2"></path>
                      <path d="M22 5h-3"></path>
                      <path d="M17 9h-2.5"></path>
                    </svg>
                  </div>
                  <CardTitle>Mathematics</CardTitle>
                  <CardDescription>Analytical and Problem Solving</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your mathematical prowess through complex problems requiring logical reasoning and analytical
                    thinking.
                  </p>
                </CardContent>
              </Card>

              {/* Science */}
              <Card className="overflow-hidden border-t-4 border-green-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
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
                      <path d="M10 2v8L5 8"></path>
                      <path d="M14 4v8l-4-2"></path>
                      <path d="M8.86 13.34a4 4 0 0 0 7.28 3.32"></path>
                      <path d="M7 14h.01"></path>
                      <path d="M7 21a7 7 0 1 0 0-14h14"></path>
                    </svg>
                  </div>
                  <CardTitle>Science</CardTitle>
                  <CardDescription>Principles and Applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Explore scientific concepts, natural phenomena, and application of scientific principles to
                    real-world scenarios.
                  </p>
                </CardContent>
              </Card>

              {/* Chemistry */}
              <Card className="overflow-hidden border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
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
                      <path d="M9 3v2"></path>
                      <path d="M9 9v12"></path>
                      <path d="M15 3v18"></path>
                      <path d="M10 17.5a2 2 0 1 1-2-2c.5 0 .9.3 1.3.5 1.1.6 1.7.5 2.7-.5"></path>
                      <path d="M12 12a5 5 0 0 0 4-5c0-3-2-4-4-5-2 1-4 2-4 5a5 5 0 0 0 4 5Z"></path>
                    </svg>
                  </div>
                  <CardTitle>Chemistry</CardTitle>
                  <CardDescription>Elements and Reactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Test your knowledge of chemical elements, compounds, reactions, and laboratory procedures essential
                    for engineering.
                  </p>
                </CardContent>
              </Card>

              {/* English */}
              <Card className="overflow-hidden border-t-4 border-amber-500 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mb-2">
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
                      <path d="M17 17v.5A2.5 2.5 0 0 1 14.5 20h-8A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4h8A2.5 2.5 0 0 1 17 6.5V7"></path>
                      <path d="M21.54 11.5A2 2 0 0 1 22 13c0 .6-.13 1.2-.36 1.74"></path>
                      <path d="M20.09 16.84A2 2 0 0 1 18.5 17a2.5 2.5 0 0 1-2.45-2h.05c.5.03 1.07-.25 1.75-.85 1.33-1.18 1.88-2.47 1.83-3.97"></path>
                      <path d="M18.5 10.5c.5 0 1.08-.24 1.75-.85 1.34-1.18 1.88-2.47 1.83-3.97"></path>
                      <path d="M22 8.5c0 .6-.13 1.2-.36 1.74"></path>
                    </svg>
                  </div>
                  <CardTitle>English</CardTitle>
                  <CardDescription>Communication and Comprehension</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">
                    Evaluate your language proficiency, comprehension ability, and effective communication skills
                    necessary in technical fields.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Scholarship Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4">
            <div className="w-64 h-64 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-70 blur-3xl"></div>
          </div>
          <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4">
            <div className="w-64 h-64 rounded-full bg-blue-200 dark:bg-blue-800/20 opacity-70 blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col items-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                <Award className="w-4 h-4 mr-1" /> MERIT TECH Scholarship
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                <span className="text-blue-600 dark:text-blue-400">Engineering Scholarship</span> Benefits
              </h2>
              <p className="mx-auto max-w-3xl text-gray-600 dark:text-gray-400 text-lg">
                Our scholarship program is designed to support aspiring engineers with exceptional opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-gray-900 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-600 text-white p-3 rounded-lg inline-flex w-12 h-12 items-center justify-center mb-2">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <CardTitle>Free Seats</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Top performers receive fully-funded seats at partner engineering colleges, covering tuition and
                    accommodation.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/40 dark:to-gray-900 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-green-600 text-white p-3 rounded-lg inline-flex w-12 h-12 items-center justify-center mb-2">
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
                      className="h-6 w-6"
                    >
                      <path d="M12 2v20"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <CardTitle>Tuition Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Qualify for up to 75% tuition fee discounts at prestigious engineering institutions based on your
                    test performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/40 dark:to-gray-900 border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-600 text-white p-3 rounded-lg inline-flex w-12 h-12 items-center justify-center mb-2">
                    <Users className="w-6 h-6" />
                  </div>
                  <CardTitle>Mentorship Program</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    Gain access to our exclusive mentorship program with industry professionals and academic experts in
                    engineering fields.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 flex justify-center">
              <Link href="/scholarship">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-base rounded-full group border-blue-200 dark:border-blue-800"
                >
                  <span className="mr-2">View All Scholarship Details</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* LDE Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="relative h-[400px] w-full">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg transform -translate-x-4 -translate-y-4 opacity-20"></div>
                  <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    <Image
                      src="/campus-collaboration.png"
                      alt="Students learning"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <BookOpen className="w-4 h-4 mr-1" /> Educational Approach
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  <span className="text-blue-600 dark:text-blue-400">Learning, Doing, Earning</span> Model
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Our unique educational approach integrates theoretical knowledge with practical application, creating
                  opportunities for students to earn while they learn.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="mr-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 p-1 rounded-full">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold">Learning</span> - Acquire essential theoretical knowledge and
                      foundational concepts.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 p-1 rounded-full">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold">Doing</span> - Apply your knowledge through practical projects and
                      real-world applications.
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-3 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 p-1 rounded-full">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17L4 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold">Earning</span> - Gain opportunities to earn while developing
                      professional skills during your education.
                    </div>
                  </li>
                </ul>
                <Link href="/scholarship">
                  <Button className="rounded-full px-6">Discover More</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-900 dark:to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
              <div className="space-y-4 md:w-2/3">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to start your journey?</h2>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Take our comprehensive exam and unlock opportunities for scholarships, mentorship, and a path toward a
                  successful engineering career.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" variant="secondary" className="rounded-full px-8">
                    Create Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 bg-transparent text-white border-white hover:bg-white hover:text-blue-600"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link className="flex items-center gap-2" href="/">
                <Image src="/images/reward-logo.png" width={60} height={60} alt="REWARD NGO Logo" className="" />
                <span className="text-lg font-bold">REWARD NGO</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Empowering students through education and providing opportunities for a better future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/scholarship"
                  >
                    Scholarship
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/exam"
                  >
                    Take Exam
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/results"
                  >
                    View Results
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/faq"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
                    href="/terms"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © 2024 REWARD NGO Scholarship Test. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
