import { NextResponse } from "next/server"
import { headers } from "next/headers"
import connectToDatabase from "@/lib/mongodb"
import ExamAttempt from "@/models/ExamAttempt"
import Question from "@/models/Question"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const headersList = headers()
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

    const attemptId = params.id

    await connectToDatabase()

    // Find attempt by ID
    const attempt = await ExamAttempt.findById(attemptId).populate("userId")

    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 })
    }

    // Get all question IDs from the attempt
    const questionIds = attempt.questions.map((q: any) => q.id)

    // Fetch the correct answers for all questions
    const questions = await Question.find({ _id: { $in: questionIds } })

    // Create a map of question IDs to correct options
    const correctOptionsMap = new Map()
    questions.forEach((question) => {
      correctOptionsMap.set(question._id.toString(), question.correctOption)
    })

    // Add correct option to each question in the attempt
    const questionsWithCorrectOptions = attempt.questions.map((q: any) => ({
      ...(q.toObject ? q.toObject() : q),
      correctOption: correctOptionsMap.get(q.id) || null,
      isCorrect: q.selectedOption === correctOptionsMap.get(q.id),
    }))

    // Calculate statistics
    const totalQuestions = questionsWithCorrectOptions.length
    const answeredQuestions = questionsWithCorrectOptions.filter((q: any) => q.selectedOption).length
    const correctAnswers = questionsWithCorrectOptions.filter((q: any) => q.isCorrect).length
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100 * 10) / 10 : 0

    // Group questions by subject
    const subjectGroups: Record<string, any[]> = {}
    questionsWithCorrectOptions.forEach((q: any) => {
      if (!subjectGroups[q.subject]) {
        subjectGroups[q.subject] = []
      }
      subjectGroups[q.subject].push(q)
    })

    // Calculate subject scores
    const subjectScores: Record<string, number> = {}
    Object.keys(subjectGroups).forEach((subject) => {
      const subjectQuestions = subjectGroups[subject]
      const subjectCorrect = subjectQuestions.filter((q) => q.isCorrect).length
      subjectScores[subject] = Math.round((subjectCorrect / subjectQuestions.length) * 100)
    })

    return NextResponse.json(
      {
        attempt: {
          ...attempt.toObject(),
          questions: questionsWithCorrectOptions,
          statistics: {
            totalQuestions,
            answeredQuestions,
            correctAnswers,
            score,
            subjectScores,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching attempt:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
