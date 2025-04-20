import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  collegeName: {
    type: String,
    default: "",
  },
  rollNumber: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  alternatePhoneNumber: {
    type: String,
    default: "",
  },
  intermediateHallTicket: {
    type: String,
    default: "",
  },
  eamcetHallTicket: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    enum: ["male", "female", "other", ""],
    default: "",
  },
  age: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  collegeAddress: {
    type: String,
    default: "",
  },
  homeAddress: {
    type: String,
    default: "",
  },
  rationCard: {
    type: String,
    enum: ["none", "white", "pink", ""],
    default: "none",
  },
  rationCardNumber: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
    return
  }

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model("User", UserSchema)
