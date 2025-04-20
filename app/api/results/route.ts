import { NextResponse } from "next/server"
import { getAuthToken } from "@/lib/api-helpers"
import connectToDatabase from "@/lib/mongodb"
import ExamResult from "@/models/ExamResult"

export async function GET(request: Request) {
  try {
    const token = getAuthToken()

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if admin (in a real app, you'd verify the JWT)
    const tokenParts = token.split("-")
    const role = tokenParts[4]

    if (role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const results = await ExamResult.find().sort({ date: -1 })

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
