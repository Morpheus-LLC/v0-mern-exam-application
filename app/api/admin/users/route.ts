import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"
import ExamResult from "@/models/ExamResult"

export async function GET(request: Request) {
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

    await connectToDatabase()

    // Get all users except admins
    const users = await User.find({ role: { $ne: "admin" } }, { password: 0 })

    // Get exam attempts for each user
    const usersWithExamInfo = await Promise.all(
      users.map(async (user) => {
        const examResults = await ExamResult.find({ userId: user._id })
        return {
          ...user.toObject(),
          examCount: examResults.length,
        }
      }),
    )

    return NextResponse.json({ users: usersWithExamInfo }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
