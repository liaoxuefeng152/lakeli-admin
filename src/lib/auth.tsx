'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'lakeli_admin_user';

// 演示降级账号：仅当后端鉴权不可用时使用（后端就绪后由真实接口接管）
const DEMO_USERS: Record<string, AuthUser & { password: string }> = {
  'admin@lakeli.com': { id: 'demo-admin', email: 'admin@lakeli.com', name: '张超管', role: 'admin', password: 'admin123' },
  admin: { id: 'demo-admin', email: 'admin@lakeli.com', name: '张超管', role: 'admin', password: 'admin123' },
  'operator@lakeli.com': { id: 'demo-operator', email: 'operator@lakeli.com', name: '李运营', role: 'operator', password: 'operator123' },
  'sales@lakeli.com': { id: 'demo-sales', email: 'sales@lakeli.com', name: '王销售', role: 'sales', password: 'sales123' },
};

// 角色 → 中文标签
export const ROLE_LABELS: Record<string, string> = {
  admin: '超级管理员',
  operator: '运营',
  sales: '销售',
  user: '普通用户',
};

export function roleLabel(role?: string): string {
  return (role && ROLE_LABELS[role]) || '普通用户';
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoading(false);
  }, []);

  const persist = (next: AuthUser | null) => {
    setUser(next);
    if (next) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    // 1) 优先尝试真实后端鉴权
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success && data?.data) {
        const d = data.data;
        persist({
          id: d.id,
          email: d.email ?? email,
          name: d.name ?? email,
          avatar: d.avatar,
          role: d.role ?? 'user',
        });
        return { ok: true };
      }
      // 后端明确返回错误（如密码错误），不再兜底
      return { ok: false, error: data?.error || '登录失败' };
    } catch {
      // 网络异常：后端不可达，进入演示降级
    }

    // 2) 演示降级：后端不可用时接受已知演示账号
    const demo = DEMO_USERS[email];
    if (demo && demo.password === password) {
      console.warn('[auth] 后端鉴权不可用，已使用演示账号登录');
      const { password: _pw, ...user } = demo;
      persist(user);
      return { ok: true };
    }
    return { ok: false, error: '账号或密码错误' };
  }, []);

  const logout = useCallback(() => {
    persist(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth 必须在 AuthProvider 内使用');
  return ctx;
}

export const ADMIN_ROLE = 'admin';
export const OPERATOR_ROLE = 'operator';
export const SALES_ROLE = 'sales';
