import { NextResponse } from "next/server"
import { headers } from "next/headers"
import dbConnect from "@/lib/mongodb"
import { loadTestData, clearAllData } from "@/lib/test-data"
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

    const { clearExisting } = await request.json()

    if (clearExisting) {
      await clearAllData()
    }

    const result = await loadTestData()

    return NextResponse.json(
      {
        message: "Test data loaded successfully",
        result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error loading test data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
