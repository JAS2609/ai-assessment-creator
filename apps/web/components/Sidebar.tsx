'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, FileText, Wrench, BookOpen, Settings, Plus } from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const [assignmentCount, setAssignmentCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/assignments/count')
      .then((r) => r.json())
      .then((d) => setAssignmentCount(d.count))
      .catch(() => setAssignmentCount(null));
  }, [pathname]);

  const navItems = [
    { label: 'Home',                  href: '/',            icon: Home },
    { label: 'My Groups',             href: '/groups',       icon: Users },
    { label: 'Assignments',           href: '/assignments',  icon: FileText, badge: assignmentCount },
    { label: "AI Teacher's Toolkit",  href: '/toolkit',      icon: Wrench },
    { label: 'My Library',            href: '/library',      icon: BookOpen },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-[260px] min-h-screen bg-white fixed left-2 top-2 bottom-9 z-20  rounded-2xl p-0.5"
      style={{ boxShadow: '0px 32px 48px 0px #00000033, 0px 16px 48px 0px #0000001F' }}
    >
     <div className="px-5 pt-6 pb-5">
  <div className="flex items-center gap-2.5">
    <div className="w-10 h-[60px] flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="VedaAI"
          width={60}
          height={60}
          className="rounded-xl object-contain"
        />
      </div>
          <span className="font-bold text-gray-900 text-[18px] tracking-tight leading-none">
            VedaAI
          </span>
        </div>
      </div>
      <div className="px-4 pb-5">
        <Link
          href="/assignments/create"
          className="flex items-center justify-center gap-2 w-full text-white
                     text-sm font-semibold py-[11px] rounded-full transition-opacity
                     hover:opacity-90 active:opacity-80"
          style={{
            background:
              'linear-gradient(#111827, #111827) padding-box, ' +
              'linear-gradient(180deg, #FF7950 0%, #C0350A 100%) border-box',
            border: '4px solid transparent',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Create Assignment
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm
                         transition-colors"
              style={{
                backgroundColor: active ? '#F0F0F0' : 'transparent',
                color: active ? '#111827' : '#6B7280',
                fontWeight: active ? 600 : 400,
              }}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span className="flex-1">{label}</span>
              {badge !== undefined && badge !== null && badge > 0 && (
                <span
                  className="text-white text-[11px] font-semibold rounded-full
                             px-[7px] py-[1px] min-w-[22px] text-center"
                  style={{ background: 'linear-gradient(180deg, #FF7950 0%, #C0350A 100%)' }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-[10px] rounded-xl text-sm
                     text-gray-500 hover:bg-[#F0F0F0] transition-colors mb-1"
        >
          <Settings size={17} strokeWidth={1.8} />
          Settings
        </Link>

        <div
          className="flex items-center gap-3 px-3 py-3 rounded-2xl mt-1"
          style={{ backgroundColor: '#F0F0F0' }}
        >
          
      <Image src="/Avatar.png" alt="School" width={40} height={40} className="rounded-full" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
              Delhi Public School
            </p>
            <p className="text-xs text-gray-400 truncate leading-tight mt-0.5">
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}