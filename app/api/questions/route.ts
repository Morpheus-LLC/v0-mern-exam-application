import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { questions } from "@/lib/mock-db"

export async function GET(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get subject filter from URL if present
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")

    let filteredQuestions = [...questions]

    if (subject) {
      filteredQuestions = filteredQuestions.filter((q) => q.subject === subject)
    }

    // Shuffle the questions for exams
    const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5)

    return NextResponse.json({ questions: shuffled }, { status: 200 })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if admin (in a real app, you'd verify the JWT)
    const tokenParts = authorization.split(" ")[1].split("-")
    const role = tokenParts[4]

    if (role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const newQuestion = await request.json()

    // Validate question
    if (!newQuestion.text || !newQuestion.options || !newQuestion.subject || !newQuestion.correctOption) {
      return NextResponse.json({ message: "Invalid question format" }, { status: 400 })
    }

    // Add question to database
    const questionId = `${newQuestion.subject}-${Date.now()}`
    const question = {
      id: questionId,
      text: newQuestion.text,
      options: newQuestion.options,
      correctOption: newQuestion.correctOption,
      subject: newQuestion.subject,
    }

    questions.push(question)

    return NextResponse.json({ message: "Question added successfully", question }, { status: 201 })
  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
