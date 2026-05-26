export function StudentInfoSection() {
  return (
    <div className="space-y-3">
      {['Name', 'Roll Number', 'Class / Section'].map((label) => (
        <div key={label} className="flex items-center gap-2 text-sm text-gray-700">
          <span className="w-28 shrink-0">{label}:</span>
          <div className="flex-1 border-b border-gray-400 pb-0.5" />
        </div>
      ))}
    </div>
  );
}