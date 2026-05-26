import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: String,
  text: String,
  type: String,
  difficulty: String,
  marks: Number,
  options: [String],
});

const SectionSchema = new mongoose.Schema({
  title: String,
  instruction: String,
  questions: [QuestionSchema],
});

const ResultSchema = new mongoose.Schema({
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  title: String,
  subject: String,
  totalMarks: Number,
  dueDate: Date,
  sections: [SectionSchema],
  generatedAt: { type: Date, default: Date.now },
});

export const Result = mongoose.model('Result', ResultSchema);