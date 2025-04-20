import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Question from "@/models/Question"
import { loadTestData } from "@/lib/test-data"

export async function GET(request: Request) {
  try {
    const headersList = await headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Get subject filter from URL if present
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")

    await connectToDatabase()

    // Query questions with optional subject filter
    let query = {}
    if (subject) {
      query = { subject }
    }

    const questions = await Question.find(query)

    // Check if questions collection is empty, load test data if it is
    if (questions.length === 0) {
      console.log("No questions found, loading test data...")
      await loadTestData()
      const newQuestions = await Question.find(query)

      // Shuffle the questions for exams
      const shuffled = [...newQuestions].sort(() => Math.random() - 0.5)
      return NextResponse.json({ questions: shuffled }, { status: 200 })
    }

    // Shuffle the questions for exams
    const shuffled = [...questions].sort(() => Math.random() - 0.5)

    return NextResponse.json({ questions: shuffled }, { status: 200 })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers()
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

    const newQuestionData = await request.json()

    // Validate question
    if (
      !newQuestionData.text ||
      !newQuestionData.options ||
      !newQuestionData.subject ||
      !newQuestionData.correctOption
    ) {
      return NextResponse.json({ message: "Invalid question format" }, { status: 400 })
    }

    await connectToDatabase()

    // Create new question
    const newQuestion = new Question(newQuestionData)
    await newQuestion.save()

    return NextResponse.json({ message: "Question added successfully", question: newQuestion }, { status: 201 })
  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
