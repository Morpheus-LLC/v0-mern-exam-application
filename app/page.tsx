"use client"

import type React from "react"

import Link from "next/link"
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
              <p className="text-xl font-medium">Supported by</p>
              <ul className="list-disc pl-6 mt-2">
                <li className="font-bold">REWARD</li>
                <li className="font-bold">LIVE-IN FOUNDATIONs</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto">
          <ul className="flex flex-wrap">
            <li className="border-r">
              <Link href="/" className="block px-6 py-4 font-medium hover:bg-gray-100">
                HOME
              </Link>
            </li>
            <li className="border-r">
              <Link href="/about" className="block px-6 py-4 font-medium hover:bg-gray-100">
                ABOUT US
              </Link>
            </li>
            <li className="border-r">
              <Link href="/scholarship" className="block px-6 py-4 font-medium hover:bg-gray-100">
                SCHOLARSHIP
              </Link>
            </li>
            <li className="border-r">
              <Link href="/eligibility" className="block px-6 py-4 font-medium hover:bg-gray-100">
                ELIGIBILITY
              </Link>
            </li>
            <li className="border-r">
              <Link href="/edl" className="block px-6 py-4 font-medium hover:bg-gray-100">
                EDL
              </Link>
            </li>
            <li>
              <Link href="/contact" className="block px-6 py-4 font-medium hover:bg-gray-100">
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
            <h2 className="text-2xl font-bold text-center mb-6">LEARNING-DOING-EARNING (LDE)</h2>
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

      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Engineering Study Scholarship Test. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
