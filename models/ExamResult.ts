import mongoose from "mongoose"

const ExamResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  userName: {
    type: String,
    required: [true, "User name is required"],
  },
  userEmail: {
    type: String,
    required: [true, "User email is required"],
  },
  totalQuestions: {
    type: Number,
    required: [true, "Total questions is required"],
  },
  correctAnswers: {
    type: Number,
    required: [true, "Correct answers is required"],
  },
  score: {
    type: Number,
    required: [true, "Score is required"],
  },
  subjectScores: {
    math: {
      type: Number,
      default: 0,
    },
    physics: {
      type: Number,
      default: 0,
    },
    chemistry: {
      type: Number,
      default: 0,
    },
  },
  answers: {
    type: Map,
    of: String,
    default: {},
  },
  date: {
    type: Date,
    default: Date.now,
  },
  examDuration: {
    type: Number, // in seconds
    default: 0,
  },
  tabSwitchCount: {
    type: Number,
    default: 0,
  },
})

// Create indexes for faster queries
ExamResultSchema.index({ userId: 1 })
ExamResultSchema.index({ date: -1 })
ExamResultSchema.index({ score: -1 })

export default mongoose.models.ExamResult || mongoose.model("ExamResult", ExamResultSchema)
