'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/Topbar';
import { MobileTopBar, MobileBottomBar } from '@/components/MobileNav';
import { Plus, Search, SlidersHorizontal, MoreVertical, Trash2, Eye } from 'lucide-react';

interface Assignment {
  _id: string;
  title: string;
  subject: string;
  createdAt: string;
  dueDate: string;
  status: string;
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
      <div className="relative w-36 h-36">
        <div className="w-full h-full rounded-full bg-white/60 flex items-center justify-center"
          style={{ boxShadow: '0px 8px 32px 0px #00000018' }}>
          <div className="relative">
            <div className="w-16 h-20 bg-gray-100 rounded-lg border-2 border-gray-200
                            flex flex-col gap-1.5 p-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-1.5 bg-gray-300 rounded-full" />
              ))}
            </div>
            <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full
                            bg-white border-2 border-gray-200 flex items-center justify-center"
              style={{ boxShadow: '0px 4px 12px #0000001A' }}>
              <span className="text-red-500 text-lg font-black">✕</span>
            </div>
          </div>
        </div>
        <span className="absolute top-1 right-2 text-purple-400 text-xs">✦</span>
        <span className="absolute bottom-2 left-1 text-blue-300 text-xs">✦</span>
      </div>

      <div className="text-center max-w-sm">
        <h3 className="text-[17px] font-bold text-gray-900">No assignments yet</h3>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Create your first assignment to start collecting and grading student submissions.
          You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
      </div>

      <Link
        href="/assignments/create"
        className="flex items-center gap-2 text-white text-sm font-semibold
                   px-6 py-3 rounded-full transition-opacity hover:opacity-90"
        style={{
          background: 'linear-gradient(#111827, #111827) padding-box, linear-gradient(180deg, #FF7950 0%, #C0350A 100%) border-box',
          border: '4px solid transparent',
        }}
      >
        <Plus size={15} strokeWidth={2.5} />
        Create Your First Assignment
      </Link>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const assignedDate = new Date(assignment.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).replace(/\//g, '-');

  const dueDate = new Date(assignment.dueDate).toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).replace(/\//g, '-');

  return (
    <div
      className="bg-white relative flex flex-col justify-between"
      style={{
        borderRadius: '24px',
        padding: '24px',
        minHeight: '162px',
        boxShadow: '0px 4px 24px 0px #0000000F',
      }}
    >
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-gray-900 text-[16px] leading-snug pr-6">
          {assignment.title}
        </h3>
        <div className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg hover:bg-[#F0F0F0] transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-8 bg-white rounded-2xl py-1 z-10 w-44"
              style={{ boxShadow: '0px 16px 48px 0px #0000001F' }}
            >
              <Link
                href={`/assignments/${assignment._id}/result`}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700
                           hover:bg-[#F0F0F0] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <Eye size={14} />
                View Assignment
              </Link>
              <button
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500
                           hover:bg-red-50 transition-colors w-full text-left"
                onClick={() => setMenuOpen(false)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-gray-400 mt-auto pt-4">
        <span>
          Assigned on :{' '}
          <span className="font-semibold text-gray-600">{assignedDate}</span>
        </span>
        <span>
          Due :{' '}
          <span className="font-semibold text-gray-600">{dueDate}</span>
        </span>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/assignments')
      .then((r) => r.json())
      .then((d) => setAssignments(Array.isArray(d) ? d : []))
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <div className="hidden md:block">
          <TopBar title=" Assignment" />
        </div>
        <MobileTopBar />

        <main className="flex-1 p-4 sm:p-6 pb-28 md:pb-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-4 border-gray-300 border-t-orange-500 animate-spin" />
            </div>
          ) : filtered.length === 0 && search === '' ? (
            <EmptyState />
          ) : (
            <>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <h1 className="text-[20px] font-bold text-gray-900">Assignments</h1>
                </div>
                <p className="text-sm text-gray-500 mt-0.5 ml-4">
                  Manage and create assignments for your classes.
                </p>
              </div>

              {/* Filter + Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6 mt-4">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl
                             text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ boxShadow: '0px 2px 8px 0px #0000000A' }}
                >
                  <SlidersHorizontal size={14} />
                  Filter By
                </button>
                <div className="flex-1 relative">
                  <Search
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search Assignment"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl text-sm
                               placeholder:text-gray-400 focus:outline-none"
                    style={{ boxShadow: '0px 2px 8px 0px #0000000A' }}
                  />
                </div>
              </div>

              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-12">
                  No assignments match your search.
                </p>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {filtered.map((a) => (
                    <AssignmentCard key={a._id} assignment={a} />
                  ))}
                  <div className="hidden md:block fixed bottom-7 left-1/2 -translate-x-1/2 md:left-auto md:right-7 md:translate-x-0">
                    <Link
                      href="/assignments/create"
                      className="flex items-center gap-2 text-white text-sm font-semibold
                                px-6 py-3 rounded-full transition-opacity hover:opacity-90"
                      style={{
                        background: '#111827',
                        boxShadow: '0px 8px 24px 0px #00000033',
                      }}
                    >
                      <Plus size={15} strokeWidth={2.5} />
                      Create Assignment
                    </Link>
                  </div>
                </div>
                
              )}
            </>
          )}
        </main>

        
        <MobileBottomBar />
      </div>
    </div>
  );
}
