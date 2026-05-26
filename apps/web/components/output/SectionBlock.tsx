import { QuestionCard } from './QuestionCard';

export function SectionBlock({ section }: { section: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-gray-900">{section.title}</h2>
        <p className="text-sm text-gray-500 italic mt-0.5">
          {section.instruction}
          {section.questions?.[0]?.marks && (
            <> Each question carries {section.questions[0].marks} marks</>
          )}
        </p>
      </div>
      <div className="space-y-3">
        {section.questions?.map((q: any, i: number) => (
          <QuestionCard key={q.id} question={q} index={i} />
        ))}
      </div>
    </div>
  );
}