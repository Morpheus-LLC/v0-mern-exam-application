import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamResult from "@/models/ExamResult"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = await headers()
    const authorization = headersList.get("authorization")

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if admin
    const tokenParts = authorization.split(" ")[1].split("-")
    const role = tokenParts[4]

    if (role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const userId = params.id

    await connectToDatabase()

    // Find user by ID
    const user = await User.findById(userId, { password: 0 })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Get exam attempts
    const examResults = await ExamResult.find({ userId: user._id })

    // Add exam attempts to user object
    const userWithExamInfo = {
      ...user.toObject(),
      examAttempts: examResults.length,
    }

    return NextResponse.json({ user: userWithExamInfo }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
