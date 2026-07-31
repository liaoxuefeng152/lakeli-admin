'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    setLoading(true);
    const res = await login(username, password);
    setLoading(false);

    if (res.ok) {
      router.push('/dashboard');
    } else {
      setError(res.error || '登录失败');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left: Brand Area */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-gradient-to-br from-[#0a2a6e] via-primary to-[#0F52BA]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-4 mb-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <span className="text-2xl font-bold">L</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">拉克力</h1>
              <p className="text-sm text-white/70">LAKELI UNIFIED PLATFORM</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-6">
            统一中台管理系统
          </h2>
          <p className="text-lg text-white/80 leading-relaxed max-w-lg mb-12">
            一套账号、一套权限、一套数据底座。
            <br />
            全产品一体化管理，消除数据割裂，提升运营效率。
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
              <div className="text-2xl font-bold">统一</div>
              <div className="text-sm text-white/70 mt-1">账号权限体系</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
              <div className="text-2xl font-bold">互通</div>
              <div className="text-sm text-white/70 mt-1">全域数据联动</div>
            </div>
            <div className="rounded-xl bg-white/10 backdrop-blur-sm p-5">
              <div className="text-2xl font-bold">插件</div>
              <div className="text-sm text-white/70 mt-1">模块化架构</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-1 items-center justify-center bg-white px-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">拉克力后台管理系统</span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">欢迎登录</h3>
          <p className="text-sm text-gray-500 mb-8">登录拉克力统一中台管理系统</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">账号 / 邮箱</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号或邮箱"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">登录密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 accent-primary"
                />
                记住账号
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80"
                onClick={() => toast('演示环境', { description: '请联系管理员重置登录密码' })}
              >
                忘记密码?
              </button>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[#F53F3F]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-lg bg-primary text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? '登录中...' : '登 录'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            演示账号: admin@lakeli.com / admin123（超管） · operator@lakeli.com / operator123（运营） · sales@lakeli.com / sales123（销售）
          </p>
        </div>
      </div>
    </div>
  );
}
