'use client';

import { useEffect, useState } from 'react';
import {
  fetchKeTenants,
  fetchKeAccounts,
  type KeTenant,
  type KeAccount,
} from '@/lib/services/knowledge-engine-api';

// ---------- 通用 UI 组件（内联，保持页面自包含） ----------
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
  );
}

function Badge({ children, color = 'default' }: { children: React.ReactNode; color?: 'default' | 'green' | 'red' | 'blue' | 'orange' }) {
  const colors = {
    default: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}

function Table<T>({ columns, data, empty }: {
  columns: { key: string; title: string; render?: (row: T) => React.ReactNode }[];
  data: T[];
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3">{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400">{empty || '暂无数据'}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-gray-700">
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 border-b border-gray-200">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            active === t
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ---------- 页面 ----------
type PermTab = 'tenants' | 'accounts';

const roleLabels: Record<string, string> = {
  admin: '管理员',
  editor: '编辑者',
  viewer: '查看者',
};

export default function KePermissionsPage() {
  const [tab, setTab] = useState<PermTab>('tenants');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<KeTenant[]>([]);
  const [accounts, setAccounts] = useState<KeAccount[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tenantRes, accountRes] = await Promise.all([
        fetchKeTenants({ pageSize: 100 }),
        fetchKeAccounts({ pageSize: 100 }),
      ]);
      setTenants(tenantRes.data?.list ?? []);
      setAccounts(accountRes.data?.list ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const tenantColumns = [
    { key: 'company_name', title: '公司名称', render: (t: KeTenant) => <span className="font-medium">{t.company_name}</span> },
    { key: 'contact_person', title: '联系人', render: (t: KeTenant) => t.contact_person },
    { key: 'phone', title: '联系电话', render: (t: KeTenant) => <span className="text-gray-500">{t.phone}</span> },
    { key: 'industry', title: '行业', render: (t: KeTenant) => <span className="text-gray-500">{t.industry}</span> },
    {
      key: 'data_isolation',
      title: '数据隔离',
      render: (t: KeTenant) => <Badge color={t.data_isolation ? 'green' : 'orange'}>{t.data_isolation ? '已隔离' : '共享'}</Badge>,
    },
    { key: 'vector_space', title: '向量空间', render: (t: KeTenant) => <span className="text-gray-500">{t.vector_space}</span> },
    {
      key: 'knowledge_count',
      title: '知识条目',
      render: (t: KeTenant) => <span className="text-gray-500">{t.knowledge_count ?? 0}</span>,
    },
    {
      key: 'status',
      title: '状态',
      render: (t: KeTenant) => <Badge color={t.status === 'active' ? 'green' : 'red'}>{t.status === 'active' ? '启用' : '禁用'}</Badge>,
    },
    { key: 'created_at', title: '创建时间', render: (t: KeTenant) => <span className="text-gray-500">{t.created_at}</span> },
  ];

  const accountColumns = [
    { key: 'name', title: '账号名称', render: (a: KeAccount) => <span className="font-medium">{a.name}</span> },
    { key: 'tenant_name', title: '所属租户', render: (a: KeAccount) => <span className="text-gray-500">{a.tenant_name}</span> },
    {
      key: 'role',
      title: '角色',
      render: (a: KeAccount) => <Badge color="blue">{roleLabels[a.role] ?? a.role}</Badge>,
    },
    {
      key: 'status',
      title: '状态',
      render: (a: KeAccount) => <Badge color={a.status === 'active' ? 'green' : 'red'}>{a.status === 'active' ? '启用' : '禁用'}</Badge>,
    },
    { key: 'created_at', title: '创建时间', render: (a: KeAccount) => <span className="text-gray-500">{a.created_at}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">系统权限管理</h1>
          <p className="mt-1 text-sm text-gray-500">跨境外贸知识引擎 · 租户与账号权限</p>
        </div>
        <button
          onClick={load}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          刷新
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <Tabs
          tabs={['租户管理', '账号管理']}
          active={tab === 'tenants' ? '租户管理' : '账号管理'}
          onChange={(t) => setTab(t === '租户管理' ? 'tenants' : 'accounts')}
        />

        <div className="mt-4">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-400">加载中…</div>
          ) : tab === 'tenants' ? (
            <Table columns={tenantColumns} data={tenants} empty="暂无租户" />
          ) : (
            <Table columns={accountColumns} data={accounts} empty="暂无账号" />
          )}
        </div>
      </Card>
    </div>
  );
}
