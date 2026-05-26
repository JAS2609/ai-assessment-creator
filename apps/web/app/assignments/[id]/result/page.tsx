import { Sidebar } from '@/components/Sidebar';
import { QuestionPaperView } from '@/components/output/QuestionPaperView';
import { notFound } from 'next/navigation';
import { TopBar } from '@/components/Topbar'; 
async function getResult(id: string) {
  for (let i = 0; i < 3; i++) {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/assignments/${id}/result`,
      { cache: 'no-store' }
    );
    if (res.ok) return res.json();
    await new Promise(r => setTimeout(r, 1000)); // wait 1s and retry
  }
  return null;
}
export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const paper = await getResult(id);
  if (!paper) notFound();
  return (
   <div className="flex min-h-screen bg-gray-50">
       <Sidebar />
       <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
         <TopBar title="Create Assignment" />
      <div className="flex items-center justify-center flex-1 p-6">
        <QuestionPaperView paper={paper} />
      </div>
    </div>
    </div>
  );
}