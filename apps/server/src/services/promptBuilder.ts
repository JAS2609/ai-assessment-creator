interface AssignmentInput {
  title: string;
  subject: string;
  totalQuestions: number;
  totalMarks: number;
  questionTypes: string[];
  additionalInstructions?: string;
  fileContent?: string;
}

export function buildPrompt(input: AssignmentInput): string {
  return `
You are an expert teacher creating a formal exam question paper.
Generate a structured question paper based on these requirements:

Subject: ${input.subject}
Title: ${input.title}
Total Questions: ${input.totalQuestions}
Total Marks: ${input.totalMarks}
Question Types: ${input.questionTypes.join(', ')}
${input.additionalInstructions ? `Special Instructions: ${input.additionalInstructions}` : ''}
${input.fileContent ? `Reference Material:\n${input.fileContent.slice(0, 2000)}` : ''}

Section layout:
${buildSectionLayout(input.questionTypes)}

You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no backticks.
Follow this exact structure:
{
  "title": "string",
  "subject": "string",
  "totalMarks": number,
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "id": "A1",
          "text": "Question text here",
          "type": "mcq",
          "difficulty": "easy",
          "marks": 1,
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"]
        }
      ]
    }
  ]
}

Rules:
- Marks across all questions must sum to exactly ${input.totalMarks}
- Difficulty distribution: ~40% easy, 40% medium, 20% hard
- For MCQ always include exactly 4 options prefixed with A. B. C. D.
- options field only for mcq type, omit for all other types
- Questions must be academically rigorous and relevant to ${input.subject}
`.trim();
}

function buildSectionLayout(questionTypes: string[]): string {
  const lines: string[] = [];
  if (questionTypes.includes('mcq'))
    lines.push('- Section A: Multiple choice questions, 1 mark each');
  if (questionTypes.includes('short_answer'))
    lines.push('- Section B: Short answer questions, 2-5 marks each');
  if (questionTypes.includes('diagram'))
    lines.push('- Section C: Diagram/graph-based questions, 5 marks each');
  if (questionTypes.includes('numerical'))
    lines.push('- Section D: Numerical problems, 5 marks each');
  return lines.join('\n');
}