"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import SimpleWebcam from "@/components/simple-webcam" // Add this new import

type Question = {
  id: string
  text: string
  options: string[]
  subject: "math" | "science" | "chemistry" | "english"
}

type ExamState = {
  currentQuestionIndex: number
  answers: Record<string, string>
  timeRemaining: number
  currentSubject: "math" | "science" | "chemistry" | "english"
  subjectProgress: Record<string, number>
}

export default function ExamPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 90 * 60, // 90 minutes in seconds
    currentSubject: "math",
    subjectProgress: {
      math: 0,
      science: 0,
      chemistry: 0,
      english: 0,
    },
  })

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    // Fetch questions
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/api/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch questions")
        }

        const data = await response.json()
        setQuestions(data.questions)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam questions. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()

    // Set up timer
    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  // For demo purposes, let's create some sample questions
  useEffect(() => {
    if (questions.length === 0 && !loading) {
      const sampleQuestions: Question[] = [
        // Math questions
        ...Array(20)
          .fill(null)
          .map((_, i) => ({
            id: `math-${i}`,
            text: `Math Question ${i + 1}: What is the value of x in the equation 2x + 5 = ${2 * i + 5}?`,
            options: [`${i}`, `${i + 1}`, `${i - 1}`, `${i + 2}`],
            subject: "math" as const,
          })),
        // Science questions
        ...Array(20)
          .fill(null)
          .map((_, i) => ({
            id: `science-${i}`,
            text: `Science Question ${i + 1}: What is the chemical symbol for ${["Oxygen", "Hydrogen", "Carbon", "Nitrogen"][i % 4]}?`,
            options: ["O", "H", "C", "N"],
            subject: "science" as const,
          })),
        // Chemistry questions
        ...Array(20)
          .fill(null)
          .map((_, i) => ({
            id: `chemistry-${i}`,
            text: `Chemistry Question ${i + 1}: What is the atomic number of ${["Hydrogen", "Helium", "Lithium", "Beryllium"][i % 4]}?`,
            options: ["1", "2", "3", "4"],
            subject: "chemistry" as const,
          })),
        // English questions
        ...Array(20)
          .fill(null)
          .map((_, i) => ({
            id: `english-${i}`,
            text: `English Question ${i + 1}: What is the past tense of ${["run", "swim", "write", "speak"][i % 4]}?`,
            options: ["ran", "swam", "wrote", "spoke"],
            subject: "english" as const,
          })),
      ]

      // Shuffle the questions
      const shuffled = [...sampleQuestions].sort(() => Math.random() - 0.5)
      setQuestions(shuffled)
    }
  }, [loading, questions])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[examState.currentQuestionIndex]

    setExamState((prev) => {
      const newAnswers = { ...prev.answers, [currentQuestion.id]: answer }

      // Update subject progress
      const subjectQuestions = questions.filter((q) => q.subject === currentQuestion.subject)
      const answeredInSubject = subjectQuestions.filter((q) => newAnswers[q.id]).length
      const subjectProgress = {
        ...prev.subjectProgress,
        [currentQuestion.subject]: Math.floor((answeredInSubject / 20) * 100),
      }

      return {
        ...prev,
        answers: newAnswers,
        subjectProgress,
      }
    })
  }

  const handleNextQuestion = () => {
    if (examState.currentQuestionIndex < questions.length - 1) {
      setExamState((prev) => {
        const nextIndex = prev.currentQuestionIndex + 1
        const nextQuestion = questions[nextIndex]
        return {
          ...prev,
          currentQuestionIndex: nextIndex,
          currentSubject: nextQuestion.subject,
        }
      })
    }
  }

  const handlePrevQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState((prev) => {
        const prevIndex = prev.currentQuestionIndex - 1
        const prevQuestion = questions[prevIndex]
        return {
          ...prev,
          currentQuestionIndex: prevIndex,
          currentSubject: prevQuestion.subject,
        }
      })
    }
  }

  const handleSubmitExam = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        router.push("/login")
        return
      }

      // Submit answers
      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          answers: examState.answers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit exam")
      }

      toast({
        title: "Exam submitted",
        description: "Your exam has been submitted successfully.",
      })

      router.push("/results")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading exam questions...</p>
      </div>
    )
  }

  const currentQuestion = questions[examState.currentQuestionIndex]
  const totalAnswered = Object.keys(examState.answers).length
  const overallProgress = Math.floor((totalAnswered / questions.length) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Exam in Progress</h1>
        <div className="text-lg font-semibold">Time Remaining: {formatTime(examState.timeRemaining)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">Math</p>
          <Progress value={examState.subjectProgress.math} className="h-2" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Science</p>
          <Progress value={examState.subjectProgress.science} className="h-2" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Chemistry</p>
          <Progress value={examState.subjectProgress.chemistry} className="h-2" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">English</p>
          <Progress value={examState.subjectProgress.english} className="h-2" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between">
          <p className="text-sm font-medium">Overall Progress</p>
          <p className="text-sm font-medium">
            {totalAnswered}/{questions.length} Questions
          </p>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main exam content - takes up 3/4 of the space on larger screens */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                <span className="capitalize">{currentQuestion.subject}</span> - Question{" "}
                {examState.currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{currentQuestion.text}</p>
              <RadioGroup
                value={examState.answers[currentQuestion.id] || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={examState.currentQuestionIndex === 0}>
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNextQuestion}
                disabled={examState.currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            </CardFooter>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleSubmitExam}>Submit Exam</Button>
          </div>
        </div>

        {/* Webcam proctor section - takes up 1/4 of the space on larger screens */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Exam Proctoring</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Use the simpler implementation that's more likely to work across browsers */}
                <SimpleWebcam />

                {/* Comment out the original implementation but leave it as a fallback */}
                {/* <WebcamProctor /> */}

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Proctoring Rules</h4>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                    <li>Keep your face visible in the camera</li>
                    <li>No other people should be visible</li>
                    <li>No talking or reading questions aloud</li>
                    <li>No additional devices or materials</li>
                    <li>Do not leave the exam screen</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
