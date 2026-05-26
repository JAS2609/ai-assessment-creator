const difficultyLabel: Record<string, string> = {
  easy: 'Easy',
  medium: 'Moderate',
  hard: 'Challenging',
};

const difficultyColor: Record<string, string> = {
  easy: 'text-green-700',
  medium: 'text-amber-700',
  hard: 'text-red-700',
};

export function QuestionCard({ question, index }: { question: any; index: number }) {
  const diff = question.difficulty || 'medium';
  return (
    <div className="text-sm text-gray-800 leading-relaxed">
      <p>
        <span className="font-medium">{index + 1}. </span>
        <span className={`font-medium ${difficultyColor[diff]}`}>
          [{difficultyLabel[diff]}]
        </span>{' '}
        {question.text}{' '}
        <span className="text-gray-400 text-xs">[{question.marks} Marks]</span>
      </p>
      {question.options?.length > 0 && (
        <div className="ml-5 mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-0.5">
          {question.options.map((opt: string, i: number) => (
            <p key={i} className="text-gray-600">{opt}</p>
          ))}
        </div>
      )}
    </div>
  );
}