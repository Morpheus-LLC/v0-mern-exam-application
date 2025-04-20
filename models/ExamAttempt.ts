import mongoose, { Schema, type Document } from "mongoose"

export interface IExamAttempt extends Document {
  userId: mongoose.Types.ObjectId
  questions: {
    id: string
    text: string
    options: string[]
    subject: string
    selectedOption?: string
  }[]
  startTime: Date
  endTime: Date
  timeRemaining: number
  hasSubmitted: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ExamAttemptSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questions: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        options: { type: [String], required: true },
        subject: { type: String, required: true },
        selectedOption: { type: String, default: null },
      },
    ],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    timeRemaining: { type: Number, required: true }, // in seconds
    hasSubmitted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.ExamAttempt || mongoose.model<IExamAttempt>("ExamAttempt", ExamAttemptSchema)
