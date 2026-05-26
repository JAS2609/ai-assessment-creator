import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  dueDate: { type: Date, required: true },
  questionTypes: [{ type: String }],
  totalQuestions: { type: Number, required: true, min: 1 },
  totalMarks: { type: Number, required: true, min: 1 },
  additionalInstructions: String,
  fileContent: String,
  status: {
    type: String,
    enum: ['queued', 'processing', 'done', 'failed'],
    default: 'queued',
  },
}, { timestamps: true });

export const Assignment = mongoose.model('Assignment', AssignmentSchema);