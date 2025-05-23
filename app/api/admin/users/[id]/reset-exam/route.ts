import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamAttempt from "@/models/ExamAttempt"
import ExamResult from "@/models/ExamResult"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers()
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

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        examAttempts: 0,
        examAllowed: true,
      },
      { new: true, runValidators: true },
    )

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Mark all active attempts as inactive
    await ExamAttempt.updateMany({ userId }, { isActive: false })

    // Delete all attempts for this user (optional, but more thorough)
    await ExamAttempt.deleteMany({ userId })

    // Delete all exam results for this user
    await ExamResult.deleteMany({ userId })

    return NextResponse.json(
      {
        message: "User exam attempts reset successfully",
        examAttempts: updatedUser.examAttempts,
        examAllowed: updatedUser.examAllowed,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error resetting user exam attempts:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
