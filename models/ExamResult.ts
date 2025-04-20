import mongoose, { Schema, type Document } from "mongoose"

export interface IExamResult extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  totalQuestions: number
  correctAnswers: number
  score: number
  subjectScores: {
    math: number
    physics: number
    chemistry: number
  }
  date: Date
  createdAt: Date
  updatedAt: Date
}

const ExamResultSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    score: { type: Number, required: true },
    subjectScores: {
      math: { type: Number, default: 0 },
      physics: { type: Number, default: 0 },
      chemistry: { type: Number, default: 0 },
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

export default mongoose.models.ExamResult || mongoose.model<IExamResult>("ExamResult", ExamResultSchema)
