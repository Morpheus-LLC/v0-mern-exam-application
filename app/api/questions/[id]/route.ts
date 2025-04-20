import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import Question from "@/models/Question"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    const questionId = params.id

    await connectToDatabase()

    const question = await Question.findById(questionId)

    if (!question) {
      return NextResponse.json({ message: "Question not found" }, { status: 404 })
    }

    // Delete question
    await Question.findByIdAndDelete(questionId)

    return NextResponse.json({ message: "Question deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting question:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
