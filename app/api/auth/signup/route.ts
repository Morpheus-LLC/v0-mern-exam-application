import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: Request) {
  try {
    await dbConnect()

    const {
      name,
      email,
      password,
      collegeName,
      rollNumber,
      phoneNumber,
      alternatePhoneNumber,
      intermediateHallTicket,
      eamcetHallTicket,
      gender,
      age,
      district,
      collegeAddress,
      homeAddress,
      rationCard,
      rationCardNumber,
    } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password, // Will be hashed by the pre-save hook
      collegeName,
      rollNumber,
      phoneNumber,
      alternatePhoneNumber,
      intermediateHallTicket,
      eamcetHallTicket,
      gender,
      age,
      district,
      collegeAddress,
      homeAddress,
      rationCard,
      rationCardNumber,
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
