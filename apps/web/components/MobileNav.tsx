'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bell, Menu, Home, FileText, BookOpen, Sparkles, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileTopBar() {
  return (
    <header className="md:hidden sticky top-0 z-40 px-3 pt-3 pb-2 bg-gray-50">
      <div className="h-12 bg-white rounded-2xl px-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="VedaAI" width={28} height={28} className="rounded-lg" />
          <span className="text-[18px] font-semibold text-gray-900 leading-none">VedaAI</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell size={16} className="text-gray-700" />
            <span className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#FF6B3D]" />
          </button>
          <Image src="/Avatar.png" alt="Profile" width={28} height={28} className="rounded-full" />
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Menu size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();
  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/assignments', label: 'Assignments', icon: FileText },
    { href: '/library', label: 'Library', icon: BookOpen },
    { href: '/toolkit', label: 'AI Toolkit', icon: Sparkles },
  ];

  return (
    <>
      <Link
        href="/assignments/create"
        className="md:hidden fixed bottom-24 right-4 z-40 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center"
      >
        <Plus size={18} className="text-[#FF6B3D]" />
      </Link>
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#12151B] rounded-3xl px-3 py-2.5">
        <ul className="grid grid-cols-4 gap-1">
          {items.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link href={href} className="flex flex-col items-center gap-1 py-1">
                  <Icon size={15} className={active ? 'text-white' : 'text-gray-500'} />
                  <span className={`text-[10px] ${active ? 'text-white font-semibold' : 'text-gray-500'}`}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
