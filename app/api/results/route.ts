import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { examResults } from "@/lib/mock-db"

export async function GET(request: Request) {
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

    return NextResponse.json({ results: examResults }, { status: 200 })
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
