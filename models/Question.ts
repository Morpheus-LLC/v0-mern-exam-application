import mongoose, { Schema, type Document } from "mongoose"

export interface IQuestion extends Document {
  text: string
  options: string[]
  correctOption: string
  subject: "math" | "physics" | "chemistry"
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    options: { type: [String], required: true, validate: [(val: string[]) => val.length === 4, "Must have 4 options"] },
    correctOption: { type: String, required: true },
    subject: { type: String, required: true, enum: ["math", "physics", "chemistry"] },
  },
  { timestamps: true },
)

export default mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema)
