"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/components/ui/use-toast"
import SimpleWebcam from "@/components/simple-webcam"
import { AlertCircle } from "lucide-react"

type Question = {
  _id: string
  text: string
  options: string[]
  subject: "math" | "physics" | "chemistry"
}

type ExamState = {
  currentQuestionIndex: number
  answers: Record<string, string>
  timeRemaining: number
  currentSubject: "math" | "physics" | "chemistry"
  subjectProgress: Record<string, number>
}

export default function ExamPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [tabSwitched, setTabSwitched] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [audioStatus, setAudioStatus] = useState<"initializing" | "ready" | "error" | "playing">("initializing")
  const [alreadyTakenExam, setAlreadyTakenExam] = useState(false)

  // TTS references
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const warningIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isSpeakingRef = useRef<boolean>(false)

  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 60 * 60, // 60 minutes in seconds
    currentSubject: "math",
    subjectProgress: {
      math: 0,
      physics: 0,
      chemistry: 0,
    },
  })

  // Initialize Text-to-Speech
  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis
      setAudioStatus("ready")

      // Initialize with a silent utterance to unlock audio on some browsers
      try {
        const silentUtterance = new SpeechSynthesisUtterance(" ")
        silentUtterance.volume = 0
        speechSynthRef.current.speak(silentUtterance)
      } catch (error) {
        console.error("Error initializing silent utterance:", error)
      }
    } else {
      console.error("Speech synthesis is not supported in this browser")
      setAudioStatus("error")
    }

    // Clean up on unmount
    return () => {
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current)
      }

      if (speechSynthRef.current) {
        speechSynthRef.current.cancel()
      }
    }
  }, [])

  // Function to play warning using TTS
  const playWarningSound = () => {
    if (!speechSynthRef.current) {
      setAudioStatus("error")
      return false
    }

    // Cancel any ongoing speech
    speechSynthRef.current.cancel()

    try {
      // Create utterance with warning message
      const utterance = new SpeechSynthesisUtterance(
        "Warning! Please return to the exam tab immediately. Leaving the exam tab is not allowed.",
      )

      // Configure utterance
      utterance.rate = 1.0 // Normal speed
      utterance.pitch = 1.0 // Normal pitch
      utterance.volume = 1.0 // Maximum volume

      // Use a different voice if available (usually female voices are more audible)
      const voices = speechSynthRef.current.getVoices()
      if (voices.length > 0) {
        // Try to find a female voice
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.includes("female") ||
            voice.name.includes("Female") ||
            voice.name.includes("woman") ||
            voice.name.includes("Woman"),
        )

        if (femaleVoice) {
          utterance.voice = femaleVoice
        } else {
          // Just use the first available voice
          utterance.voice = voices[0]
        }
      }

      // Add event handlers
      utterance.onstart = () => {
        setAudioStatus("playing")
        isSpeakingRef.current = true
      }

      utterance.onend = () => {
        setAudioStatus("ready")
        isSpeakingRef.current = false
      }

      utterance.onerror = () => {
        setAudioStatus("error")
        isSpeakingRef.current = false
      }

      // Speak the warning
      speechSynthRef.current.speak(utterance)
      return true
    } catch (error) {
      console.error("Error playing TTS warning:", error)
      setAudioStatus("error")
      return false
    }
  }

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User left the tab
        setTabSwitched(true)
        setTabSwitchCount((prev) => prev + 1)

        // Try to play warning
        playWarningSound()

        // Set up interval to play warning repeatedly until user returns
        warningIntervalRef.current = setInterval(() => {
          // Only play if not already speaking
          if (!isSpeakingRef.current) {
            playWarningSound()
          }
        }, 3000) // Play every 3 seconds
      } else if (document.visibilityState === "visible" && tabSwitched) {
        // User returned to the tab
        setTabSwitched(false)

        // Clear interval when user returns to tab
        if (warningIntervalRef.current) {
          clearInterval(warningIntervalRef.current)
          warningIntervalRef.current = null
        }

        // Stop any ongoing speech
        if (speechSynthRef.current) {
          speechSynthRef.current.cancel()
          isSpeakingRef.current = false
        }

        setAudioStatus("ready")

        // Show a toast notification when they return
        toast({
          title: "Warning",
          description: "Leaving the exam tab is not allowed. This incident has been recorded.",
          variant: "destructive",
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current)
      }
    }
  }, [tabSwitched])

  // Check if user has already taken the exam
  useEffect(() => {
    const checkExamStatus = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("/api/exam/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to check exam status")
        }

        const data = await response.json()
        if (data.hasTakenExam) {
          setAlreadyTakenExam(true)
        }
      } catch (error) {
        console.error("Error checking exam status:", error)
      }
    }

    checkExamStatus()
  }, [router])

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

        // Ensure we have exactly 60 questions (20 per subject)
        const mathQuestions = data.questions.filter((q) => q.subject === "math").slice(0, 20)
        const physicsQuestions = data.questions.filter((q) => q.subject === "physics").slice(0, 20)
        const chemistryQuestions = data.questions.filter((q) => q.subject === "chemistry").slice(0, 20)

        const balancedQuestions = [...mathQuestions, ...physicsQuestions, ...chemistryQuestions]

        // If we don't have enough questions, redirect to dashboard with an error
        if (balancedQuestions.length < 60) {
          toast({
            title: "Error",
            description: "Not enough questions available for the exam. Please contact an administrator.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setQuestions(balancedQuestions)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[examState.currentQuestionIndex]

    setExamState((prev) => {
      const newAnswers = { ...prev.answers, [currentQuestion._id]: answer }

      // Update subject progress
      const subjectQuestions = questions.filter((q) => q.subject === currentQuestion.subject)
      const answeredInSubject = subjectQuestions.filter((q) => newAnswers[q._id]).length
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

  if (alreadyTakenExam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Exam Already Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You have already taken this exam. Each user is allowed to take the exam only once.</p>
            <p className="mb-4">If you believe this is an error, please contact an administrator.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
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
  const totalQuestions = questions.length // Should be 60

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">EAMCET Exam in Progress</h1>
        <div className="text-lg font-semibold">Time Remaining: {formatTime(examState.timeRemaining)}</div>
      </div>

      {tabSwitchCount > 0 && (
        <div className="mb-6 bg-red-50 border border-red-300 rounded-md p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Tab switching detected</p>
          </div>
          <p className="text-red-700 text-sm mt-1">
            You have left the exam tab {tabSwitchCount} {tabSwitchCount === 1 ? "time" : "times"}. This activity is
            being monitored and may result in disqualification.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <p className="text-sm font-medium">Mathematics</p>
          <Progress value={examState.subjectProgress.math} className="h-2" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Physics</p>
          <Progress value={examState.subjectProgress.physics} className="h-2" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Chemistry</p>
          <Progress value={examState.subjectProgress.chemistry} className="h-2" />
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <div className="flex justify-between">
          <p className="text-sm font-medium">Overall Progress</p>
          <p className="text-sm font-medium">{totalAnswered}/60 Questions</p>
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
                {examState.currentQuestionIndex + 1} of {totalQuestions}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">{currentQuestion.text}</p>
              <RadioGroup
                value={examState.answers[currentQuestion._id] || ""}
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

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-yellow-800 mb-1">Proctoring Rules</h4>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4">
                    <li>Keep your face visible in the camera</li>
                    <li>No other people should be visible</li>
                    <li>No talking or reading questions aloud</li>
                    <li>No additional devices or materials</li>
                    <li>Do not leave the exam screen</li>
                    <li>Switching tabs will trigger a warning</li>
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
