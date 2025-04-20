import { NextResponse } from "next/server"
import connectToDatabase from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    const userData = await request.json()

    // Validate input
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // In a real application, you would hash the password
    // Create new user
    const newUser = new User(userData)
    await newUser.save()

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
