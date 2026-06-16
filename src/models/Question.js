import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['general', 'science', 'history']
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [v => v.length === 4, 'Options array must contain exactly 4 items']
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
