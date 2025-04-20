import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    const { examAllowed } = await request.json()

    await connectToDatabase()

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(userId, { examAllowed }, { new: true, runValidators: true })

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        examAllowed: updatedUser.examAllowed,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
