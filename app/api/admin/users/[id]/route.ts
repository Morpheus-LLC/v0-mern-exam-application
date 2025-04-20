import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamResult from "@/models/ExamResult"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if user has taken the exam
    const examResult = await ExamResult.findOne({ userId })
    const hasTakenExam = !!examResult
    const canRetakeExam = examResult?.canRetake || false

    // Convert Mongoose document to plain object and add exam status
    const userObject = user.toObject()
    userObject.hasTakenExam = hasTakenExam
    userObject.canRetakeExam = canRetakeExam

    return NextResponse.json({ user: userObject }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user details:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
