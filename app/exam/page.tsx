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
  id: string
  text: string
  options: string[]
  subject: "math" | "physics" | "chemistry"
  selectedOption?: string
}

type ExamState = {
  currentQuestionIndex: number
  timeRemaining: number
  currentSubject: "math" | "physics" | "chemistry"
  subjectProgress: Record<string, number>
  attemptId: string | null
}

export default function ExamPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [canTakeExam, setCanTakeExam] = useState(true)
  const [alreadyAttempted, setAlreadyAttempted] = useState(false)
  const [tabSwitched, setTabSwitched] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [audioStatus, setAudioStatus] = useState<"initializing" | "ready" | "error" | "playing">("initializing")
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  const [savingAnswer, setSavingAnswer] = useState(false)

  // TTS references
  const speechSynthRef = useRef<SpeechSynthesis | null>(null)
  const warningIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isSpeakingRef = useRef<boolean>(false)
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    timeRemaining: 60 * 60, // 60 minutes in seconds
    currentSubject: "math",
    subjectProgress: {
      math: 0,
      physics: 0,
      chemistry: 0,
    },
    attemptId: null,
  })

  // Add debug log function
  const addDebugLog = (message: string) => {
    console.log(message)
    setDebugInfo((prev) => [message, ...prev.slice(0, 9)]) // Keep last 10 messages
  }

  // Initialize Text-to-Speech
  useEffect(() => {
    // Check if browser supports speech synthesis
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthRef.current = window.speechSynthesis
      addDebugLog("Speech synthesis is supported")
      setAudioStatus("ready")

      // Initialize with a silent utterance to unlock audio on some browsers
      try {
        const silentUtterance = new SpeechSynthesisUtterance(" ")
        silentUtterance.volume = 0
        speechSynthRef.current.speak(silentUtterance)
        addDebugLog("Silent utterance initialized")
      } catch (error) {
        addDebugLog(`Error initializing silent utterance: ${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      addDebugLog("Speech synthesis is not supported in this browser")
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

      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  // Function to play warning using TTS
  const playWarningSound = () => {
    addDebugLog("Attempting to play warning using TTS")

    if (!speechSynthRef.current) {
      addDebugLog("Speech synthesis not available")
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
          addDebugLog(`Using voice: ${femaleVoice.name}`)
        } else {
          // Just use the first available voice
          utterance.voice = voices[0]
          addDebugLog(`Using default voice: ${voices[0].name}`)
        }
      }

      // Add event handlers
      utterance.onstart = () => {
        addDebugLog("TTS warning started")
        setAudioStatus("playing")
        isSpeakingRef.current = true
      }

      utterance.onend = () => {
        addDebugLog("TTS warning ended")
        setAudioStatus("ready")
        isSpeakingRef.current = false
      }

      utterance.onerror = (event) => {
        addDebugLog(`TTS error: ${event.error}`)
        setAudioStatus("error")
        isSpeakingRef.current = false
      }

      // Speak the warning
      speechSynthRef.current.speak(utterance)
      return true
    } catch (error) {
      addDebugLog(`Error playing TTS warning: ${error instanceof Error ? error.message : String(error)}`)
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
        addDebugLog("Tab switched - trying to play warning")

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
        addDebugLog("User returned to tab")

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

  // Check for existing attempt or create a new one
  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login")
      return
    }

    // Check if user can take the exam
    const checkExamEligibility = async () => {
      try {
        const response = await fetch("/api/exam/eligibility", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          const data = await response.json()
          setCanTakeExam(false)
          setAlreadyAttempted(data.message === "You have already taken this exam")
          setLoading(false)
          return
        }

        const data = await response.json()

        if (data.hasActiveAttempt) {
          // User has an active attempt, load it
          loadExistingAttempt(data.attemptId)
        } else {
          // Create a new attempt
          createNewAttempt()
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to check exam eligibility. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    // Load existing attempt
    const loadExistingAttempt = async (attemptId: string) => {
      try {
        const response = await fetch("/api/exam/attempt", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 410) {
            // Attempt has expired
            toast({
              title: "Exam Expired",
              description: "Your exam time has expired.",
              variant: "destructive",
            })
            router.push("/dashboard")
            return
          }
          throw new Error("Failed to load exam attempt")
        }

        const data = await response.json()

        // Set questions and exam state
        setQuestions(data.questions)
        setExamState({
          currentQuestionIndex: 0,
          timeRemaining: data.timeRemaining,
          currentSubject: data.questions[0]?.subject || "math",
          subjectProgress: calculateSubjectProgress(data.questions),
          attemptId: data.attemptId,
        })

        // Start the timer
        startTimer(data.timeRemaining)

        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam attempt. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    // Create a new attempt
    const createNewAttempt = async () => {
      try {
        const response = await fetch("/api/exam/attempt", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to create exam attempt")
        }

        const data = await response.json()

        // Set questions and exam state
        setQuestions(data.questions)
        setExamState({
          currentQuestionIndex: 0,
          timeRemaining: data.timeRemaining,
          currentSubject: data.questions[0]?.subject || "math",
          subjectProgress: calculateSubjectProgress(data.questions),
          attemptId: data.attemptId,
        })

        // Start the timer
        startTimer(data.timeRemaining)

        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create exam attempt. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    checkExamEligibility()
  }, [router])

  // Calculate subject progress
  const calculateSubjectProgress = (questions: Question[]) => {
    const subjectProgress: Record<string, number> = {
      math: 0,
      physics: 0,
      chemistry: 0,
    }

    const subjectQuestions: Record<string, number> = {
      math: 0,
      physics: 0,
      chemistry: 0,
    }

    const subjectAnswered: Record<string, number> = {
      math: 0,
      physics: 0,
      chemistry: 0,
    }

    questions.forEach((question) => {
      if (question.subject) {
        subjectQuestions[question.subject]++
        if (question.selectedOption) {
          subjectAnswered[question.subject]++
        }
      }
    })

    Object.keys(subjectProgress).forEach((subject) => {
      if (subjectQuestions[subject] > 0) {
        subjectProgress[subject] = Math.floor((subjectAnswered[subject] / subjectQuestions[subject]) * 100)
      }
    })

    return subjectProgress
  }

  // Start the timer
  const startTimer = (initialTime: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
    }

    timerIntervalRef.current = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeRemaining <= 1) {
          // Time's up, submit the exam
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current)
          }
          handleSubmitExam()
          return prev
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 }
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = async (answer: string) => {
    if (!examState.attemptId) return

    const currentQuestion = questions[examState.currentQuestionIndex]

    // Update local state first for immediate feedback
    setQuestions((prev) => {
      const newQuestions = [...prev]
      newQuestions[examState.currentQuestionIndex] = {
        ...newQuestions[examState.currentQuestionIndex],
        selectedOption: answer,
      }
      return newQuestions
    })

    // Update subject progress
    setExamState((prev) => {
      const newSubjectProgress = calculateSubjectProgress([
        ...questions.slice(0, examState.currentQuestionIndex),
        { ...currentQuestion, selectedOption: answer },
        ...questions.slice(examState.currentQuestionIndex + 1),
      ])

      return {
        ...prev,
        subjectProgress: newSubjectProgress,
      }
    })

    // Save answer to server
    setSavingAnswer(true)
    try {
      const token = localStorage.getItem("token")

      const response = await fetch("/api/exam/attempt/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOption: answer,
          timeRemaining: examState.timeRemaining,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save answer")
      }
    } catch (error) {
      toast({
        title: "Warning",
        description: "Failed to save your answer. Please check your connection.",
        variant: "destructive",
      })
    } finally {
      setSavingAnswer(false)
    }
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

      // Submit exam
      const response = await fetch("/api/exam/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // No need to send answers, they're already saved
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading exam questions...</p>
      </div>
    )
  }

  if (!canTakeExam) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Exam Access Restricted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <AlertCircle className="w-16 h-16 text-red-500" />
            </div>
            <p className="text-center">
              {alreadyAttempted
                ? "You have already taken this exam. Each candidate is allowed only one attempt."
                : "You are not authorized to take this exam. Please contact the administrator for assistance."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">No Questions Available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              There are no questions available for this exam. Please try again later or contact the administrator.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[examState.currentQuestionIndex]
  const totalAnswered = questions.filter((q) => q.selectedOption).length
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
                value={currentQuestion.selectedOption || ""}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <RadioGroupItem value={option} id={`option-${index}`} disabled={savingAnswer} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {savingAnswer && (
                <div className="mt-2 text-xs text-gray-500 flex items-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2"></div>
                  Saving your answer...
                </div>
              )}
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
