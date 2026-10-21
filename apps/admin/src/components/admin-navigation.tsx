"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  Boxes,
  ChevronRight,
  ClipboardList,
  FileClock,
  LayoutDashboard,
  Menu,
  Settings2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/resources", label: "Resources", icon: BookOpen },
  { href: "/categories", label: "Curriculum", icon: Boxes },
  { href: "/quizzes", label: "Quizzes", icon: ClipboardList },
  { href: "/announcements", label: "Announcements", icon: Bell },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings2 },
  { href: "/audit", label: "Audit log", icon: FileClock },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[264px] shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
      <Brand />
      <nav aria-label="Main navigation" className="flex-1 space-y-1 px-4 py-6">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
        {navigation.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.3 : 1.8} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={15} />}
            </Link>
          );
        })}
      </nav>
      <div className="m-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white">
        <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-white/10 text-blue-200">
          <Activity size={18} />
        </div>
        <p className="text-xs font-semibold">Your learning platform</p>
        <p className="mt-1 text-[11px] leading-5 text-slate-300">
          Keep your educational content organized and up to date.
        </p>
      </div>
    </aside>
  );
}

export function AdminMobileNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default bg-slate-950/20"
          />
          <nav
            aria-label="Main navigation"
            className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
          >
            {navigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
}

export function AdminBrand() {
  return <Brand />;
}

function Brand() {
  return (
    <Link
      href="/dashboard"
      className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6"
    >
      <span className="flex size-10 items-center justify-center rounded-[14px] bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <BookOpen size={20} strokeWidth={2.2} />
      </span>
      <span>
        <span className="block text-[15px] font-extrabold tracking-tight text-slate-900">
          DevZoft
        </span>
        <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Learning admin
        </span>
      </span>
    </Link>
  );
}
