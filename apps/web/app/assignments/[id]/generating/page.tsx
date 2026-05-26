'use client';

import { useParams } from 'next/navigation';
import { useAssignmentSocket } from '@/hooks/useAssignmentSocket';
import { useAssignmentStore } from '@/store/assignmentStore';

export default function GeneratingPage() {
  const { id } = useParams<{ id: string }>();
  const { jobStatus } = useAssignmentStore();
  useAssignmentSocket(id);

  const steps = [
    { key: 'queued', label: 'Assignment queued' },
    { key: 'processing', label: 'AI generating questions' },
    { key: 'done', label: 'Paper ready' },
  ];

  const currentIdx = steps.findIndex((s) => s.key === jobStatus) ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full border-4 border-gray-100 border-t-orange-500
                        animate-spin mx-auto mb-6" />

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {jobStatus === 'failed' ? 'Generation failed' : 'Generating your question paper...'}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          {jobStatus === 'failed'
            ? 'Something went wrong. Please go back and try again.'
            : 'AI is crafting questions based on your requirements.'}
        </p>
        <div className="space-y-3 text-left">
          {steps.map((step, i) => {
            const done = currentIdx > i;
            const active = currentIdx === i;
            return (
              <div key={step.key} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0
                  ${done ? 'bg-green-500' : active ? 'bg-orange-500 animate-pulse' : 'bg-gray-200'}`}>
                  {done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${active ? 'text-gray-900 font-medium' : done ? 'text-gray-400 line-through' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {jobStatus === 'failed' && (
          <button
            onClick={() => window.history.back()}
            className="mt-8 w-full py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium
                       hover:bg-gray-800 transition-colors"
          >
            ← Go Back
          </button>
        )}
      </div>
    </div>
  );
}