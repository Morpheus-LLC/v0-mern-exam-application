import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import Question from "@/models/Question"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

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

    const { csvData, subject } = await request.json()

    if (!csvData || !subject) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Process CSV data
    // Format: question, option1, option2, option3, option4, correctOption
    const lines = csvData.split("\n").filter(Boolean)
    const newQuestions = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const parts = line.split(",").map((part) => part.trim())

      if (parts.length < 6) {
        continue // Skip invalid lines
      }

      const [questionText, ...options] = parts
      const correctOption = options.pop() // Last item is the correct option

      const question = {
        text: questionText,
        options: options,
        correctOption: correctOption,
        subject: subject,
      }

      newQuestions.push(question)
    }

    // Insert questions in bulk
    await Question.insertMany(newQuestions)

    return NextResponse.json(
      {
        message: `${newQuestions.length} questions added successfully`,
        count: newQuestions.length,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error uploading questions:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
