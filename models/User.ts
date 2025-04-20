import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role?: string
  collegeName?: string
  rollNumber?: string
  phoneNumber?: string
  alternatePhoneNumber?: string
  intermediateHallTicket?: string
  eamcetHallTicket?: string
  gender?: string
  age?: string
  district?: string
  collegeAddress?: string
  homeAddress?: string
  rationCard?: string
  rationCardNumber?: string
  examAttempts?: number
  examAllowed?: boolean
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    collegeName: { type: String },
    rollNumber: { type: String },
    phoneNumber: { type: String },
    alternatePhoneNumber: { type: String },
    intermediateHallTicket: { type: String },
    eamcetHallTicket: { type: String },
    gender: { type: String },
    age: { type: String },
    district: { type: String },
    collegeAddress: { type: String },
    homeAddress: { type: String },
    rationCard: { type: String, enum: ["none", "white", "pink"], default: "none" },
    rationCardNumber: { type: String },
    examAttempts: { type: Number, default: 0 },
    examAllowed: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
