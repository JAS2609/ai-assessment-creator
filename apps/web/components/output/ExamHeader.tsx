export function ExamHeader({ paper }: { paper: any }) {
  return (
    <div className="text-center px-6 py-8 border-b border-gray-100">
      <h1 className="text-lg sm:text-xl font-bold text-gray-900">
        Delhi Public School, Sector-4, Bokaro
      </h1>
      <p className="text-sm text-gray-600 mt-1">Subject: {paper.subject}</p>
      <p className="text-sm text-gray-600">Class: 5th</p>
      <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-gray-600 gap-1">
        <span>Time Allowed: 45 minutes</span>
        <span>Maximum Marks: {paper.totalMarks}</span>
      </div>
      <p className="text-sm text-gray-500 mt-3 italic">
        All questions are compulsory unless stated otherwise.
      </p>
    </div>
  );
}