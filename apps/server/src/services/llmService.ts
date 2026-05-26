import Groq from 'groq-sdk';

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateQuestionPaper(prompt: string) {
  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = response.choices[0]?.message?.content || '';
  return parseAndValidate(rawText);
}

function parseAndValidate(raw: string) {
  const cleaned = raw.replace(/```json|```/g, '').trim();

  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('LLM returned invalid JSON');
  }

  if (!parsed.sections || !Array.isArray(parsed.sections))
    throw new Error('Missing sections in LLM response');

  parsed.sections = parsed.sections.map((section: any, si: number) => ({
    title: section.title || `Section ${String.fromCharCode(65 + si)}`,
    instruction: section.instruction || 'Attempt all questions',
    questions: (section.questions || []).map((q: any, qi: number) => ({
      id: q.id || `${String.fromCharCode(65 + si)}${qi + 1}`,
      text: q.text || '',
      type: q.type || 'short_answer',
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
      marks: typeof q.marks === 'number' ? q.marks : 1,
      options: Array.isArray(q.options) ? q.options : [],
    })),
  }));

  return parsed;
}