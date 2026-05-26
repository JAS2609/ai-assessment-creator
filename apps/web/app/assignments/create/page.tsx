'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/Topbar';
import { MobileTopBar, MobileBottomBar } from '@/components/MobileNav';
import { useAssignmentStore, QuestionRow, QuestionType } from '@/store/assignmentStore';
import { extractTextFromPDF } from '@/utils/extractPdfText';
import { Upload, X, Plus, Minus, Calendar } from 'lucide-react';

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] = [
  { value: 'mcq', label: 'Multiple Choice Questions' },
  { value: 'short_answer', label: 'Short Questions' },
  { value: 'diagram', label: 'Diagram/Graph-Based Questions' },
  { value: 'numerical', label: 'Numerical Problems' },
];

function Counter({
  value, onChange, min = 1,
}: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center
                   hover:bg-gray-100 transition-colors text-gray-600"
      >
        <Minus size={12} />
      </button>
      <span className="w-8 text-center text-sm font-medium text-gray-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center
                   hover:bg-gray-100 transition-colors text-gray-600"
      >
        <Plus size={12} />
      </button>
    </div>
  );
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { form, setField, setAssignmentId, setJobStatus } = useAssignmentStore();
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const totalQuestions = form.questionRows.reduce((s, r) => s + r.count, 0);
  const totalMarks = form.questionRows.reduce((s, r) => s + r.count * r.marks, 0);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    if (file.type === 'application/pdf') {
      const text = await extractTextFromPDF(file);
      setField('fileContent', text);
    }
  };

  const addRow = () => {
    const newRow: QuestionRow = {
      id: Date.now().toString(),
      type: 'short_answer',
      count: 3,
      marks: 2,
    };
    setField('questionRows', [...form.questionRows, newRow]);
  };

  const removeRow = (id: string) => {
    setField('questionRows', form.questionRows.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, key: keyof QuestionRow, value: any) => {
    setField(
      'questionRows',
      form.questionRows.map((r) => (r.id === id ? { ...r, [key]: value } : r))
    );
  };

  const validate = () => {
    const errs: string[] = [];
    if (!form.title.trim()) errs.push('Assignment title is required');
    if (!form.subject.trim()) errs.push('Subject is required');
    if (!form.dueDate) errs.push('Due date is required');
    else if (new Date(form.dueDate) <= new Date()) errs.push('Due date must be in the future');
    if (form.questionRows.length === 0) errs.push('Add at least one question type');
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setSubmitting(true);

    try {
      const payload = {
        title: form.title || form.subject + ' Assessment',
        subject: form.subject,
        dueDate: form.dueDate,
        questionTypes: [...new Set(form.questionRows.map((r) => r.type))],
        totalQuestions,
        totalMarks,
        additionalInstructions: form.additionalInstructions,
        fileContent: form.fileContent,
      };

      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrors(data.errors || ['Failed to create assignment']);
        setSubmitting(false);
        return;
      }

      const { assignmentId } = await res.json();
      setAssignmentId(assignmentId);
      setJobStatus('queued');
      router.push(`/assignments/${assignmentId}/generating`);
    } catch {
      setErrors(['Network error. Please try again.']);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="hidden md:block">
          <TopBar title="Create Assignment" />
        </div>
        <MobileTopBar />
        <main className="flex-1 p-3 sm:p-6 pb-28 md:pb-6 max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-900">Create Assignment</h1>
            <p className="text-sm text-gray-500">Set up a new assignment for your students</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-200 rounded-full mb-8">
            <div className="h-full bg-gray-600 rounded-full w-1/2 transition-all" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="overflow-hidden">
              <h2 className="font-semibold text-gray-900">Assignment Details</h2>
              <p className="text-xs text-gray-400 mt-0.5">Basic information about your assignment</p>
            </div>

            {/* Title + Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics Mid Term"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                             placeholder:text-gray-400 focus:outline-none focus:border-orange-400 text-gray-950"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics"
                  value={form.subject}
                  onChange={(e) => setField('subject', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                             placeholder:text-gray-400 focus:outline-none focus:border-orange-400 text-gray-950"
                />
              </div>
            </div>

            {/* File Upload */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                ${dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                {fileName || 'Choose a file or drag & drop it here'}
              </p>
              <p className="text-xs text-gray-400 mt-1">JPEG, PNG, GIF, PDF upto 10MB</p>
              <label className="mt-4 inline-block cursor-pointer bg-white border border-gray-200
                                text-sm text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                />
              </label>
              {fileName && (
                <p className="text-xs text-orange-600 mt-2 font-medium">{fileName} uploaded ✓</p>
              )}
            </div>
            <p className="text-xs text-gray-400 -mt-4">
              Upload images of your preferred document/image
            </p>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setField('dueDate', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                             text-gray-700 focus:outline-none focus:border-orange-400 pr-10"
                />
                <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Question Types */}
            <div>
              <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 text-xs font-medium text-gray-500 px-1">
                <div className="col-span-6">Question Type</div>
                <div className="col-span-3 text-center">No. of Questions</div>
                <div className="col-span-3 text-center">Marks</div>
              </div>

              <div className="space-y-3">
                {form.questionRows.map((row) => (
                  <div key={row.id}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-3">
                    <div className="sm:col-span-6 flex items-center gap-2">
                      <select
                        value={row.type}
                        onChange={(e) => updateRow(row.id, 'type', e.target.value as QuestionType)}
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2
                                   text-sm text-gray-700 focus:outline-none focus:border-orange-400"
                      >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500
                                   text-gray-400 transition-colors shrink-0"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="sm:col-span-3 flex justify-between sm:justify-center">
                      <Counter value={row.count} onChange={(v) => updateRow(row.id, 'count', v)} />
                    </div>
                    <div className="sm:col-span-3 flex justify-between sm:justify-center">
                      <Counter value={row.marks} onChange={(v) => updateRow(row.id, 'marks', v)} />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 mt-3 text-sm text-gray-600
                           hover:text-gray-900 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
                  <Plus size={12} className="text-white" />
                </div>
                Add Question Type
              </button>

              <div className="flex flex-col items-end sm:flex-row justify-end gap-2 sm:gap-6 mt-4 text-sm text-gray-600">
                <span>Total Questions : <strong className="text-gray-900">{totalQuestions}</strong></span>
                <span>Total Marks : <strong className="text-gray-900">{totalMarks}</strong></span>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Additional Information{' '}
                <span className="text-gray-400 font-normal">(For better output)</span>
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  placeholder="e.g. Generate a question paper for 3 hour exam duration..."
                  value={form.additionalInstructions}
                  onChange={(e) => setField('additionalInstructions', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm
                             placeholder:text-gray-400 focus:outline-none focus:border-orange-400
                             resize-none text-gray-950"
                />
              </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                {errors.map((e, i) => (
                  <p key={i} className="text-sm text-red-600">{e}</p>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6 pb-8 gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-full
                         text-sm font-medium text-gray-700 hover:bg-white transition-colors"
            >
              ← Previous
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full
                         text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Generating...' : 'Next →'}
            </button>
          </div>
        </main>
        <MobileBottomBar />
      </div>
    </div>
  );
}
