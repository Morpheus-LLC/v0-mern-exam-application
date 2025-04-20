// User types
export type User = {
  id: string
  name: string
  email: string
}

// Question types
export type Subject = "math" | "science" | "chemistry" | "english"

export type Question = {
  id: string
  text: string
  options: string[]
  subject: Subject
}

// Exam types
export type ExamResult = {
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: Record<Subject, number>
  date: string
}
