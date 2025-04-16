// Mock database for demonstration purposes
// In a real application, you would use MongoDB or another database

// Users collection
export const users: {
  id: string
  name: string
  email: string
  password: string
  role?: string
  collegeName?: string
  rollNumber?: string
  phoneNumber?: string
}[] = []

// Add a demo user for testing
users.push({
  id: "demo1",
  name: "Demo User",
  email: "demo@example.com",
  password: "password123",
  role: "user",
})

// Add admin user
users.push({
  id: "admin1",
  name: "Administrator",
  email: "admin",
  password: "admin@321",
  role: "admin",
})

// Questions collection
export const questions: {
  id: string
  text: string
  options: string[]
  correctOption: string
  subject: "math" | "science" | "chemistry" | "english"
}[] = [
  // Math questions
  ...Array(20)
    .fill(null)
    .map((_, i) => ({
      id: `math-${i}`,
      text: `Math Question ${i + 1}: What is the value of x in the equation 2x + 5 = ${2 * i + 5}?`,
      options: [`${i}`, `${i + 1}`, `${i - 1}`, `${i + 2}`],
      correctOption: `${i}`,
      subject: "math" as const,
    })),
  // Science questions
  ...Array(20)
    .fill(null)
    .map((_, i) => ({
      id: `science-${i}`,
      text: `Science Question ${i + 1}: What is the chemical symbol for ${["Oxygen", "Hydrogen", "Carbon", "Nitrogen"][i % 4]}?`,
      options: ["O", "H", "C", "N"],
      correctOption: ["O", "H", "C", "N"][i % 4],
      subject: "science" as const,
    })),
  // Chemistry questions
  ...Array(20)
    .fill(null)
    .map((_, i) => ({
      id: `chemistry-${i}`,
      text: `Chemistry Question ${i + 1}: What is the atomic number of ${["Hydrogen", "Helium", "Lithium", "Beryllium"][i % 4]}?`,
      options: ["1", "2", "3", "4"],
      correctOption: ["1", "2", "3", "4"][i % 4],
      subject: "chemistry" as const,
    })),
  // English questions
  ...Array(20)
    .fill(null)
    .map((_, i) => ({
      id: `english-${i}`,
      text: `English Question ${i + 1}: What is the past tense of ${["run", "swim", "write", "speak"][i % 4]}?`,
      options: ["ran", "swam", "wrote", "spoke"],
      correctOption: ["ran", "swam", "wrote", "spoke"][i % 4],
      subject: "english" as const,
    })),
]

// Exam results collection
export const examResults: {
  id: string
  userId: string
  userName: string
  userEmail: string
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: Record<string, number>
  date: string
}[] = [
  // Sample results
  {
    id: "result1",
    userId: "demo1",
    userName: "Demo User",
    userEmail: "demo@example.com",
    totalQuestions: 80,
    correctAnswers: 62,
    score: 77.5,
    subjectScores: {
      math: 85,
      science: 75,
      chemistry: 70,
      english: 80,
    },
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "result2",
    userId: "user2",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    totalQuestions: 80,
    correctAnswers: 70,
    score: 87.5,
    subjectScores: {
      math: 90,
      science: 85,
      chemistry: 80,
      english: 95,
    },
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
]
