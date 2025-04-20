"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasActiveExam, setHasActiveExam] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("token")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    // Check for active exam attempt
    const checkActiveExam = async () => {
      try {
        const response = await fetch("/api/exam/attempt", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          // User has an active exam
          setHasActiveExam(true)

          // Redirect to exam page
          toast({
            title: "Active Exam Found",
            description: "You have an ongoing exam. Redirecting to the exam page.",
          })

          setTimeout(() => {
            router.push("/exam")
          }, 1500)
        }
      } catch (error) {
        // No active exam or error, continue to dashboard
        console.log("No active exam found")
      }
    }

    fetchUser()
    checkActiveExam()
  }, [router])

  const handleStartExam = () => {
    router.push("/exam")
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Start New Exam</CardTitle>
            <CardDescription>
              Take a comprehensive exam with questions from Math, Physics, and Chemistry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The exam consists of 60 questions (20 from each subject: Mathematics, Physics, and Chemistry) and is
              randomized for each attempt. You'll have 60 minutes to complete the exam.
            </p>
            {hasActiveExam && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  You have an active exam in progress. Click the button below to continue your exam.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartExam}>{hasActiveExam ? "Continue Exam" : "Start Exam"}</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>View your previous exam attempts and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You haven't taken any exams yet. Start an exam to see your results here.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled>
              View Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
