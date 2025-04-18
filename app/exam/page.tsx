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

type Question = {
  id: string
  text: string
  options: string[]
  subject: "math" | "physics" | "chemistry" // Updated subjects to match EAMCET
}

type ExamState = {
  currentQuestionIndex: number
  answers: Record<string, string>
  timeRemaining: number
  currentSubject: "math" | "physics" | "chemistry" // Updated subjects
  subjectProgress: Record<string, number>
}

export default function ExamPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [examState, setExamState] = useState<ExamState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 90 * 60, // 90 minutes in seconds
    currentSubject: "math",
    subjectProgress: {
      math: 0,
      physics: 0,
      chemistry: 0,
    },
  })

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio("/audio/warning.mp3")
  }, [])

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
        })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

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

  // For demo purposes, let's create EAMCET-based sample questions
  useEffect(() => {
    if (questions.length === 0 && !loading) {
      const eamcetQuestions: Question[] = [
        // Mathematics questions (20)
        {
          id: "math-1",
          text: "If the sum of the roots of the quadratic equation ax² + bx + c = 0 is equal to the product of the roots, then:",
          options: ["a + c = b", "a = c", "b = 2√(ac)", "a - c = b"],
          subject: "math",
        },
        {
          id: "math-2",
          text: "The value of lim(x→0) (sin x)/x is:",
          options: ["0", "1", "∞", "Does not exist"],
          subject: "math",
        },
        {
          id: "math-3",
          text: "If f(x) = x³ - 3x² + 4x - 2, then f'(2) equals:",
          options: ["4", "6", "8", "10"],
          subject: "math",
        },
        {
          id: "math-4",
          text: "The area bounded by the curve y = x² and the lines y = 1, y = 4, and x = 0 is:",
          options: ["5/3", "7/3", "8/3", "9/3"],
          subject: "math",
        },
        {
          id: "math-5",
          text: "If the vectors a = 2i + 3j and b = i - j are perpendicular to vector c = xi + yj, then:",
          options: ["2x - 3y = 0", "2x + 3y = 0", "3x - 2y = 0", "3x + 2y = 0"],
          subject: "math",
        },
        {
          id: "math-6",
          text: "The solution of the differential equation dy/dx = e^(x+y) is:",
          options: ["e^y = e^x + C", "e^y = -e^x + C", "e^y = e^(-x) + C", "e^y = -e^(-x) + C"],
          subject: "math",
        },
        {
          id: "math-7",
          text: "The value of ∫(0 to π/2) sin²x dx is:",
          options: ["π/4", "π/2", "π/3", "π"],
          subject: "math",
        },
        {
          id: "math-8",
          text: "If A and B are two events such that P(A) = 0.3, P(B) = 0.4 and P(A∩B) = 0.2, then P(A|B) is:",
          options: ["0.5", "0.3", "0.4", "0.7"],
          subject: "math",
        },
        {
          id: "math-9",
          text: "The equation of the tangent to the curve y = x² + 2x at the point (1, 3) is:",
          options: ["y = 4x - 1", "y = 4x - 4", "y = 4x", "y = 4x + 3"],
          subject: "math",
        },
        {
          id: "math-10",
          text: "The distance between the lines 3x - 4y + 7 = 0 and 6x - 8y - 5 = 0 is:",
          options: ["1", "2", "3", "4"],
          subject: "math",
        },
        {
          id: "math-11",
          text: "If z = x + iy is a complex number such that |z| = 1 and arg(z) = π/3, then z equals:",
          options: ["1/2 + i√3/2", "√3/2 + i/2", "-1/2 + i√3/2", "-√3/2 + i/2"],
          subject: "math",
        },
        {
          id: "math-12",
          text: "The rank of the matrix [[1, 2, 3], [2, 4, 6], [3, 6, 9]] is:",
          options: ["1", "2", "3", "0"],
          subject: "math",
        },
        {
          id: "math-13",
          text: "The general solution of the differential equation d²y/dx² + 4y = 0 is:",
          options: ["y = A cos 2x + B sin 2x", "y = Ae^(2x) + Be^(-2x)", "y = A cos 2x", "y = B sin 2x"],
          subject: "math",
        },
        {
          id: "math-14",
          text: "If f(x) = x³ - 6x² + 12x - 8, then the value of x for which f(x) = 0 is:",
          options: ["1", "2", "3", "4"],
          subject: "math",
        },
        {
          id: "math-15",
          text: "The value of ∫(1 to 2) (x² + 1)/(x³ + 3x) dx is:",
          options: ["ln(7/4)", "ln(4/7)", "ln(7)", "ln(4)"],
          subject: "math",
        },
        {
          id: "math-16",
          text: "If the lines 2x + 3y = 5 and 3x + ky = 8 are perpendicular, then the value of k is:",
          options: ["-2", "2", "-3/2", "3/2"],
          subject: "math",
        },
        {
          id: "math-17",
          text: "The probability that a leap year has 53 Sundays is:",
          options: ["1/7", "2/7", "3/7", "4/7"],
          subject: "math",
        },
        {
          id: "math-18",
          text: "The locus of the point of intersection of perpendicular tangents to the parabola y² = 4ax is:",
          options: ["x = -a", "x = a", "y = a", "y = -a"],
          subject: "math",
        },
        {
          id: "math-19",
          text: "If A is a square matrix such that A² = A, then (I - A)² equals:",
          options: ["I - A", "I + A", "I - 2A", "I"],
          subject: "math",
        },
        {
          id: "math-20",
          text: "The value of the determinant |2 3 1; 4 1 3; 2 5 2| is:",
          options: ["-13", "13", "0", "1"],
          subject: "math",
        },

        // Physics questions (20)
        {
          id: "physics-1",
          text: "A body is thrown vertically upward with a velocity of 19.6 m/s. The maximum height reached by the body is (g = 9.8 m/s²):",
          options: ["19.6 m", "9.8 m", "39.2 m", "20 m"],
          subject: "physics",
        },
        {
          id: "physics-2",
          text: "The dimensional formula for the coefficient of viscosity is:",
          options: ["[ML⁻¹T⁻¹]", "[MLT⁻¹]", "[ML⁻¹T⁻²]", "[ML²T⁻²]"],
          subject: "physics",
        },
        {
          id: "physics-3",
          text: "The work done in moving a charge of 2 coulombs from a point at 10V to another point at 30V is:",
          options: ["40 J", "20 J", "60 J", "-40 J"],
          subject: "physics",
        },
        {
          id: "physics-4",
          text: "A body of mass 2 kg is rotating in a circle of radius 2 m with an angular velocity of 3 rad/s. The centripetal force acting on it is:",
          options: ["36 N", "12 N", "24 N", "18 N"],
          subject: "physics",
        },
        {
          id: "physics-5",
          text: "The energy equivalent of 1 gram of matter is:",
          options: ["9 × 10¹³ J", "9 × 10¹⁶ J", "9 × 10¹⁰ J", "9 × 10¹⁹ J"],
          subject: "physics",
        },
        {
          id: "physics-6",
          text: "The focal length of a convex lens is 20 cm. The power of the lens is:",
          options: ["5 D", "0.05 D", "0.5 D", "50 D"],
          subject: "physics",
        },
        {
          id: "physics-7",
          text: "The wavelength of the first line of Balmer series in hydrogen spectrum is 656.3 nm. The wavelength of the second line of the series is approximately:",
          options: ["486.1 nm", "410.2 nm", "434.1 nm", "364.6 nm"],
          subject: "physics",
        },
        {
          id: "physics-8",
          text: "The resistance of a wire is R. If its length and radius are both doubled, the new resistance will be:",
          options: ["R/2", "R", "2R", "4R"],
          subject: "physics",
        },
        {
          id: "physics-9",
          text: "A particle is moving with a velocity v = 3i + 4j + 5k. The magnitude of the velocity is:",
          options: ["√50", "12", "5", "√34"],
          subject: "physics",
        },
        {
          id: "physics-10",
          text: "The moment of inertia of a uniform circular disc about an axis passing through its center and perpendicular to its plane is:",
          options: ["MR²/2", "MR²", "2MR²", "MR²/4"],
          subject: "physics",
        },
        {
          id: "physics-11",
          text: "The electric field inside a charged conducting sphere is:",
          options: ["Zero", "Directly proportional to radius", "Inversely proportional to radius", "Constant"],
          subject: "physics",
        },
        {
          id: "physics-12",
          text: "The magnetic field at the center of a circular coil of radius R carrying current I is:",
          options: ["μ₀I/2R", "μ₀I/R", "μ₀I/2πR", "μ₀I/4πR"],
          subject: "physics",
        },
        {
          id: "physics-13",
          text: "In a Young's double-slit experiment, the fringe width is β. If the entire apparatus is immersed in water (refractive index 4/3), the new fringe width will be:",
          options: ["3β/4", "4β/3", "β", "β/2"],
          subject: "physics",
        },
        {
          id: "physics-14",
          text: "The half-life of a radioactive element is 30 days. The fraction of the initial amount that remains after 90 days is:",
          options: ["1/8", "1/4", "1/2", "3/8"],
          subject: "physics",
        },
        {
          id: "physics-15",
          text: "The energy of a photon of wavelength 6000 Å is approximately:",
          options: ["2.07 eV", "3.1 eV", "1.5 eV", "0.5 eV"],
          subject: "physics",
        },
        {
          id: "physics-16",
          text: "The de Broglie wavelength of an electron accelerated through a potential difference of 100 V is approximately:",
          options: ["1.23 Å", "0.123 nm", "12.3 pm", "0.0123 nm"],
          subject: "physics",
        },
        {
          id: "physics-17",
          text: "A body is projected with a velocity of 20 m/s at an angle of 30° with the horizontal. The maximum height reached by the body is (g = 10 m/s²):",
          options: ["5 m", "10 m", "15 m", "20 m"],
          subject: "physics",
        },
        {
          id: "physics-18",
          text: "The efficiency of a Carnot engine working between 127°C and 27°C is:",
          options: ["25%", "50%", "75%", "100%"],
          subject: "physics",
        },
        {
          id: "physics-19",
          text: "The ratio of the specific heat capacities (γ = Cp/Cv) for a monoatomic gas is:",
          options: ["5/3", "7/5", "4/3", "3/2"],
          subject: "physics",
        },
        {
          id: "physics-20",
          text: "The electric potential at a distance r from a point charge q is V. The electric field at the same point is:",
          options: ["-dV/dr", "dV/dr", "-V/r", "V/r"],
          subject: "physics",
        },

        // Chemistry questions (20)
        {
          id: "chemistry-1",
          text: "The IUPAC name of the compound CH₃-CH=CH-CHO is:",
          options: ["But-2-enal", "But-3-enal", "But-2-en-1-al", "But-3-en-1-al"],
          subject: "chemistry",
        },
        {
          id: "chemistry-2",
          text: "The hybridization of carbon in diamond is:",
          options: ["sp³", "sp²", "sp", "dsp²"],
          subject: "chemistry",
        },
        {
          id: "chemistry-3",
          text: "The pH of a 0.001 M HCl solution is:",
          options: ["3", "2", "1", "4"],
          subject: "chemistry",
        },
        {
          id: "chemistry-4",
          text: "Which of the following is not a colligative property?",
          options: ["Viscosity", "Osmotic pressure", "Depression in freezing point", "Elevation in boiling point"],
          subject: "chemistry",
        },
        {
          id: "chemistry-5",
          text: "The oxidation state of chromium in K₂Cr₂O₇ is:",
          options: ["+6", "+3", "+2", "+4"],
          subject: "chemistry",
        },
        {
          id: "chemistry-6",
          text: "The electronic configuration of Cu²⁺ is:",
          options: ["[Ar] 3d⁹", "[Ar] 3d¹⁰", "[Ar] 3d⁸ 4s¹", "[Ar] 3d⁷ 4s²"],
          subject: "chemistry",
        },
        {
          id: "chemistry-7",
          text: "Which of the following is not an aromatic compound?",
          options: ["Cyclohexane", "Benzene", "Naphthalene", "Pyridine"],
          subject: "chemistry",
        },
        {
          id: "chemistry-8",
          text: "The number of isomers possible for C₄H₉Cl is:",
          options: ["4", "5", "6", "7"],
          subject: "chemistry",
        },
        {
          id: "chemistry-9",
          text: "The reaction of phenol with bromine water gives:",
          options: ["2,4,6-tribromophenol", "o-bromophenol", "p-bromophenol", "m-bromophenol"],
          subject: "chemistry",
        },
        {
          id: "chemistry-10",
          text: "The most electronegative element among the following is:",
          options: ["F", "Cl", "O", "N"],
          subject: "chemistry",
        },
        {
          id: "chemistry-11",
          text: "Which of the following is a strong electrolyte?",
          options: ["NaCl", "CH₃COOH", "NH₄OH", "C₆H₁₂O₆"],
          subject: "chemistry",
        },
        {
          id: "chemistry-12",
          text: "The compound that does not undergo nucleophilic substitution reaction is:",
          options: ["Chlorobenzene", "Ethyl chloride", "Isopropyl chloride", "Methyl chloride"],
          subject: "chemistry",
        },
        {
          id: "chemistry-13",
          text: "The geometry of PCl₅ molecule is:",
          options: ["Trigonal bipyramidal", "Tetrahedral", "Octahedral", "Square pyramidal"],
          subject: "chemistry",
        },
        {
          id: "chemistry-14",
          text: "The number of d-electrons in Fe²⁺ (Atomic number of Fe = 26) is:",
          options: ["6", "4", "3", "8"],
          subject: "chemistry",
        },
        {
          id: "chemistry-15",
          text: "Which of the following is not a Lewis acid?",
          options: ["NH₃", "BF₃", "AlCl₃", "FeCl₃"],
          subject: "chemistry",
        },
        {
          id: "chemistry-16",
          text: "The correct order of increasing acidic strength is:",
          options: [
            "Phenol < Ethanol < Chloroacetic acid < Acetic acid",
            "Ethanol < Phenol < Acetic acid < Chloroacetic acid",
            "Ethanol < Acetic acid < Phenol < Chloroacetic acid",
            "Acetic acid < Chloroacetic acid < Phenol < Ethanol",
          ],
          subject: "chemistry",
        },
        {
          id: "chemistry-17",
          text: "The compound that gives a positive Fehling's test is:",
          options: ["Acetaldehyde", "Acetone", "Benzaldehyde", "Benzoic acid"],
          subject: "chemistry",
        },
        {
          id: "chemistry-18",
          text: "The IUPAC name of the compound CH₃-CH(OH)-COOH is:",
          options: [
            "2-hydroxypropanoic acid",
            "2-hydroxyethanoic acid",
            "3-hydroxypropanoic acid",
            "3-hydroxybutanoic acid",
          ],
          subject: "chemistry",
        },
        {
          id: "chemistry-19",
          text: "The major product formed when propene reacts with HBr in the presence of peroxide is:",
          options: ["1-bromopropane", "2-bromopropane", "1,2-dibromopropane", "propyl bromide"],
          subject: "chemistry",
        },
        {
          id: "chemistry-20",
          text: "The bond angle in NH₃ is approximately:",
          options: ["107°", "109.5°", "120°", "180°"],
          subject: "chemistry",
        },
      ]

      // Shuffle the questions
      const shuffled = [...eamcetQuestions].sort(() => Math.random() - 0.5)
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
        <h1 className="text-2xl font-bold">EAMCET Exam in Progress</h1>
        <div className="text-lg font-semibold">Time Remaining: {formatTime(examState.timeRemaining)}</div>
      </div>

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

      {/* Hidden audio element for tab switching warning */}
      <audio ref={audioRef} src="/audio/warning.mp3" preload="auto" />
    </div>
  )
}
