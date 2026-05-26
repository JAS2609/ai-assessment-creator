'use client';
import { useRouter } from 'next/navigation';
import { downloadPaper } from '@/utils/downloadPaper';
import { Download, RefreshCw } from 'lucide-react';
import { useAssignmentStore } from '@/store/assignmentStore';
export function ActionBar({ paper }: { paper: any }) {
  const router = useRouter();

 const { setJobStatus } = useAssignmentStore();

const handleRegenerate = async () => {
  setJobStatus('queued');  
  await fetch(`/api/assignments/${paper.assignmentId}/regenerate`, { method: 'POST' });
  router.push(`/assignments/${paper.assignmentId}/generating`);
};

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-1.5 px-4 py-2 border border-gray-600 text-gray-300
                   rounded-full text-sm hover:bg-gray-800 transition-colors"
      >
        <RefreshCw size={13} />
        Regenerate
      </button>
      <button
        onClick={() => downloadPaper(paper)}
        className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-900
                   rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
      >
        <Download size={13} />
        Download as PDF
      </button>
    </div>
  );
}