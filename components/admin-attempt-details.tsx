"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, HelpCircle } from "lucide-react"

type AttemptDetailsProps = {
  attemptId: string | null
  isOpen: boolean
  onClose: () => void
}

type AttemptQuestion = {
  id: string
  text: string
  options: string[]
  subject: string
  selectedOption?: string
  correctOption?: string
  isCorrect?: boolean
}

type AttemptDetails = {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  questions: AttemptQuestion[]
  startTime: string
  endTime: string
  timeRemaining: number
  hasSubmitted: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  statistics: {
    totalQuestions: number
    answeredQuestions: number
    correctAnswers: number
    score: number
    subjectScores: Record<string, number>
  }
}

export default function AdminAttemptDetails({ attemptId, isOpen, onClose }: AttemptDetailsProps) {
  const [attempt, setAttempt] = useState<AttemptDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeSubject, setActiveSubject] = useState<string>("all")

  useEffect(() => {
    if (isOpen && attemptId) {
      fetchAttemptDetails()
    }
  }, [isOpen, attemptId])

  const fetchAttemptDetails = async () => {
    if (!attemptId) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/attempts/${attemptId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch attempt details")
      }

      const data = await response.json()
      setAttempt(data.attempt)

      // Set the first subject as active
      if (data.attempt.questions.length > 0) {
        const subjects = [...new Set(data.attempt.questions.map((q: AttemptQuestion) => q.subject))]
        if (subjects.length > 0) {
          setActiveSubject("all")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load attempt details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const getFilteredQuestions = () => {
    if (!attempt) return []
    if (activeSubject === "all") return attempt.questions
    return attempt.questions.filter((q) => q.subject === activeSubject)
  }

  const getSubjects = () => {
    if (!attempt) return []
    return [...new Set(attempt.questions.map((q) => q.subject))]
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exam Attempt Details</DialogTitle>
          <DialogDescription>Review the user's exam attempt</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          </div>
        ) : attempt ? (
          <div className="space-y-6">
            {/* Attempt Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium">Attempt Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Student:</span>
                    <span className="text-sm font-medium">{attempt.userId.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="text-sm">{attempt.userId.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Started:</span>
                    <span className="text-sm">{formatDate(attempt.startTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Ended:</span>
                    <span className="text-sm">
                      {attempt.hasSubmitted ? formatDate(attempt.updatedAt) : "Not completed"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Status:</span>
                    <span>
                      {attempt.isActive ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          Active
                        </Badge>
                      ) : attempt.hasSubmitted ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Abandoned
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Performance Summary</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Score:</span>
                    <span className="text-sm font-medium">{attempt.statistics.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Questions Answered:</span>
                    <span className="text-sm">
                      {attempt.statistics.answeredQuestions}/{attempt.statistics.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Correct Answers:</span>
                    <span className="text-sm">
                      {attempt.statistics.correctAnswers}/{attempt.statistics.totalQuestions}
                    </span>
                  </div>

                  {/* Subject scores */}
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Subject Performance</h4>
                    {Object.entries(attempt.statistics.subjectScores).map(([subject, score]) => (
                      <div key={subject} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium capitalize">{subject}</span>
                          <span className="text-xs">{score}%</span>
                        </div>
                        <Progress value={score} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Questions and Answers */}
            <div>
              <h3 className="text-lg font-medium mb-4">Questions and Answers</h3>

              <Tabs defaultValue="all" value={activeSubject} onValueChange={setActiveSubject}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {getSubjects().map((subject) => (
                    <TabsTrigger key={subject} value={subject} className="capitalize">
                      {subject}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <div className="space-y-6">
                  {getFilteredQuestions().map((question, index) => (
                    <div
                      key={question.id}
                      className={`p-4 border rounded-lg ${
                        question.selectedOption
                          ? question.isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Question {index + 1} ({question.subject})
                        </span>
                        <div>
                          {question.selectedOption ? (
                            question.isCorrect ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span className="text-xs">Correct</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                <span className="text-xs">Incorrect</span>
                              </div>
                            )
                          ) : (
                            <div className="flex items-center text-gray-500">
                              <HelpCircle className="h-4 w-4 mr-1" />
                              <span className="text-xs">Not Answered</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="mb-3">{question.text}</p>

                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 border rounded ${
                              option === question.selectedOption && option === question.correctOption
                                ? "bg-green-100 border-green-300"
                                : option === question.selectedOption
                                  ? "bg-red-100 border-red-300"
                                  : option === question.correctOption
                                    ? "bg-green-50 border-green-200"
                                    : "bg-white"
                            }`}
                          >
                            <div className="flex items-center">
                              <div className="flex-1">{option}</div>
                              <div className="flex items-center">
                                {option === question.selectedOption && option === question.correctOption && (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                )}
                                {option === question.selectedOption && option !== question.correctOption && (
                                  <XCircle className="h-4 w-4 text-red-600" />
                                )}
                                {option !== question.selectedOption && option === question.correctOption && (
                                  <CheckCircle className="h-4 w-4 text-green-600 opacity-50" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">Attempt not found</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
