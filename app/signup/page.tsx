"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import FAQSection from "@/components/faq-section"

// List of districts in Telangana
const telanganaDistricts = [
  "Adilabad",
  "Bhadradri Kothagudem",
  "Hyderabad",
  "Jagtial",
  "Jangaon",
  "Jayashankar Bhupalpally",
  "Jogulamba Gadwal",
  "Kamareddy",
  "Karimnagar",
  "Khammam",
  "Komaram Bheem Asifabad",
  "Mahabubabad",
  "Mahabubnagar",
  "Mancherial",
  "Medak",
  "Medchal–Malkajgiri",
  "Mulugu",
  "Nagarkurnool",
  "Nalgonda",
  "Narayanpet",
  "Nirmal",
  "Nizamabad",
  "Peddapalli",
  "Rajanna Sircilla",
  "Rangareddy",
  "Sangareddy",
  "Siddipet",
  "Suryapet",
  "Vikarabad",
  "Wanaparthy",
  "Warangal",
  "Yadadri Bhuvanagiri",
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    rollNumber: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    intermediateHallTicket: "",
    eamcetHallTicket: "",
    gender: "",
    age: "",
    district: "",
    collegeAddress: "",
    homeAddress: "",
    rationCard: "none",
    rationCardNumber: "", // Added ration card number field
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset ration card number when changing ration card type to "none"
    if (name === "rationCard" && value === "none") {
      setFormData((prev) => ({ ...prev, rationCardNumber: "" }))
    }
  }

  // Update the handleSubmit function to include better error handling and navigation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    // Basic validation for required fields
    const requiredFields = [
      "name",
      "email",
      "password",
      "collegeName",
      "rollNumber",
      "phoneNumber",
      "intermediateHallTicket",
      "eamcetHallTicket",
      "gender",
      "age",
      "district",
      "collegeAddress",
      "homeAddress",
    ]

    // Add ration card number as required field if white or pink card is selected
    if (formData.rationCard === "white" || formData.rationCard === "pink") {
      requiredFields.push("rationCardNumber")
    }

    const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      toast({
        title: "Account created!",
        description: "You can now log in with your credentials.",
      })

      // Automatically log in the user after successful signup
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const loginData = await loginResponse.json()

      if (loginResponse.ok) {
        localStorage.setItem("token", loginData.token)
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Check if ration card number is required
  const isRationCardNumberRequired = formData.rationCard === "white" || formData.rationCard === "pink"

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">
                      Age<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="18"
                      required
                      min="15"
                      max="30"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                      Phone Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Your Phone Number"
                      required
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhoneNumber">Alternate Phone Number</Label>
                    <Input
                      id="alternatePhoneNumber"
                      name="alternatePhoneNumber"
                      type="tel"
                      placeholder="Alternate Phone Number (Optional)"
                      value={formData.alternatePhoneNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">
                      District<span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.district} onValueChange={(value) => handleSelectChange("district", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {telanganaDistricts.map((district) => (
                          <SelectItem key={district} value={district.toLowerCase()}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rationCard">Ration Card</Label>
                    <Select
                      value={formData.rationCard}
                      onValueChange={(value) => handleSelectChange("rationCard", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ration card type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="white">White Card</SelectItem>
                        <SelectItem value="pink">Pink Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Conditionally show ration card number field */}
                  {isRationCardNumberRequired && (
                    <div className="space-y-2">
                      <Label htmlFor="rationCardNumber">
                        Ration Card Number<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="rationCardNumber"
                        name="rationCardNumber"
                        placeholder="Enter your ration card number"
                        required
                        value={formData.rationCardNumber}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeAddress">
                    Home Address<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="homeAddress"
                    name="homeAddress"
                    placeholder="Your home address"
                    required
                    value={formData.homeAddress}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Educational Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="intermediateHallTicket">
                      Intermediate Hall Ticket Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="intermediateHallTicket"
                      name="intermediateHallTicket"
                      placeholder="Intermediate Hall Ticket Number"
                      required
                      value={formData.intermediateHallTicket}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eamcetHallTicket">
                      EAMCET Hall Ticket Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="eamcetHallTicket"
                      name="eamcetHallTicket"
                      placeholder="EAMCET Hall Ticket Number"
                      required
                      value={formData.eamcetHallTicket}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="collegeName">
                      College Name<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="collegeName"
                      name="collegeName"
                      placeholder="Engineering College Name"
                      required
                      value={formData.collegeName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">
                      Roll Number<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      placeholder="Your College Roll Number"
                      required
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeAddress">
                    College Address<span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="collegeAddress"
                    name="collegeAddress"
                    placeholder="Your college address"
                    required
                    value={formData.collegeAddress}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Security</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm Password<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline underline-offset-4">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* Scholarship Benefits Table */}
      <section className="py-8 border-b bg-white">
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
                    <p className="font-medium">100% Sponsorship on complete Engineering Education, including:</p>
                    <p className="mt-2">* Full Tuition Fee Coverage</p>
                    <p className="mt-2">* Complete Hostel Fee Coverage</p>
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">101 - 1000</td>
                  <td className="border p-4">
                    <p className="font-medium">
                      50% Sponsorship on complete Engineering Education (Tuition & other academic fees)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border p-4 font-medium">1001 - 10000</td>
                  <td className="border p-4">
                    <p className="font-medium">
                      30% Sponsorship on complete Engineering Education (Tuition & other academic fees)
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* LDE Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-6">LEARNING-DOING-EARNING (LDE)</h2>
          <div className="space-y-6">
            <div>
              <p className="text-lg">
                <span className="font-medium">1.</span> Introducing Learning-Doing-Earning system to integrate the
                real-time core fields the student will learn more through Assignments/practicals and live demonstrations
                in the classroom, while doing will earn compensation for the student's skill towards self-sustainability
                will uplift their enthusiasm to concentrate more on careers in core subjects.
              </p>
            </div>
            <div>
              <p className="text-lg">
                <span className="font-medium">2.</span> All the students who undergo LDE method, will get threeyears of
                Real-Time Experience Certificate in their relevant core. The successful candidates are to be assisted in
                Entrepreneurship projects with all facilities related to own firm startups -(Project guidelines- Funds
                procurement & Marketing etc.) During the LDE program the students will be taken on monthly corporate
                visits/tours for entrepreneurship live visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      <footer className="bg-gray-100 py-4 border-t mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Engineering Study Scholarship Test. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
