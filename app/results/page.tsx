"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"

type ExamResult = {
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: {
    math: number
    science: number
    chemistry: number
    english: number
    physics?: number
  }
  date: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    // Fetch results
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/exam/results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch results")
        }

        const data = await response.json()
        setResult(data.result)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam results. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [router])

  // For demo purposes, let's create a sample result
  useEffect(() => {
    if (!result && !loading) {
      const sampleResult: ExamResult = {
        totalQuestions: 60,
        correctAnswers: 46,
        score: 76.7,
        subjectScores: {
          math: 85,
          physics: 75,
          chemistry: 70,
        },
        date: new Date().toISOString(),
      }

      setResult(sampleResult)
    }
  }, [loading, result])

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading results...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>No Results Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You haven't completed any exams yet.</p>
            <Button onClick={handleBackToDashboard}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-2" />
          <CardTitle className="text-2xl">Exam Completed Successfully!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg">Thank you for completing the exam. Your submission has been recorded.</p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Your score</p>
            <p className="text-4xl font-bold">{result.score}%</p>
          </div>

          <p className="text-gray-600">We will review your results and contact you soon with further information.</p>

          <Button onClick={handleBackToDashboard} className="mt-4">
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
