import { Request, Response, NextFunction } from 'express';

const validTypes = ['mcq', 'short_answer', 'diagram', 'numerical'];

export function validateAssignment(req: Request, res: Response, next: NextFunction) {
  const { title, subject, dueDate, questionTypes, totalQuestions, totalMarks } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3)
    errors.push('title must be at least 3 characters');

  if (!subject || typeof subject !== 'string' || subject.trim().length < 2)
    errors.push('subject is required');

  if (!dueDate || isNaN(Date.parse(dueDate)))
    errors.push('dueDate must be a valid date');
  else if (new Date(dueDate) <= new Date())
    errors.push('dueDate must be in the future');

  if (!Array.isArray(questionTypes) || questionTypes.length === 0)
    errors.push('questionTypes must be a non-empty array');
  else if (questionTypes.some((t) => !validTypes.includes(t)))
    errors.push(`questionTypes must be one of: ${validTypes.join(', ')}`);

  if (typeof totalQuestions !== 'number' || !Number.isInteger(totalQuestions) || totalQuestions < 1)
    errors.push('totalQuestions must be a positive integer');

  if (typeof totalMarks !== 'number' || !Number.isInteger(totalMarks) || totalMarks < 1)
    errors.push('totalMarks must be a positive integer');

  if (errors.length > 0) return res.status(400).json({ errors });

  next();
}