import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import ExamResult from "@/models/ExamResult"

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    const userId = params.id
    const { canRetake } = await request.json()

    await connectToDatabase()

    // Find the user's exam result
    const examResult = await ExamResult.findOne({ userId })

    if (!examResult) {
      return NextResponse.json({ message: "User has not taken the exam yet" }, { status: 404 })
    }

    // Update the canRetake field
    examResult.canRetake = canRetake
    await examResult.save()

    return NextResponse.json({ message: "Exam retake permission updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error updating retake permission:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
