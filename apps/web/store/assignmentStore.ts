import { create } from 'zustand';

export type QuestionType = 'mcq' | 'short_answer' | 'diagram' | 'numerical';
export type JobStatus = 'queued' | 'processing' | 'done' | 'failed';

export interface QuestionRow {
  id: string;
  type: QuestionType;
  count: number;
  marks: number;
}

export interface FormData {
  title: string;
  subject: string;
  dueDate: string;
  questionRows: QuestionRow[];
  additionalInstructions: string;
  fileContent: string;
}

interface AssignmentStore {
  form: FormData;
  assignmentId: string | null;
  jobStatus: JobStatus | null;
  setField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  setAssignmentId: (id: string) => void;
  setJobStatus: (status: JobStatus) => void;
  reset: () => void;
}

const defaultForm: FormData = {
  title: '',
  subject: '',
  dueDate: '',
  questionRows: [{ id: '1', type: 'mcq', count: 4, marks: 1 }],
  additionalInstructions: '',
  fileContent: '',
};

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  form: defaultForm,
  assignmentId: null,
  jobStatus: null,
  setField: (key, value) =>
    set((s) => ({ form: { ...s.form, [key]: value } })),
  setAssignmentId: (id) => set({ assignmentId: id }),
  setJobStatus: (status) => set({ jobStatus: status }),
  reset: () => set({ form: defaultForm, assignmentId: null, jobStatus: null }),
}));