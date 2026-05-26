import { Worker } from 'bullmq';
import { redis } from '../config/redis';
import { Assignment } from '../models/Assignment';
import { Result } from '../models/Result';
import { buildPrompt } from '../services/promptBuilder';
import { generateQuestionPaper } from '../services/llmService';
import { broadcast } from '../ws/wsManager';

export const generationWorker = new Worker(
  'assessment',
  async (job) => {
    const { assignmentId } = job.data;

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });
    broadcast(assignmentId, { type: 'status_update', assignmentId, status: 'processing' });

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    const prompt = buildPrompt({
      title: assignment.title,
      subject: assignment.subject,
      totalQuestions: assignment.totalQuestions,
      totalMarks: assignment.totalMarks,
      questionTypes: assignment.questionTypes,
      additionalInstructions: assignment.additionalInstructions ?? undefined,
      fileContent: assignment.fileContent ?? undefined,
    });

    const paper = await generateQuestionPaper(prompt);

    await Result.create({
      assignmentId,
      ...paper,
      dueDate: assignment.dueDate,
      generatedAt: new Date(),
    });

    await Assignment.findByIdAndUpdate(assignmentId, { status: 'done' });
    broadcast(assignmentId, { type: 'status_update', assignmentId, status: 'done' });
  },
  { connection: redis, concurrency: 3 }
);

generationWorker.on('failed', async (job, err) => {
  if (!job) return;
  const { assignmentId } = job.data;
  await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
  broadcast(assignmentId, {
    type: 'status_update',
    assignmentId,
    status: 'failed',
    error: err.message,
  });
  console.error(`Job failed for ${assignmentId}:`, err.message);
});