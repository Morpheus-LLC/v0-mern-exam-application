import { NextResponse } from "next/server"
import { users } from "@/lib/mock-db"

export async function POST(request: Request) {
  try {
    const { name, email, password, collegeName, rollNumber, phoneNumber } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // In a real application, you would hash the password
    // For demo purposes, we'll store it as plain text
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      collegeName,
      rollNumber,
      phoneNumber,
    }

    users.push(newUser)

    console.log("User created:", newUser)
    console.log("Total users:", users.length)

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
