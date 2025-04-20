import mongoose from "mongoose"

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Please provide question text"],
    trim: true,
  },
  options: {
    type: [String],
    required: [true, "Please provide options"],
    validate: {
      validator: (v) => {
        return v.length >= 2 // At least 2 options
      },
      message: "Question must have at least 2 options",
    },
  },
  correctOption: {
    type: String,
    required: [true, "Please provide the correct option"],
    validate: {
      validator: function (v) {
        return this.options.includes(v)
      },
      message: "Correct option must be one of the provided options",
    },
  },
  subject: {
    type: String,
    required: [true, "Please provide a subject"],
    enum: ["math", "physics", "chemistry"],
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field on save
QuestionSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

// Create indexes for faster queries
QuestionSchema.index({ subject: 1 })
QuestionSchema.index({ difficulty: 1 })

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema)
