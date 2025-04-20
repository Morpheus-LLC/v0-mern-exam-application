"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingQuestions, setCheckingQuestions] = useState(true)
  const [hasEnoughQuestions, setHasEnoughQuestions] = useState(true)
  const [loadingTestData, setLoadingTestData] = useState(false)

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

    fetchUser()

    // Check if we have enough questions
    const checkQuestions = async () => {
      try {
        const response = await fetch("/api/admin/check-questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to check questions")
        }

        const data = await response.json()
        setHasEnoughQuestions(data.hasEnoughQuestions)

        // If we don't have enough questions, load test data automatically
        if (!data.hasEnoughQuestions) {
          await loadTestData()
        }
      } catch (error) {
        console.error("Error checking questions:", error)
      } finally {
        setCheckingQuestions(false)
      }
    }

    checkQuestions()
  }, [router])

  const loadTestData = async () => {
    setLoadingTestData(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await fetch("/api/admin/load-test-data", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to load test data")
      }

      const data = await response.json()
      setHasEnoughQuestions(true)

      toast({
        title: "Test data loaded successfully",
        description: `Loaded questions for the exam.`,
      })
    } catch (error) {
      console.error("Error loading test data:", error)
      toast({
        title: "Error",
        description: "Failed to load test data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingTestData(false)
    }
  }

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
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
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

      {checkingQuestions ? (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
            <p>Checking exam availability...</p>
          </CardContent>
        </Card>
      ) : !hasEnoughQuestions && loadingTestData ? (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500 mr-2" />
            <p>Loading exam questions...</p>
          </CardContent>
        </Card>
      ) : !hasEnoughQuestions ? (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center text-amber-800">
              <AlertCircle className="h-5 w-5 mr-2" />
              Exam Not Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700">
              The exam is not available at the moment because there are not enough questions in the database.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={loadTestData} disabled={loadingTestData}>
              {loadingTestData ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading Questions...
                </>
              ) : (
                "Load Exam Questions"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : null}

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
          </CardContent>
          <CardFooter>
            <Button onClick={handleStartExam} disabled={checkingQuestions || !hasEnoughQuestions}>
              Start Exam
            </Button>
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
            <Button variant="outline" onClick={() => router.push("/results")}>
              View Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
