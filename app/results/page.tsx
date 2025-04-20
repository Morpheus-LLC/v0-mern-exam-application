"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type ExamResult = {
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: {
    math: number
    physics: number
    chemistry: number
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
            <p className="text-sm text-gray-500 mt-2">
              {result.correctAnswers} correct out of {result.totalQuestions} questions
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Subject Performance</h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Mathematics</span>
                  <span className="text-sm font-medium">{result.subjectScores.math}%</span>
                </div>
                <Progress value={result.subjectScores.math} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Physics</span>
                  <span className="text-sm font-medium">{result.subjectScores.physics}%</span>
                </div>
                <Progress value={result.subjectScores.physics} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Chemistry</span>
                  <span className="text-sm font-medium">{result.subjectScores.chemistry}%</span>
                </div>
                <Progress value={result.subjectScores.chemistry} className="h-2" />
              </div>
            </div>
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
