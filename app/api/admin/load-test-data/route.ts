import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import { loadTestData } from "@/lib/test-data"

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

    await connectToDatabase()

    const result = await loadTestData()

    return NextResponse.json(
      {
        message: "Test data loaded successfully",
        counts: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error loading test data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
