import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { questions } from "@/lib/mock-db"

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
        id: `${subject}-csv-${Date.now()}-${i}`,
        text: questionText,
        options: options,
        correctOption: correctOption,
        subject: subject,
      }

      questions.push(question)
      newQuestions.push(question)
    }

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
