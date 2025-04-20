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

export default function LoginPage() {
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

  // Update the handleSubmit function to include better error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      // Store token in localStorage or cookies
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Test Sign In Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 hover:bg-gray-100"
              onClick={handleTestSignIn}
              disabled={loading}
            >
              Test Sign In (Demo User)
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary underline underline-offset-4">
              Sign up
            </Link>
          </p>
          <Link href="/forgot-password" className="text-sm text-primary underline underline-offset-4">
            Forgot your password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
