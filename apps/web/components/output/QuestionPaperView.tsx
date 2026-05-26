'use client';
import { ExamHeader } from './ExamHeader';
import { StudentInfoSection } from './StudentInfoSection';
import { ActionBar } from './ActionBar';
import { SectionBlock } from './SectionBlock';

export function QuestionPaperView({ paper }: { paper: any }) {
  return (
    <div className="min-h-screen">
      {/* Dark AI message bar — matches Figma */}
      
      <div className="bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row
                      items-start sm:items-center justify-between gap-3 rounded-2xl">
        <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
          Here are customized questions for your{' '}
          <span className="text-white font-medium">{paper.subject}</span> class.
        </p>
        <ActionBar paper={paper} />
      </div>

      {/* Paper */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ExamHeader paper={paper} />
          <div className="p-6 sm:p-10 space-y-8">
            <StudentInfoSection />
            <hr className="border-gray-100" />
            {paper.sections?.map((section: any) => (
              <SectionBlock key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}