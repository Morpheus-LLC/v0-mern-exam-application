import { questions as mockQuestions, users as mockUsers, examResults as mockResults } from "./mock-db"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamResult from "@/models/ExamResult"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"

export async function loadTestData() {
  try {
    // Load users
    const users = await Promise.all(
      mockUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(user.password, salt)

        return {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role || "user",
          collegeName: user.collegeName || "",
          rollNumber: user.rollNumber || "",
          phoneNumber: user.phoneNumber || "",
        }
      }),
    )

    const createdUsers = await User.insertMany(users)

    // Map old IDs to new MongoDB IDs
    const userIdMap = new Map()
    createdUsers.forEach((user, index) => {
      userIdMap.set(mockUsers[index].id, user._id)
    })

    // Load questions
    const questions = mockQuestions.map((q) => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
      subject: q.subject,
    }))

    const createdQuestions = await Question.insertMany(questions)

    // Map old IDs to new MongoDB IDs
    const questionIdMap = new Map()
    createdQuestions.forEach((question, index) => {
      questionIdMap.set(mockQuestions[index].id, question._id)
    })

    // Load exam results
    const results = mockResults.map((result) => {
      // Convert old user ID to new MongoDB ID
      const userId = userIdMap.get(result.userId) || new mongoose.Types.ObjectId()

      // Create a map of answers with new question IDs
      const answers = {}
      if (result.answers) {
        Object.entries(result.answers).forEach(([oldQuestionId, answer]) => {
          const newQuestionId = questionIdMap.get(oldQuestionId)
          if (newQuestionId) {
            answers[newQuestionId] = answer
          }
        })
      }

      return {
        userId,
        userName: result.userName,
        userEmail: result.userEmail,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        score: result.score,
        subjectScores: result.subjectScores,
        answers,
        date: new Date(result.date),
      }
    })

    await ExamResult.insertMany(results)

    return {
      users: createdUsers.length,
      questions: createdQuestions.length,
      results: results.length,
    }
  } catch (error) {
    console.error("Error loading test data:", error)
    throw error
  }
}

export async function clearAllData() {
  try {
    await User.deleteMany({})
    await Question.deleteMany({})
    await ExamResult.deleteMany({})

    return { success: true }
  } catch (error) {
    console.error("Error clearing data:", error)
    throw error
  }
}
