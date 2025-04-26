"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"
import FAQSection from "@/components/faq-section"

// Blinking text component with 250ms interval
function BlinkingText({ text }: { text: string }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible((prev) => !prev)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return <span style={{ visibility: visible ? "visible" : "hidden" }}>{text}</span>
}

export default function Home() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)

      toast({
        title: "Login successful",
        description: "You are now logged in.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to log in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Function to handle test sign-in
  const handleTestSignIn = async () => {
    setLoading(true)

    // Use demo credentials
    const testCredentials = {
      email: "demo@example.com",
      password: "password123",
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testCredentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Test sign-in failed")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)

      toast({
        title: "Test sign-in successful",
        description: "You are now logged in as a test user.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Test sign-in error:", error)
      toast({
        title: "Test sign-in failed",
        description: error instanceof Error ? error.message : "Failed to sign in with test account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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

      {/* Header Section */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold uppercase">
                ENGINEERING STUDY SCHOLARSHIP TEST <BlinkingText text="ONLINE" />
              </h1>

              <div className="mt-2">
                <p className="font-medium">ELIGIBILITY: MPC pass</p>
                <p>Successful candidates can avail the following privileges</p>
                <p className="text-sm text-right">Terms and conditions apply*</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 border-l-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0">
              <p className="text-xl font-medium text-right">Supported by</p>
              <div className="flex flex-col space-y-4 mt-2">
                <div className="flex items-center justify-end">
                  <span className="font-bold mr-3">REWARD</span>
                  <div className="w-16 h-16">
                    <Image
                      src="/images/reward-logo.png"
                      alt="REWARD NGO Logo"
                      width={100}
                      height={100}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <span className="font-bold mr-3">LIVE-IN FOUNDATION</span>
                  <div className="w-16 h-16 bg-black flex items-center justify-center">
                    <Image
                      src="/images/live-in-foundation-logo.png"
                      alt="LIVE-IN FOUNDATION Logo"
                      width={100}
                      height={50}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto">
          <ul className="flex flex-wrap justify-center">
            <li className="border-r">
              <Link href="/" className="block px-6 py-4 font-bold hover:bg-gray-100">
                HOME
              </Link>
            </li>
            <li className="border-r">
              <Link href="/about" className="block px-6 py-4 font-bold hover:bg-gray-100">
                ABOUT US
              </Link>
            </li>
            <li className="border-r">
              <Link href="/scholarship" className="block px-6 py-4 font-bold hover:bg-gray-100">
                SCHOLARSHIP
              </Link>
            </li>
            <li className="border-r">
              <Link href="/eligibility" className="block px-6 py-4 font-bold hover:bg-gray-100">
                ELIGIBILITY
              </Link>
            </li>
            <li className="border-r">
              <Link href="/edl" className="block px-6 py-4 font-bold hover:bg-gray-100">
                EDL
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block px-6 py-4 font-bold hover:bg-gray-100">
                CONTACT US
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <main className="flex-1">
        {/* Main Content Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Scholarship Info */}
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Unlock Your Engineering Dreams with Our Scholarship Test!</h2>
                <p className="text-lg">
                  Are you an aspiring engineer with big dreams? Here's your chance to make those dreams a reality!
                  Participate in our Engineering Scholarship Test and get an opportunity to receive significant
                  financial support for your entire engineering education. We believe in nurturing talent and providing
                  the right platform for bright minds to excel.
                </p>
              </div>

              {/* Right Column - Login Form */}
              <div className="md:w-1/2">
                <h3 className="text-xl font-medium mb-4">Login / register</h3>
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <input
                      type="text"
                      name="email"
                      placeholder="Username"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {/* Removed the Forgot Password link as requested */}
                  <div className="flex gap-4">
                    <Link
                      href="/signup"
                      className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-full text-center"
                    >
                      Register
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full disabled:opacity-70"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>

                {/* Test Sign In Button */}
                <div className="mt-4">
                  <button
                    onClick={handleTestSignIn}
                    disabled={loading}
                    className="w-full border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-full disabled:opacity-70"
                  >
                    Test Sign In (Demo User)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarship Benefits Table */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-medium mb-6">
              Here's a breakdown of the exciting scholarship opportunities based on your rank:
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-4 text-left">Rank Range</th>
                    <th className="border p-4 text-left">Scholarship Benefits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-4 font-medium">1 - 100</td>
                    <td className="border p-4">
                      <p className="font-medium">4 years engineering tuition sponsorship, including:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Learning-Doing-Earning (LDE) program</li>
                        <li>Placement assistance</li>
                        <li>Real-time projects in the college campus on respective core engineering</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-4 font-medium">101 - 1000</td>
                    <td className="border p-4">
                      <p className="font-medium">Rs.30,000/- college fee (4 years), including:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Learning-Doing-Earning (LDE) program</li>
                        <li>Placement assistance</li>
                        <li>Real-time projects in the college campus on respective core engineering</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-4 font-medium">1001 - 10000</td>
                    <td className="border p-4">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Learning-Doing-Earning (LDE) program</li>
                        <li>Placement assistance</li>
                        <li>Real-time projects in the college campus on respective core engineering</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* LDE Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-6">
              <span className="text-blue-600">LEARNING</span>-<span className="text-green-600">DOING</span>-
              <span className="text-amber-600">EARNING</span>
              <span className="text-gray-700"> (LDE)</span>
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-lg">
                  <span className="font-medium">1.</span> Introducing Learning-Doing-Earning system to integrate the
                  real-time core fields the student will learn more through Assignments/practicals and live
                  demonstrations in the classroom, while doing will earn compensation for the student's skill towards
                  self-sustainability will uplift their enthusiasm to concentrate more on careers in core subjects.
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <span className="font-medium">2.</span> All the students who undergo LDE method, will get threeyears
                  of Real-Time Experience Certificate in their relevant core. The successful candidates are to be
                  assisted in Entrepreneurship projects with all facilities related to own firm startups -(Project
                  guidelines- Funds procurement & Marketing etc.) During the LDE program the students will be taken on
                  monthly corporate visits/tours for entrepreneurship live visualizations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <footer className="bg-gray-100 border-t pt-8 pb-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-sm text-gray-600">
                The Engineering Study Scholarship Test is an initiative to support talented students in pursuing their
                engineering education through financial assistance and practical learning opportunities.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/scholarship" className="hover:underline">
                    Scholarship Details
                  </Link>
                </li>
                <li>
                  <Link href="/eligibility" className="hover:underline">
                    Eligibility Criteria
                  </Link>
                </li>
                <li>
                  <Link href="/edl" className="hover:underline">
                    Learning-Doing-Earning
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:underline">
                    About REWARD NGO
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+91 9876543210</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>contact@rewardngo.org</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>Hyderabad, Telangana, India</span>
                </li>
              </ul>
            </div>

            {/* Social Media & Legal */}
            <div>
              <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-pink-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                </a>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <Link href="/terms" className="hover:underline">
                    Terms & Conditions
                  </Link>
                </p>
                <p>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Engineering Study Scholarship Test. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
