'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, Search, User, Settings, LogOut } from 'lucide-react';
import { useAuth, roleLabel } from '@/lib/auth';

export default function TopNav() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户、订单、话术…"
            className="w-72 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F53F39]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
          >
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="avatar"
              className="h-8 w-8 rounded-full"
            />
            <div className="hidden text-left sm:block">
              <div className="text-sm font-medium text-gray-900">{user?.name || '未登录'}</div>
              <div className="text-xs text-gray-400">{roleLabel(user?.role)}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <User className="h-4 w-4" />
                个人设置
              </button>
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                <Settings className="h-4 w-4" />
                修改密码
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#F53F39] hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
