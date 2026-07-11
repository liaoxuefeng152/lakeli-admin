'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Lock,
  LogOut,
  Globe,
  Bot,
} from 'lucide-react';
import Link from 'next/link';

export default function TopNav() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPluginMenu, setShowPluginMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pluginMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (pluginMenuRef.current && !pluginMenuRef.current.contains(e.target as Node)) {
        setShowPluginMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1677FF]">
          <span className="text-sm font-bold text-white">L</span>
        </div>
        <span className="text-base font-semibold text-gray-900">拉克力后台管理系统</span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索客户名称、手机号、订单号..."
            className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#1677FF] focus:bg-white focus:ring-1 focus:ring-[#1677FF]/20"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#F53F3F]" />
        </button>

        {/* Plugin Switcher */}
        <div className="relative" ref={pluginMenuRef}>
          <button
            onClick={() => setShowPluginMenu(!showPluginMenu)}
            className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Plug className="h-3.5 w-3.5" />
            <span>业务插件</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {showPluginMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
              <Link
                href="/geo"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPluginMenu(false)}
              >
                <Globe className="h-4 w-4 text-[#0F52BA]" />
                域途GEO SaaS
              </Link>
              <Link
                href="/ai-service"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPluginMenu(false)}
              >
                <Bot className="h-4 w-4 text-[#00B42A]" />
                智推AI客服Agent
              </Link>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1677FF] text-xs text-white">
              张
            </div>
            <span>张超管</span>
            <ChevronDown className="h-3 w-3" />
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50">
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <User className="h-4 w-4" />
                个人设置
              </button>
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <Lock className="h-4 w-4" />
                修改密码
              </button>
              <div className="border-t border-gray-100 my-1" />
              <Link
                href="/login"
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[#F53F3F] hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                退出登录
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Plug(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  );
}
