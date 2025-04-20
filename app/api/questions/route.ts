import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import Question from "@/models/Question"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    await dbConnect()

    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token
    try {
      jwt.verify(authorization.split(" ")[1], JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // Get subject filter from URL if present
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get("subject")

    let query = {}
    if (subject) {
      query = { subject }
    }

    // Get questions
    const questions = await Question.find(query)

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
    await dbConnect()

    const headersList = headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Verify token and check if admin
    try {
      const decoded = jwt.verify(authorization.split(" ")[1], JWT_SECRET) as { role: string }
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const newQuestion = await request.json()

    // Validate question
    if (!newQuestion.text || !newQuestion.options || !newQuestion.subject || !newQuestion.correctOption) {
      return NextResponse.json({ message: "Invalid question format" }, { status: 400 })
    }

    // Add question to database
    const question = await Question.create({
      text: newQuestion.text,
      options: newQuestion.options,
      correctOption: newQuestion.correctOption,
      subject: newQuestion.subject,
      difficulty: newQuestion.difficulty || "medium",
    })

    return NextResponse.json({ message: "Question added successfully", question }, { status: 201 })
  } catch (error) {
    console.error("Error adding question:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
