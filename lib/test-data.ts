import { questions as mockQuestions, users as mockUsers, examResults as mockResults } from "./mock-db"
import User from "@/models/User"
import Question from "@/models/Question"
import ExamResult from "@/models/ExamResult"
import mongoose from "mongoose"

export async function loadTestData() {
  try {
    // Load users
    const userPromises = mockUsers.map(async (user) => {
      const existingUser = await User.findOne({ email: user.email })
      if (!existingUser) {
        const newUser = new User({
          ...user,
          _id: new mongoose.Types.ObjectId(
            user.id === "demo1" ? "000000000000000000000001" : "000000000000000000000002",
          ),
        })
        return newUser.save()
      }
      return existingUser
    })

    const savedUsers = await Promise.all(userPromises)

    // Create a map of user IDs
    const userIdMap = new Map()
    savedUsers.forEach((user) => {
      const originalId = mockUsers.find((u) => u.email === user.email)?.id
      if (originalId) {
        userIdMap.set(originalId, user._id)
      }
    })

    // Load questions
    const questionPromises = mockQuestions.map(async (question) => {
      const existingQuestion = await Question.findOne({ text: question.text })
      if (!existingQuestion) {
        const newQuestion = new Question(question)
        return newQuestion.save()
      }
      return existingQuestion
    })

    await Promise.all(questionPromises)

    // Load exam results
    const resultPromises = mockResults.map(async (result) => {
      const userId = userIdMap.get(result.userId) || savedUsers[0]._id

      const existingResult = await ExamResult.findOne({
        userName: result.userName,
        date: new Date(result.date),
      })

      if (!existingResult) {
        const newResult = new ExamResult({
          ...result,
          userId,
          date: new Date(result.date),
        })
        return newResult.save()
      }
      return existingResult
    })

    await Promise.all(resultPromises)

    return {
      users: savedUsers.length,
      questions: mockQuestions.length,
      results: mockResults.length,
    }
  } catch (error) {
    console.error("Error loading test data:", error)
    throw error
  }
}
