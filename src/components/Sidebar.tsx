'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PackageSearch, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Estoque de Peças', href: '/parts', icon: PackageSearch },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#111827] border-r border-[#1f2937] flex flex-col h-full shadow-2xl">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          AutoSystem
        </h1>
        <p className="text-xs text-gray-500 mt-1">Gestão de Autopeças</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "text-gray-400 hover:text-white hover:bg-[#1f2937]"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-blue-500" : "text-gray-500 group-hover:text-gray-300")} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#1f2937]">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1f2937]/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            US
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">Admin</span>
            <span className="text-xs text-gray-500">n8n Integrado</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
